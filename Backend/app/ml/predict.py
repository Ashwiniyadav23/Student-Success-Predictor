"""ML prediction entrypoints.

Phase 1 still uses the temporary baseline from the service layer. The trained
model will be connected here in later phases.
"""

from app.schemas.prediction import PredictionResponse
from app.schemas.student import StudentPredictionInput
from app.services.prediction_service import predict_student_success


def predict(student: StudentPredictionInput) -> PredictionResponse:
    """Temporary helper that proxies to the baseline predictor."""

    return predict_student_success(student)