from pydantic import BaseModel
from typing import List, Optional

class ExamCreate(BaseModel):
    title: str
    course_id: int

class ExamRead(BaseModel):
    id: int
    title: str
    course_id: int

    class Config:
        from_attributes = True