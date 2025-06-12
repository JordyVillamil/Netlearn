from pydantic import BaseModel
from typing import Optional

class LessonCreate(BaseModel):
    title: str
    content: Optional[str] = None
    course_id: int

class LessonRead(BaseModel):
    id: int
    title: str
    content: Optional[str]

    class Config:
        from_attributes = True