from pathlib import Path
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Carrega o .env da pasta backend/
ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(ENV_PATH)

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "tesko_ai")

DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# Engine + Session
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # reconecta se a conexão cair
    future=True,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

# Base do SQLAlchemy para modelos
Base = declarative_base()

# Dependência para usar nos endpoints (FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
