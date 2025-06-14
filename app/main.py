from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import root, auth, courses, users, enrollments, exams, questions, answers, grades, notifications, gamification

app = FastAPI(
    title="Cibernodo API",
    version="0.1.0"
)

# Define la lista de orígenes (frontends) que tienen permiso para conectarse.
origins = [
    "http://localhost:8080",      # Para desarrollo en la misma PC
    "http://127.0.0.1:8080",    # Alternativa para localhost
    "http://192.168.2.14:8080", # <-- TU IP LOCAL PARA PRUEBAS EN SMARTPHONE
    "null"                      # <-- PERMISO TEMPORAL para pruebas abriendo el archivo directamente (NO RECOMENDADO para producción)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
