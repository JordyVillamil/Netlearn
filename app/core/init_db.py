from app.core.database import engine, Base
from app.models.user import User
from app.models.course import Course
from app.models.lesson import Lesson
from app.models.exam import Exam
from app.models.question import Question
from app.models.answer import Answer
from app.models.grade import Grade
# ...existing code...

def init():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init()