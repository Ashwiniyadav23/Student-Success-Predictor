"""Student-related API routes.

Phase 1 exposes a temporary prediction endpoint so we can test the API shape
before replacing the logic with a trained machine learning model.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.schemas.prediction import PredictionResponse
from app.schemas.student import StudentPredictionInput
from app.services.prediction_service import predict_student_success


router = APIRouter(prefix="/students", tags=["students"])


@router.post("/predict", response_model=PredictionResponse)
def predict_student(student: StudentPredictionInput) -> PredictionResponse:
	"""Temporary rule-based baseline for Phase 1."""

	return predict_student_success(student)
