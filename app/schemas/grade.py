from pydantic import BaseModel

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