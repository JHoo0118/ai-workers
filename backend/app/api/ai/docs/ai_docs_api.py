import json
from typing import Annotated, List
from pydantic import BaseModel
from fastapi import APIRouter, Depends, UploadFile, Body
from fastapi.responses import StreamingResponse

from app.model.user.user_model import UserModel
from app.service.ai.docs.ai_docs_service import AIDocsService
from app.service.auth.jwt_bearer import JwtBearer
from app.service.ai.docs.ai_docs_agent_service import AIDocsAgentService
from app.model.ai.ai_model import ChatModel


router = APIRouter(
    prefix="/docs",
    tags=["ai"],
    dependencies=[],
    responses={404: {"description": "찾을 수 없습니다."}},
)


class DocsSummaryAsk(BaseModel):
    messages: List[ChatModel]

    @classmethod
    def __get_validators__(cls):
        yield cls.validate_to_json

    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return cls(**json.loads(value))
        return value


@router.post("/summary")
async def docs_summary(
    email: Annotated[UserModel, Depends(JwtBearer(only_email=True))],
    file: UploadFile,
) -> bool:
    if file is None:
        return False

    AIDocsService().embed_file(
        email=email,
        file=file,
    )
    return True


@router.post("/ask/{filename}")
async def docs_summary_ask(
    email: Annotated[UserModel, Depends(JwtBearer(only_email=True))],
    filename: str,
    body: DocsSummaryAsk = Body(...),
) -> StreamingResponse:
    lastMessage = body.messages[-1]

    return StreamingResponse(
        AIDocsService().invoke_chain(
            email=email,
            filename=filename,
            message=lastMessage.content,
        ),
    )
