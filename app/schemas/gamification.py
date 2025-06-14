from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PointsRead(BaseModel):
    user_id: int
    total: int

    class Config:
        from_attributes = True

class AchievementRead(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str]
    earned_at: datetime

    class Config:
        from_attributes = True