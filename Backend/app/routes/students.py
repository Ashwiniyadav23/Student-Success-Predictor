from fastapi import APIRouter, HTTPException
from app.schemas.student import StudentInput, PredictionResponse
from app.services.prediction_service import prediction_service

router = APIRouter(tags=["students"])

@router.post("/students/predict", response_model=PredictionResponse)
@router.post("/predict", response_model=PredictionResponse)
def predict_student_status(input_data: StudentInput):
    try:
        result = prediction_service.get_prediction(input_data.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
