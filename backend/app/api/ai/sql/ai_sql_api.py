from typing import Annotated
from fastapi import APIRouter, Body, Depends
from app.service.auth.jwt_bearer import JwtBearer
from app.service.ai.code_convert.ai_code_convert_service import AICodeConvertService
from app.model.user.user_model import UserModel
from app.model.ai.sql.ai_sql_model import (
    SqlToEntityGenerateInputs,
    SqlToEntityGenerateOutputs,
)
from app.service.ai.sql.ai_sql_service import AISqlService

router = APIRouter(
    prefix="/sql",
    tags=["ai"],
    dependencies=[],
    responses={404: {"description": "찾을 수 없습니다."}},
)


@router.post("/entity/generate")
async def sql_to_entity(
    # email: Annotated[UserModel, Depends(JwtBearer(only_email=True))],
    body: SqlToEntityGenerateInputs = Body(...),
) -> SqlToEntityGenerateOutputs:
    pass
    result = await AISqlService().invoke_chain(email="email", inputs=body)
    return SqlToEntityGenerateOutputs(result=result)
