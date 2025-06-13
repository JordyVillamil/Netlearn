from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.schemas.enrollment import EnrollmentCreate, EnrollmentRead
from typing import List
from app.api.v1.deps import get_current_user
from app.models.user import User
from app.models.notification import Notification

router = APIRouter(prefix="/enrollments", tags=["enrollments"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=EnrollmentRead)
def enroll(
    enrollment: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verifica si ya está inscrito
    existing = db.query(Enrollment).filter_by(user_id=current_user.id, course_id=enrollment.course_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    # Verifica que el curso exista
    course = db.query(Course).filter_by(id=enrollment.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    new_enrollment = Enrollment(user_id=current_user.id, course_id=enrollment.course_id)
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)

    # Notificación automática
    notification = Notification(
    user_id=current_user.id,
    message=f"Te has inscrito exitosamente al curso ID {enrollment.course_id}."
    )
    db.add(notification)
    db.commit()

@router.get("/", response_model=List[EnrollmentRead])
def my_enrollments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Enrollment).filter_by(user_id=current_user.id).all()

@router.patch("/{enrollment_id}/progress", response_model=EnrollmentRead)
def update_progress(
    enrollment_id: int,
    progress: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    enrollment = db.query(Enrollment).filter_by(id=enrollment_id, user_id=current_user.id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    enrollment.progress = min(max(progress, 0), 100)
    db.commit()
    db.refresh(enrollment)
    return enrollment