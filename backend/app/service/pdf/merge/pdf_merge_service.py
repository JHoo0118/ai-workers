import os
import time
import uuid

from typing import List
from fastapi import UploadFile
from pypdf import PdfWriter
from app.const import *


def get_pdf_merge_result(files: List[UploadFile]) -> str:
    merger = PdfWriter()
    first_filename = files[0].filename.split(".pdf")[0]
    output_dir = file_output_dir["pdf"]

    for pdf in files:
        merger.append(pdf.file)

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    curr_ms = round(time.time() * 1000)
    u4 = uuid.uuid4()

    filename = f"merged-{first_filename}_{u4}_{curr_ms}.pdf"

    merger.write(f"{output_dir}/{filename}")
    merger.close()

    return filename
