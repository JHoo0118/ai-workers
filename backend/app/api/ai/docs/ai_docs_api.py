from typing import Annotated
from fastapi import APIRouter, Depends, Response, UploadFile, Body
from fastapi.responses import StreamingResponse

from app.model.user.user_model import UserModel
from app.service.ai.docs.ai_docs_service import AIDocsService
from app.service.auth.jwt_bearer import JwtBearer
from app.service.ai.docs.ai_docs_agent_service import AIDocsAgentService
from app.model.ai.docs.ai_docs_model import DocsSummaryAskInputs, DocsSummaryAskOutputs


router = APIRouter(
    prefix="/docs",
    tags=["ai"],
    dependencies=[],
    responses={404: {"description": "찾을 수 없습니다."}},
)


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
    body: DocsSummaryAskInputs = Body(...),
) -> StreamingResponse:
    lastMessage = body.messages[-1]

    return StreamingResponse(
        AIDocsService().invoke_chain(
            email=email,
            filename=filename,
            message=lastMessage.content,
        ),
    )


@router.post("/summary/agent")
async def docs_summary_agent(
    email: Annotated[UserModel, Depends(JwtBearer(only_email=True))],
    file: UploadFile,
) -> bool:
    if file is None:
        return False

    AIDocsAgentService().embed_file(
        email=email,
        file=file,
    )
    return True


@router.post("/ask/agent/{filename}")
async def docs_summary_ask_agent(
    email: Annotated[UserModel, Depends(JwtBearer(only_email=True))],
    filename: str,
    body: DocsSummaryAskInputs = Body(...),
) -> Response:
    lastMessage = body.messages[-1]

    result = await AIDocsAgentService().invoke_chain(
        email=email,
        filename=filename,
        message=lastMessage.content,
    )

    return Response(content=result)
