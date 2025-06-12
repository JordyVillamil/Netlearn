from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserRead
from app.schemas.token import Token
from app.models.user import User
from app.core.database import SessionLocal
from app.core.security import get_password_hash, verify_password, create_access_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=UserRead)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_pw, role="student")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == form_data.username).first()
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

from datetime import timedelta
from app.schemas.user import PasswordResetRequest, PasswordResetConfirm
from app.core.security import decode_access_token

@router.post("/password-reset/request")
def password_reset_request(
    data: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        return {"msg": "If the email exists, a reset link will be sent."}
    reset_token = create_access_token({"sub": user.email}, expires_delta=timedelta(minutes=15))
    # En producción, aquí enviarías el token por email
    print(f"Token de recuperación para {user.email}: {reset_token}")
    return {"msg": "If the email exists, a reset link will be sent.", "reset_token": reset_token}  # Solo para pruebas

@router.post("/password-reset/confirm")
def password_reset_confirm(
    data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    payload = decode_access_token(data.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"msg": "Password updated successfully"}