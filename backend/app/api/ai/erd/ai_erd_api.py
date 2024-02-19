from fastapi import APIRouter, Body, Depends
from typing import Annotated

from app.model.user.user_model import UserModel
from app.service.auth.jwt_bearer import JwtBearer
from app.service.ai.erd.ai_erd_service import AIErdService
from app.model.ai.erd.ai_erd_model import ErdGenerateInputs, ErdGenerateOutputs


router = APIRouter(
    prefix="/erd",
    tags=["ai"],
    dependencies=[],
    responses={404: {"description": "찾을 수 없습니다."}},
)


@router.post("/generate")
async def erd_generate(
    email: Annotated[UserModel, Depends(JwtBearer(only_email=True))],
    body: ErdGenerateInputs = Body(...),
) -> ErdGenerateOutputs:
    result = await AIErdService().invoke(email=email, inputs=body)
    return ErdGenerateOutputs(image=result)
