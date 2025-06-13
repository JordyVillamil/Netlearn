from typing import List
from pydantic import BaseModel

class ExamSubmission(BaseModel):
    exam_id: int
    answers: List[int]

class GradeCreate(BaseModel):
    exam_id: int
    score: int

class GradeRead(BaseModel):
    id: int
    user_id: int
    exam_id: int
    score: int

    class Config:
        from_attributes = True