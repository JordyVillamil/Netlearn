from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import SessionLocal
from app.api.v1.deps import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
async def read_root():
    return {"message": "¡Bienvenido a la API de Cibernodo!"}

@router.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"db_status": "ok"}
    except Exception as e:
        return {"db_status": "error", "detail": str(e)}
    
@router.get("/private")
def private_route(current_user=Depends(get_current_user)):
    return {"message": f"Hola, {current_user.email}. Esta es una ruta protegida."}    