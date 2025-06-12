from pydantic import BaseModel
from typing import List, Optional

class LessonRead(BaseModel):
    id: int
    title: str
    content: Optional[str]

    class Config:
        from_attributes = True

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None

class CourseRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    lessons: List[LessonRead] = []

    class Config:
        from_attributes = True