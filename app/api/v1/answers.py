from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.answer import Answer
from app.schemas.answer import AnswerCreate, AnswerRead
from typing import List

router = APIRouter(prefix="/answers", tags=["answers"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=AnswerRead)
def create_answer(answer: AnswerCreate, db: Session = Depends(get_db)):
    db_answer = Answer(**answer.dict())
    db.add(db_answer)
    db.commit()
    db.refresh(db_answer)
    return db_answer

@router.get("/question/{question_id}", response_model=List[AnswerRead])
def list_answers(question_id: int, db: Session = Depends(get_db)):
    return db.query(Answer).filter(Answer.question_id == question_id).all()