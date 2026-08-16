from __future__ import annotations


def test_root_endpoint(client) -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == "Student Success Predictor API is running"