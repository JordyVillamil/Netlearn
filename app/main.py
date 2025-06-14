from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import root, auth, courses, users, enrollments, exams, questions, answers, grades, notifications, gamification

app = FastAPI(
    title="Cibernodo API",
    version="0.1.0"
)

# --- INICIO DE LA MODIFICACIÓN ---

# Define la lista de orígenes (frontends) que tienen permiso para conectarse.
# Es más seguro ser explícito que usar un comodín "*".
origins = [
    "http://localhost:8080",  # El origen de tu frontend en desarrollo
    "http://127.0.0.1:8080", # A menudo es bueno incluir también la IP de loopback
    "http://localhost",       # En caso de que se acceda sin puerto
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # <--- Cambio clave: Usamos nuestra lista específica
    allow_credentials=True,      # Permite el envío de cookies/tokens de autorización
    allow_methods=["*"],         # Permite todos los métodos (GET, POST, PUT, etc.)
    allow_headers=["*"],         # Permite todas las cabeceras en las peticiones
)

# --- FIN DE LA MODIFICACIÓN ---

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