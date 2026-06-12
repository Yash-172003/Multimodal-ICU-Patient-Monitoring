from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "ICU Monitoring System"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    DATABASE_URL: str = "sqlite:///./backend/database/icu_monitoring.db"
    HF_MODEL_NAME: str = "emilyalsentzer/Bio_ClinicalBERT"
    PREDICTION_INTERVAL_MINUTES: int = 15
    DAILY_BATCH_TIME: str = "02:00"
    SECRET_KEY: str = "dev-secret"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
