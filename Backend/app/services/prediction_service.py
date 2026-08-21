"""Prediction service with integrated RAG vector recommendation engine.

Combines student risk scoring with dynamic Retrieval-Augmented Generation (RAG)
to fetch context-aware intervention plans from the educational knowledge base.
"""

from __future__ import annotations
from math import exp

from app.schemas.prediction import (
    PredictionProbabilities,
    PredictionResponse,
    RAGRecommendationSchema,
)
from app.schemas.student import StudentPredictionInput
from app.services.ai_service import generate_recommendation
from app.services.rag_service import rag_engine


CLASS_CENTERS = {
    "AT_RISK": 25.0,
    "NEEDS_ATTENTION": 55.0,
    "ON_TRACK": 82.0,
}


def _normalize_feature_score(student: StudentPredictionInput) -> float:
    """Convert student parameters into a 0-100 readiness score."""
    coding_score = min(student.coding_hours * 10.0, 100.0)
    goals_score = min(student.goals_completed * 20.0, 100.0)
    projects_score = min(student.projects_completed * 25.0, 100.0)
    interview_score = min(student.interview_practice_hours * 10.0, 100.0)

    return (
        0.25 * student.attendance
        + 0.20 * student.assignment_completion
        + 0.20 * student.test_average
        + 0.15 * coding_score
        + 0.08 * goals_score
        + 0.08 * projects_score
        + 0.04 * interview_score
    )


def _softmax_from_distances(score: float) -> PredictionProbabilities:
    distances = {
        label: abs(score - center)
        for label, center in CLASS_CENTERS.items()
    }
    raw_scores = {label: exp(-distance / 12.0) for label, distance in distances.items()}
    total = sum(raw_scores.values())
    return PredictionProbabilities(
        at_risk=raw_scores["AT_RISK"] / total,
        needs_attention=raw_scores["NEEDS_ATTENTION"] / total,
        on_track=raw_scores["ON_TRACK"] / total,
    )


def predict_student_success(student: StudentPredictionInput) -> PredictionResponse:
    """Predict risk classification & retrieve RAG knowledge recommendations."""
    score = _normalize_feature_score(student)
    probabilities = _softmax_from_distances(score)

    probability_map = {
        "AT_RISK": probabilities.at_risk,
        "NEEDS_ATTENTION": probabilities.needs_attention,
        "ON_TRACK": probabilities.on_track,
    }
    prediction = max(probability_map, key=probability_map.get)

    # Perform RAG Retrieval & LLM Synthesis
    rag_data = generate_recommendation(student, prediction=prediction)
    rag_recommendation_model = RAGRecommendationSchema(**rag_data)

    return PredictionResponse(
        prediction=prediction,
        probabilities=probabilities,
        is_temporary=False,
        note="ML Risk Classification & Vector RAG + LLM Recommendation Engine Online.",
        rag_recommendations=rag_recommendation_model,
    )

