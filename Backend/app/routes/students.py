"""Student-related API routes."""

from __future__ import annotations
from typing import Any, Dict, List
from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionResponse, RAGRecommendationSchema
from app.schemas.student import StudentPredictionInput, StudentDetail
from app.services.prediction_service import predict_student_success
from app.services.student_service import get_all_students, get_student_by_id
from app.services.ai_service import generate_recommendation

router = APIRouter(prefix="/students", tags=["students"])

@router.get("", response_model=List[StudentDetail])
@router.get("/", response_model=List[StudentDetail])
def list_students() -> List[StudentDetail]:
    """Retrieve list of all students organized student-wise with attendance logs."""
    return get_all_students()

@router.post("/predict", response_model=PredictionResponse)
def predict_student(student: StudentPredictionInput) -> PredictionResponse:
    """Predict student success probability and retrieve RAG recommendations."""
    return predict_student_success(student)

@router.post("/rag-recommendations", response_model=RAGRecommendationSchema)
def get_rag_recommendations(student: StudentPredictionInput) -> RAGRecommendationSchema:
    """Retrieve vector RAG educational intervention recommendations."""
    data = generate_recommendation(student)
    return RAGRecommendationSchema(**data)

@router.get("/{student_id}", response_model=StudentDetail)
def get_student(student_id: str) -> StudentDetail:
    """Retrieve detailed student information by ID including full attendance history."""
    student = get_student_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student
