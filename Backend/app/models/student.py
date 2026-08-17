from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from app.database import Base

class StudentRecord(Base):
    __tablename__ = "student_records"

    id = Column(Integer, primary_key=True, index=True)
    attendance = Column(Float, nullable=False)
    assignment_completion = Column(Float, nullable=False)
    test_average = Column(Float, nullable=False)
    coding_hours = Column(Float, nullable=False)
    goals_completed = Column(Float, nullable=False)
    projects_completed = Column(Float, nullable=False)
    interview_practice_hours = Column(Float, nullable=False)
    prediction = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
