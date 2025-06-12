from app.core.database import engine, Base
from app.models.user import User
from app.models.course import Course
from app.models.lesson import Lesson
# ...existing code...

def init():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init()