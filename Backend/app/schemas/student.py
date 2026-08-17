from pydantic import BaseModel, Field
from typing import Optional

class StudentInput(BaseModel):
    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage")
    assignment_completion: float = Field(..., ge=0, le=100, description="Assignment completion percentage")
    test_average: float = Field(..., ge=0, le=100, description="Average test score")
    coding_hours: float = Field(..., ge=0, description="Daily coding hours")
    goals_completed: float = Field(..., ge=0, description="Weekly goals completed")
    projects_completed: float = Field(..., ge=0, description="Projects completed")
    interview_practice_hours: float = Field(..., ge=0, description="Interview practice hours per week")

class PredictionProbabilities(BaseModel):
    at_risk: float
    needs_attention: float
    on_track: float

class PredictionResponse(BaseModel):
    prediction: str
    probabilities: PredictionProbabilities
    is_temporary: Optional[bool] = False
    note: Optional[str] = None
