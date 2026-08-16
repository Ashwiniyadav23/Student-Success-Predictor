from fastapi import FastAPI

app = FastAPI(
    title="Student Success Predictor API",
    version="1.0.0",
)


@app.get("/")
def home():
    return{
        "message": "Student Success Predictor API is running"
    }


@app.get ("/health")
def health():
    return{
        "status": "healthy"
    }