import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Student Success Predictor API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    MODEL_PATH: str = os.getenv("MODEL_PATH", "app/ml/model.pkl")

settings = Settings()
