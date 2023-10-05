from datetime import datetime
from fastapi.testclient import TestClient
from server import app, Reaction

client = TestClient(app)


def test_get_session():
    response = client.get("/get-session")
    assert response.status_code == 200
    assert "session_id" in response.json()
    assert "link" in response.json()


def test_add_and_get_reaction():
    # Create a session first
    response = client.get("/get-session")
    assert response.status_code == 200
    session_id = response.json()['session_id']

    # Add a reaction
    reaction_data = {
        "reaction": 1,
        "timeStamp": "2022-10-03T14:15:22Z",
        "sessionId": session_id,
        "userSessionId": "us12345"
    }
    response = client.post("/add-reaction/", json=reaction_data)
    assert response.status_code == 200
    assert response.json() == {"status": "success",
                               "message": "Reaction added successfully"}

    # Get reactions
    response = client.get(f"/get-reaction/{session_id}")
    print(response.json())
    assert response.status_code == 200
    assert len(response.json()) == 4
    assert response.json() == reaction_data
