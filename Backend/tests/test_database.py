from __future__ import annotations

from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.models.prediction import Prediction
from app.models.student import Student


def test_database_models_support_insert_and_relationship() -> None:
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    session_local = sessionmaker(bind=engine)

    with session_local() as session:
        student = Student(
            attendance=80,
            assignment_completion=75,
            test_average=78,
            coding_hours=6,
            goals_completed=4,
            projects_completed=2,
            interview_practice_hours=3,
            created_at=datetime.utcnow(),
        )
        session.add(student)
        session.commit()
        session.refresh(student)

        prediction = Prediction(
            student_id=student.id,
            prediction="ON_TRACK",
            at_risk_probability=0.05,
            needs_attention_probability=0.15,
            on_track_probability=0.80,
            model_version="phase-1-temp",
            created_at=datetime.utcnow(),
        )
        session.add(prediction)
        session.commit()
        session.refresh(prediction)

        loaded_student = session.get(Student, student.id)

        assert loaded_student is not None
        assert loaded_student.predictions[0].prediction == "ON_TRACK"