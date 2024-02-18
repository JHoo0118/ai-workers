from pydantic import BaseModel, Field
from typing import Dict, List, Union


class ChatModel(BaseModel):
    role: str
    content: Union[str, List[Union[str, Dict]]]


class ErdGenerateOutputs(BaseModel):
    image: str = Field("생성된 ERD 이미지")
