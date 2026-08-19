"""Pydantic schemas for prediction responses and RAG recommendations."""

from __future__ import annotations
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PredictionProbabilities(BaseModel):
    at_risk: float = Field(..., ge=0, le=1)
    needs_attention: float = Field(..., ge=0, le=1)
    on_track: float = Field(..., ge=0, le=1)


class RAGDocumentSchema(BaseModel):
    id: str
    category: str
    title: str
    description: str
    relevance_score: float
    action_items: List[str] = []


class RAGActionPlanDaySchema(BaseModel):
    day: int
    task: str


class RAGResourceSchema(BaseModel):
    name: str
    url: str
    type: str
    source_doc: Optional[str] = None


class RAGRecommendationSchema(BaseModel):
    risk_drivers: List[str]
    retrieved_documents: List[RAGDocumentSchema]
    action_plan: List[RAGActionPlanDaySchema]
    resources: List[RAGResourceSchema]
    rag_metadata: Dict[str, Any]


class PredictionResponse(BaseModel):
    prediction: str
    probabilities: PredictionProbabilities
    is_temporary: bool = False
    note: str = "Machine Learning Inference & RAG Vector Retrieval Complete."
    rag_recommendations: Optional[RAGRecommendationSchema] = None