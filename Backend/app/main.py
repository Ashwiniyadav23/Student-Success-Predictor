from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.predictions import router as predictions_router
from app.routes.students import router as students_router

app = FastAPI(
    title="Student Success Predictor API",
    version="1.0.0",
    description="Backend service for student-wise success prediction and attendance tracking.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students_router)
app.include_router(students_router, prefix="/api")
app.include_router(predictions_router)

@app.get("/")
def home() -> dict[str, str]:
    return {"message": "Student Success Predictor API is running"}

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy"}