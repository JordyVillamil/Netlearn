from fastapi import FastAPI
from app.api.v1 import root, auth, courses


app = FastAPI(
    title="Cibernodo API",
    version="0.1.0"
)

app.include_router(root.router)
app.include_router(auth.router)
app.include_router(courses.router)