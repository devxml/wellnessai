from pydantic_settings import BaseSettings
from typing import Literal

class Settings(BaseSettings):
    # LLM
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    LLM_PROVIDER: Literal["gemini", "groq"] = "gemini"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/wellnessai"
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "wellnessai"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Auth
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

    # App
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
