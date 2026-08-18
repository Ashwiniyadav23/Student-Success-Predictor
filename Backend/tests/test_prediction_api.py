from __future__ import annotations


def test_prediction_endpoint_returns_probabilities(client) -> None:
    response = client.post(
        "/students/predict",
        json={
            "attendance": 72,
            "assignment_completion": 68,
            "test_average": 70,
            "coding_hours": 5,
            "goals_completed": 3,
            "projects_completed": 1,
            "interview_practice_hours": 2,
        },
    )

    body = response.json()

    assert response.status_code == 200
    assert body["prediction"] in {"AT_RISK", "NEEDS_ATTENTION", "ON_TRACK"}
    assert set(body["probabilities"].keys()) == {
        "at_risk",
        "needs_attention",
        "on_track",
    }
    assert "rag_recommendations" in body
    assert len(body["rag_recommendations"]["retrieved_documents"]) > 0


def test_rag_recommendations_endpoint(client) -> None:
    response = client.post(
        "/students/rag-recommendations",
        json={
            "attendance": 45,
            "assignment_completion": 50,
            "test_average": 55,
            "coding_hours": 2,
            "goals_completed": 1,
            "projects_completed": 0,
            "interview_practice_hours": 1,
        },
    )

    body = response.json()
    assert response.status_code == 200
    assert "risk_drivers" in body
    assert len(body["retrieved_documents"]) > 0
    assert len(body["action_plan"]) == 7