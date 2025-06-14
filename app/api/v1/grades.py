# Bloque de importaciones corregido y unificado
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.deps import get_current_user
from app.core.database import SessionLocal
from app.models.answer import Answer
from app.models.exam import Exam
from app.models.grade import Grade
from app.models.user import User
from app.schemas.grade import ExamSubmission, GradeCreate, GradeRead
from app.models.notification import Notification
from app.models.points import Points
from app.models.achievement import Achievement


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

@router.post("/submit-exam", response_model=GradeRead)
def submit_exam(
    submission: ExamSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. OBTENER EXAMEN Y VALIDAR
    exam = db.query(Exam).filter(Exam.id == submission.exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    questions = exam.questions
    if not questions:
        raise HTTPException(status_code=400, detail="Exam has no questions")

    # 2. CALCULAR PUNTAJE
    correct_answer_ids = {a.id for q in questions for a in q.answers if a.is_correct}
    user_correct = sum(1 for ans_id in submission.answers if ans_id in correct_answer_ids)
    total_questions = len(questions)
    score = round((user_correct / total_questions) * 100) if total_questions > 0 else 0

    # 3. PREPARAR TODOS LOS OBJETOS PARA LA BASE DE DATOS
    
    # Guardar calificación
    db_grade = Grade(user_id=current_user.id, exam_id=exam.id, score=score)
    db.add(db_grade)

    # Crear notificación
    notification = Notification(
        user_id=current_user.id,
        message=f"Has completado el examen '{exam.title}' con una calificación de {score}%."
    )
    db.add(notification)
    
    # Actualizar puntos del usuario
    points = db.query(Points).filter(Points.user_id == current_user.id).first()
    if not points:
        points = Points(user_id=current_user.id, total=0)
        db.add(points)
    points.total += 10  # Por ejemplo, 10 puntos por examen completado

    # Otorgar logro si cumple la condición
    if points.total == 10:
        achievement_exists = db.query(Achievement).filter_by(user_id=current_user.id, name="¡Primer examen!").first()
        if not achievement_exists:
            achievement = Achievement(
                user_id=current_user.id,
                name="¡Primer examen!",
                description="Completaste tu primer examen."
            )
            db.add(achievement)

    # 4. CONFIRMAR TODOS LOS CAMBIOS CON UN SOLO COMMIT
    db.commit()
    db.refresh(db_grade)

    # 5. RETORNAR EL RESULTADO AL FINAL
    return db_grade