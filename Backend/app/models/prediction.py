"""Prediction ORM model for storing prediction history."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    prediction = Column(String(50), nullable=False)
    at_risk_probability = Column(Float, nullable=False)
    needs_attention_probability = Column(Float, nullable=False)
    on_track_probability = Column(Float, nullable=False)
    model_version = Column(String(50), nullable=False, default="phase-1-temp")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    student = relationship("Student", backref="predictions")