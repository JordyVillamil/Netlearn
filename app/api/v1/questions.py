from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.question import Question
from app.schemas.question import QuestionCreate, QuestionRead
from typing import List

router = APIRouter(prefix="/questions", tags=["questions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=QuestionRead)
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    db_question = Question(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("/exam/{exam_id}", response_model=List[QuestionRead])
def list_questions(exam_id: int, db: Session = Depends(get_db)):
    return db.query(Question).filter(Question.exam_id == exam_id).all()