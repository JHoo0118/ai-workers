import json
from openai import BaseModel
from pydantic import Field


class ApiGenerateInputs(BaseModel):
    input: str
    framework: str

    @classmethod
    def __get_validators__(cls):
        yield cls.validate_to_json

    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return cls(**json.loads(value))
        return value


class ApiGenerateOutputs(BaseModel):
    backend_code: str = Field("생성된 백엔드 코드")
