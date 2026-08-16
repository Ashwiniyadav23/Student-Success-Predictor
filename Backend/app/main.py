from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.predictions import router as predictions_router
from app.routes.students import router as students_router


app = FastAPI(
    title="Student Success Predictor API",
    version="0.1.0",
    description="Phase 1 backend foundation for the Student Success Predictor project.",
)

app.include_router(students_router)
app.include_router(predictions_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home() -> dict[str, str]:
    return {"message": "Student Success Predictor API is running"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy"}