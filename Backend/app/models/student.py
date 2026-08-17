"""Student ORM model."""

from __future__ import annotations
from datetime import datetime
from sqlalchemy import Column, DateTime, Float, Integer, String, JSON
from app.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=False, unique=True, index=True)
    attendance = Column(Float, nullable=False)
    assignment_completion = Column(Float, nullable=False)
    test_average = Column(Float, nullable=False)
    coding_hours = Column(Float, nullable=False)
    goals_completed = Column(Integer, nullable=False)
    projects_completed = Column(Integer, nullable=False)
    interview_practice_hours = Column(Float, nullable=False)
    prediction = Column(String(50), nullable=False, default="ON_TRACK")
    attendance_records = Column(JSON, nullable=True, default=list)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
