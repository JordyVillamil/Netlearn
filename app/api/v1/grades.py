from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.grade import Grade
from app.schemas.grade import GradeCreate, GradeRead
from app.api.v1.deps import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/grades", tags=["grades"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=GradeRead)
def submit_grade(grade: GradeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_grade = Grade(user_id=current_user.id, exam_id=grade.exam_id, score=grade.score)
    db.add(db_grade)
    db.commit()
    db.refresh(db_grade)
    return db_grade

@router.get("/me", response_model=List[GradeRead])
def my_grades(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Grade).filter(Grade.user_id == current_user.id).all()