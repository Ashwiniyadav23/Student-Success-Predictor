"""Pydantic schemas for student input data."""

from __future__ import annotations

from pydantic import BaseModel, Field


class StudentPredictionInput(BaseModel):
    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage")
    assignment_completion: float = Field(..., ge=0, le=100, description="Assignment completion percentage")
    test_average: float = Field(..., ge=0, le=100, description="Average test score percentage")
    coding_hours: float = Field(..., ge=0, description="Coding practice hours per week")
    goals_completed: int = Field(..., ge=0, description="Number of goals completed")
    projects_completed: int = Field(..., ge=0, description="Number of projects completed")
    interview_practice_hours: float = Field(..., ge=0, description="Interview practice hours per week")