"""AI Recommendation Service using Vector RAG Knowledge Retrieval."""

from app.schemas.student import StudentPredictionInput
from app.services.rag_service import rag_engine


def generate_recommendation(student: StudentPredictionInput):
    """Retrieve tailored intervention recommendations via RAG."""
    return rag_engine.retrieve_recommendations(student)