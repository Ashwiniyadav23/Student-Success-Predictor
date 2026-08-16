from __future__ import annotations


def test_prediction_validation_rejects_invalid_input(client) -> None:
    response = client.post(
        "/students/predict",
        json={
            "attendance": 150,
            "assignment_completion": 68,
            "test_average": 70,
            "coding_hours": 5,
            "goals_completed": 3,
            "projects_completed": 1,
            "interview_practice_hours": 2,
        },
    )

    assert response.status_code == 422