from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.course import Course
from app.models.lesson import Lesson
from app.schemas.course import CourseCreate, CourseRead
from app.schemas.lesson import LessonCreate, LessonRead
from typing import List

router = APIRouter(prefix="/courses", tags=["courses"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CURSOS
@router.post("/", response_model=CourseRead)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    db_course = Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/", response_model=List[CourseRead])
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@router.get("/{course_id}", response_model=CourseRead)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.delete("/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"msg": "Course deleted"}

# LECCIONES
@router.post("/{course_id}/lessons", response_model=LessonRead)
def create_lesson(course_id: int, lesson: LessonCreate, db: Session = Depends(get_db)):
    db_lesson = Lesson(title=lesson.title, content=lesson.content, course_id=course_id)
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

@router.get("/{course_id}/lessons", response_model=List[LessonRead])
def list_lessons(course_id: int, db: Session = Depends(get_db)):
    return db.query(Lesson).filter(Lesson.course_id == course_id).all()