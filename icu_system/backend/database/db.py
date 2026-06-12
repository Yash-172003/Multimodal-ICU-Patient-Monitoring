# ...existing code...
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
from sqlalchemy.engine import Engine
from typing import Generator
from pathlib import Path
from ..config import settings

DATABASE_URL = settings.DATABASE_URL

# Ensure parent directory for a file-based sqlite DB exists
if DATABASE_URL.startswith("sqlite") and not DATABASE_URL.endswith(":memory:"):
    # get path after the scheme (handles sqlite:///relative and sqlite:///C:/... forms)
    path_part = DATABASE_URL.split("///", 1)[-1]
    # On Windows absolute paths may begin with a leading slash like "/C:/..."
    if path_part.startswith("/") and ":" in path_part:
        path_part = path_part.lstrip("/")
    db_path = Path(path_part)
    db_dir = db_path.parent
    if str(db_dir) and db_dir != Path("."):
        db_dir.mkdir(parents=True, exist_ok=True)

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine: Engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    poolclass=StaticPool if DATABASE_URL.endswith(":memory:") else None,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# ...existing code...