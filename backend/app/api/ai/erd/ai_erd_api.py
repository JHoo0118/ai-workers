import json
from fastapi import APIRouter, Body, Depends, Response
from typing import Annotated, List
from pydantic import BaseModel

from app.model.ai.ai_model import ErdGenerateOutputs
from app.model.user.user_model import UserModel
from app.service.auth.jwt_bearer import JwtBearer
from app.service.ai.erd.ai_erd_service import AIErdService


router = APIRouter(
    prefix="/erd",
    tags=["ai"],
    dependencies=[],
    responses={404: {"description": "찾을 수 없습니다."}},
)


class ErdGenerateInputs(BaseModel):
    query: str

    @classmethod
    def __get_validators__(cls):
        yield cls.validate_to_json

    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return cls(**json.loads(value))
        return value


@router.post("/generate")
async def docs_summary_ask(
    email: Annotated[UserModel, Depends(JwtBearer(only_email=True))],
    body: ErdGenerateInputs = Body(...),
) -> ErdGenerateOutputs:
    query = body.query
    inputs = {"keys": {"query": query}}
    result = await AIErdService().invoke(email="email", inputs=inputs)
    return ErdGenerateOutputs(image=result)
