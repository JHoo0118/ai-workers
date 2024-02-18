import os
import pathlib

from fastapi import APIRouter
from fastapi.responses import FileResponse
from app.model.file import *
from app.const import file_output_dir
from app.service.file.file_service import getFileExtension

router = APIRouter(
    prefix="/file",
    tags=["file"],
    dependencies=[],
    responses={404: {"description": "찾을 수 없습니다."}},
)


@router.get(
    "/exist",
    response_model=IsExistFileOutputs,
    summary="존재하는 파일인지 확인",
    description="파일명과 파일 확장자를 입력 받아서 존재하는 파일인지 확인합니다.",
    response_description="isExist가 true면 존재하고, false이면 존재하지 않는 파일입니다.",
)
async def is_exist_file(filename: str) -> IsExistFileOutputs:
    fileType = getFileExtension(filename)
    isExist = True
    if not os.path.exists(f"{file_output_dir[fileType]}/{filename}"):
        isExist = False

    return IsExistFileOutputs(isExist=isExist)


@router.get("/download/{filename}")
async def file_download(filename: str) -> FileResponse:
    fileType = getFileExtension(filename)
    return FileResponse(
        f"{file_output_dir[fileType]}/{filename}",
        media_type="application/pdf",
        filename=filename,
    )


@router.delete("/delete/{filename}")
async def file_delete(filename: str) -> bool:
    fileType = getFileExtension(filename)
    filePath = f"{file_output_dir[fileType]}/{filename}"
    try:
        pathlib.Path(filePath).unlink(missing_ok=False)
        return True
    except FileNotFoundError:
        return False
