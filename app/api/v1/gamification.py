from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.points import Points
from app.models.achievement import Achievement
from app.schemas.gamification import PointsRead, AchievementRead
from app.api.v1.deps import get_current_user
from app.models.user import User
from typing import List

router = APIRouter(prefix="/gamification", tags=["gamification"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/points/me", response_model=PointsRead)
def get_my_points(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    points = db.query(Points).filter(Points.user_id == current_user.id).first()
    if not points:
        points = Points(user_id=current_user.id, total=0)
        db.add(points)
        db.commit()
        db.refresh(points)
    return points

@router.get("/achievements/me", response_model=List[AchievementRead])
def get_my_achievements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Achievement).filter(Achievement.user_id == current_user.id).all()