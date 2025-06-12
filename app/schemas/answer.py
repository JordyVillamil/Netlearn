from pydantic import BaseModel

class AnswerCreate(BaseModel):
    text: str
    is_correct: bool
    question_id: int

class AnswerRead(BaseModel):
    id: int
    text: str
    is_correct: bool
    question_id: int

    class Config:
        from_attributes = True