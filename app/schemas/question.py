from pydantic import BaseModel
from typing import List, Optional

class QuestionCreate(BaseModel):
    text: str
    exam_id: int

class QuestionRead(BaseModel):
    id: int
    text: str
    exam_id: int

    class Config:
        from_attributes = True