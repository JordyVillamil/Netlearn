from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import root, auth, courses
from app.api.v1 import users
from app.api.v1 import enrollments
from app.api.v1 import exams
from app.api.v1 import questions, answers, grades
from app.api.v1 import notifications
from app.api.v1 import gamification

app = FastAPI(
    title="Cibernodo API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O ["http://localhost"] si quieres restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(root.router)
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(users.router)
app.include_router(enrollments.router)
app.include_router(exams.router)
app.include_router(questions.router)
app.include_router(answers.router)
app.include_router(grades.router)
app.include_router(notifications.router)
app.include_router(gamification.router)