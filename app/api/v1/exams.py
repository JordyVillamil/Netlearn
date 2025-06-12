from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.exam import Exam
from app.schemas.exam import ExamCreate, ExamRead
from typing import List

router = APIRouter(prefix="/exams", tags=["exams"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ExamRead)
def create_exam(exam: ExamCreate, db: Session = Depends(get_db)):
    db_exam = Exam(**exam.dict())
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

@router.get("/", response_model=List[ExamRead])
def list_exams(db: Session = Depends(get_db)):
    return db.query(Exam).all()