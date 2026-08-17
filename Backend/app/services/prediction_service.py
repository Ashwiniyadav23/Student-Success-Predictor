from typing import Dict, Any
from app.ml.predict import predict_student

class PredictionService:
    @staticmethod
    def get_prediction(student_data: Dict[str, Any]) -> Dict[str, Any]:
        return predict_student(student_data)

prediction_service = PredictionService()
