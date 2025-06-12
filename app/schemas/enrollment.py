from pydantic import BaseModel

class EnrollmentCreate(BaseModel):
    course_id: int

class EnrollmentRead(BaseModel):
    id: int
    user_id: int
    course_id: int
    progress: int
    active: bool

    class Config:
        from_attributes = True