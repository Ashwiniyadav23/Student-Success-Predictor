# Student Success Predictor

Phase 1 sets up the FastAPI backend foundation for the Student Success Predictor project.

## What is included now

- `GET /`
- `GET /health`
- `POST /students/predict`
- Temporary rule-based prediction logic for API testing only
- Basic app structure for future ML, database, and AI layers

## Run locally

1. Create and activate a virtual environment.
2. Install dependencies from `requirements.txt`.
3. Start the API with Uvicorn:

   `uvicorn app.main:app --reload`

## Test the API

- `GET /` should return a running message.
- `GET /health` should return a healthy status.
- `POST /students/predict` should accept student learning behavior input and return a temporary prediction.

## Important note

The current prediction logic is temporary and rule-based. It will be replaced with a trained machine learning model in later phases.