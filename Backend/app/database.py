"""Database helpers.

Phase 1 only defines the SQLAlchemy base and a future-proof session helper.
The actual PostgreSQL connection will be activated in Phase 7.
"""

from __future__ import annotations

import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from app.config import settings


Base = declarative_base()


def get_database_url() -> str:
    """Return the configured database URL."""

    return settings.database_url or os.getenv("DATABASE_URL", "")


def get_engine():
    """Create an SQLAlchemy engine when a database URL is available."""

    database_url = get_database_url()
    if not database_url:
        raise RuntimeError("DATABASE_URL is not configured yet.")
    return create_engine(database_url, future=True)


def get_session_local():
    """Create a session factory for the active database URL."""

    return sessionmaker(autocommit=False, autoflush=False, bind=get_engine())


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for database sessions."""

    session_local = get_session_local()
    db = session_local()
    try:
        yield db
    finally:
        db.close()