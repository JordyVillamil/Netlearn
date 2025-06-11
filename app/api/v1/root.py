from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_root():
    return {"message": "¡Bienvenido a la API de Cibernodo!"}