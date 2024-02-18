import os
import time
import uuid
import aiofiles
import pathlib

from typing import List
from fastapi import UploadFile
from pdf2docx import parse
from app.const import *


async def get_pdf_to_word_result(files: List[UploadFile]) -> List[str]:
    try:
        u4 = uuid.uuid4()
        result_list = []
        output_dir = file_output_dir["docx"]
        tmp_dir = file_output_dir["tmp"]

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        if not os.path.exists(tmp_dir):
            os.makedirs(tmp_dir)

        for file in files:
            curr_ms = round(time.time() * 1000)

            input_filename = file.filename
            input_filename_except_extension = input_filename.split(".pdf")[0]
            input_file_tmp_path = f"{tmp_dir}/{file.filename}"

            output_filename_except_dir = (
                f"{input_filename_except_extension}_{u4}_{curr_ms}.docx"
            )
            output_filename = f"{output_dir}/{output_filename_except_dir}"

            async with aiofiles.open(input_file_tmp_path, "wb") as out_file:
                content = await file.read()
                await out_file.write(content)

            parse(input_file_tmp_path, output_filename, start=0, end=None)
            result_list.append(output_filename_except_dir)

            pathlib.Path(input_file_tmp_path).unlink(missing_ok=True)

        return result_list

    except FileNotFoundError:
        raise ("해당 파일을 찾을 수 없습니다.")
    except KeyError:
        raise ("올바른 파일인지 확인해 주세요.")
    except UnicodeDecodeError as e:
        raise e
    except Exception:
        pathlib.Path(input_file_tmp_path).unlink(missing_ok=True)
