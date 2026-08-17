"""Pydantic schemas for student-wise data and prediction inputs."""

from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field

class AttendanceRecord(BaseModel):
    date: str = Field(..., description="Date of attendance record (YYYY-MM-DD)")
    status: str = Field(..., description="Status: PRESENT, ABSENT, LATE, EXCUSED")
    session_name: str = Field(..., description="Name of the session/class")
    notes: Optional[str] = Field(None, description="Additional remarks or notes")

class StudentPredictionInput(BaseModel):
    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage")
    assignment_completion: float = Field(..., ge=0, le=100, description="Assignment completion percentage")
    test_average: float = Field(..., ge=0, le=100, description="Average test score percentage")
    coding_hours: float = Field(..., ge=0, description="Coding practice hours per week")
    goals_completed: int = Field(..., ge=0, description="Number of goals completed")
    projects_completed: int = Field(..., ge=0, description="Number of projects completed")
    interview_practice_hours: float = Field(..., ge=0, description="Interview practice hours per week")

class StudentDetail(BaseModel):
    id: str = Field(..., description="Unique student ID")
    name: str = Field(..., description="Student full name")
    email: str = Field(..., description="Student email address")
    attendance: float = Field(..., ge=0, le=100, description="Overall attendance percentage")
    assignment_completion: float = Field(..., ge=0, le=100)
    test_average: float = Field(..., ge=0, le=100)
    coding_hours: float = Field(..., ge=0)
    goals_completed: int = Field(..., ge=0)
    projects_completed: int = Field(..., ge=0)
    interview_practice_hours: float = Field(..., ge=0)
    prediction: str = Field(..., description="ON_TRACK, NEEDS_ATTENTION, or AT_RISK")
    attendance_records: List[AttendanceRecord] = Field(default_factory=list, description="Individual date-wise attendance logs")