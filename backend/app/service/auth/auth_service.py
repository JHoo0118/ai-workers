from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated

from app.db.prisma import prisma
from app.model.auth.auth_model import (
    LogInOutputs,
    RefreshTokensOutputs,
    SignUpInputs,
    SignUpOutputs,
)
from app.model.user.user_model import UserModel
from app.service.auth.jwt_service import JwtService
from app.service.user.user_service import UserService
from prisma.models import User
from prisma.errors import UniqueViolationError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


class AuthService(object):
    _instance = None

    _jwtService: JwtService = None
    _userService: UserService = None

    def __new__(class_, *args, **kwargs):
        if not isinstance(class_._instance, class_):
            class_._instance = object.__new__(class_, *args, **kwargs)

        return class_._instance

    def __init__(self) -> None:
        self._jwtService = JwtService()
        self._userService = UserService()

    async def authenticate_user(self, email: str, password: str) -> UserModel:
        user = await self._userService.get_user(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="존재하지 않는 이메일이거나 비밀번호가 틀렸습니다.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        elif not self._userService.verify_hash(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="비밀번호가 틀렸습니다.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user

    def hash_refresh_token(self, encoded_jwt: str) -> str:
        return self._userService.get_hash(encoded_jwt)

    async def logout(self, email: str) -> bool:
        try:
            prisma.refreshtoken.delete(where={"userEmail": email})
            return True
        except:
            return False

    async def get_current_user(
        self, token: Annotated[str, Depends(oauth2_scheme)]
    ) -> UserModel:
        email = await self._jwtService.verify_token(
            token=token, token_key=self._jwtService.access_token_key
        )

        user = await self._userService.get_user(email=email)
        if user is None:
            raise self._jwtService.credentials_exception
        return user

    async def get_current_active_user(
        current_user: Annotated[UserModel, Depends(get_current_user)]
    ):
        if current_user.disabled:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user

    async def login(self, data: OAuth2PasswordRequestForm = Depends()):
        email = data.username
        password = data.password

        user = await self.authenticate_user(email=email, password=password)

        access_token, refresh_token = self._jwtService.get_tokens(
            data={"sub": user.email},
        )

        await self.update_rt_hash(email=user.email, rt=refresh_token)

        return LogInOutputs(
            access_token=access_token,
            refresh_token=refresh_token,
        )

    async def sign_up(self, sign_up_inputs: SignUpInputs) -> SignUpOutputs:
        try:
            with prisma.tx() as transaction:
                sign_up_inputs.password = self._userService.get_hash(
                    sign_up_inputs.password
                )
                user: User = transaction.user.create(data=sign_up_inputs.model_dump())

                access_token, refresh_token = self._jwtService.get_tokens(
                    data={"sub": user.email},
                )

            await self.update_rt_hash(email=user.email, rt=refresh_token)

            return SignUpOutputs(
                access_token=access_token,
                refresh_token=refresh_token,
            )
        except UniqueViolationError as e:
            errTarget = (
                "이메일" if str(e.data["error"]).find("email") != -1 else "사용자명"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"이미 존재하는 {errTarget}입니다.",
            )

    async def update_rt_hash(self, email: str, rt: str) -> None:
        hash = self._userService.get_hash(rt)
        with prisma.tx() as transaction:
            transaction.refreshtoken.upsert(
                where={"userEmail": email},
                data={
                    "create": {
                        "token": hash,
                        "userEmail": email,
                    },
                    "update": {
                        "token": hash,
                    },
                },
            )

            transaction.user.update(
                where={"email": email},
                data={"refreshToken": {"connect": {"userEmail": email}}},
            )

    async def refresh_tokens(self, email: str, rt: str) -> RefreshTokensOutputs:
        user: User = prisma.user.find_unique(
            where={"email": email}, include={"refreshToken": True}
        )

        if not user or user.refreshToken == None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Access Denied.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        verify_hash_result = self._userService.verify_hash(rt, user.refreshToken.token)

        if not verify_hash_result:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        await self._jwtService.verify_token(rt, self._jwtService.refresh_token_key)

        access_token, refresh_token = self._jwtService.get_tokens(
            data={"sub": user.email},
        )

        await self.update_rt_hash(email=email, rt=refresh_token)

        return RefreshTokensOutputs(
            access_token=access_token, refresh_token=refresh_token
        )
