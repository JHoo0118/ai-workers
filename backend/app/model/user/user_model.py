from pydantic import BaseModel, EmailStr, Field
from prisma.models import User


class UserModel(User):
    email: EmailStr = Field("Email")


class CreateUserInputs(BaseModel):
    email: EmailStr = Field("Email")
    password: str = Field("Password")
    username: str = Field("Username")


class CreateUserOutputs(UserModel):
    pass
