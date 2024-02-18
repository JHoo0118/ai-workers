from typing import Annotated
from fastapi import APIRouter, Body, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from app.model.auth.auth_model import (
    LogInOutputs,
    RefreshTokensInputs,
    RefreshTokensOutputs,
    SignUpInputs,
    SignUpOutputs,
)
from app.service.auth.auth_service import AuthService
from app.service.auth.jwt_bearer import JwtBearer


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    dependencies=[],
    responses={404: {"description": "찾을 수 없습니다."}},
)


@router.post("/login")
async def login(
    response: Response, data: OAuth2PasswordRequestForm = Depends()
) -> LogInOutputs:
    login_outputs: LogInOutputs = await AuthService().login(data)
    response.set_cookie(key="accessToken", value=login_outputs.access_token)
    response.set_cookie(key="refreshToken", value=login_outputs.refresh_token)
    return login_outputs


@router.post("/signup")
async def sign_up(
    response: Response, sign_up_inputs: SignUpInputs = Body(...)
) -> SignUpOutputs:
    sign_up_outputs: SignUpOutputs = await AuthService().sign_up(sign_up_inputs)
    response.set_cookie(
        key="accessToken",
        value=sign_up_outputs.access_token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
    )
    response.set_cookie(
        key="refreshToken",
        value=sign_up_outputs.refresh_token,
        httponly=True,
        max_age=60 * 60 * 24 * 7,
    )
    return sign_up_outputs


@router.post("/logout")
async def logout(
    response: Response, email: Annotated[str, Depends(JwtBearer())]
) -> bool:
    response.delete_cookie(key="accessToken")
    response.delete_cookie(key="refreshToken")
    return await AuthService().logout(email)


# @router.post('/refresh-tokens', dependencies=[Depends(JwtBearer())])
@router.post(
    "/refresh-tokens",
)
async def refresh_tokens(
    response: Response,
    refresh_token_inputs: RefreshTokensInputs,
) -> RefreshTokensOutputs:
    refresh_tokens_outputs: RefreshTokensOutputs = await AuthService().refresh_tokens(
        email=refresh_token_inputs.email, rt=refresh_token_inputs.refresh_token
    )
    response.set_cookie(key="accessToken", value=refresh_tokens_outputs.access_token)
    response.set_cookie(key="refreshToken", value=refresh_tokens_outputs.refresh_token)
    return refresh_tokens_outputs
