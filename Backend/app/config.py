"""Application settings for the Student Success Predictor backend.

Phase 1 keeps this intentionally lightweight. Later phases will extend this
module with database, ML model, and AI configuration.
"""

from __future__ import annotations

import os


class Settings:
    """Small settings container that reads from environment variables."""

    app_name: str = os.getenv("APP_NAME", "Student Success Predictor API")
    environment: str = os.getenv("ENVIRONMENT", "development")
    database_url: str = os.getenv("DATABASE_URL", "")
    model_path: str = os.getenv("MODEL_PATH", "app/ml/student_success_model.pkl")


settings = Settings()