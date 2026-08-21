"""AI Recommendation Service using Vector RAG Knowledge Retrieval and LLM Synthesis."""

from app.schemas.student import StudentPredictionInput
from app.services.rag_service import rag_engine
from app.services.llm_service import llm_engine


def generate_recommendation(student: StudentPredictionInput, prediction: str = "ON_TRACK"):
    """Retrieve tailored intervention recommendations via RAG and synthesize via LLM."""
    rag_data = rag_engine.retrieve_recommendations(student)

    # Generate LLM synthesized coaching advice
    llm_output = llm_engine.generate_recommendation(
        student=student,
        prediction=prediction,
        risk_drivers=rag_data.get("risk_drivers", []),
        rag_docs=rag_data.get("retrieved_documents", []),
    )

    rag_data.update(llm_output)
    return rag_data