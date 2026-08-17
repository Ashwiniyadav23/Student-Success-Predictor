"""Pydantic schemas for prediction responses."""

from __future__ import annotations

from pydantic import BaseModel, Field


class PredictionProbabilities(BaseModel):
    at_risk: float = Field(..., ge=0, le=1)
    needs_attention: float = Field(..., ge=0, le=1)
    on_track: float = Field(..., ge=0, le=1)


class PredictionResponse(BaseModel):
    prediction: str
    probabilities: PredictionProbabilities
    is_temporary: bool = True
    note: str = (
        "Temporary rule-based baseline. This will be replaced by a trained ML model in later phases."
    )