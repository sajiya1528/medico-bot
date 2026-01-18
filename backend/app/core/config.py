from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Medico Bot"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "your-secret-key-replaced-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # SQLite for Dev, easy to switch to Postgres
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./medico.db"

    class Config:
        env_file = ".env"

settings = Settings()
