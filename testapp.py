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
    assert len(response.json()) == 1
    assert response.json()[0] == reaction_data


def test_add_multiple_reactions():
    # Create a session first
    response = client.get("/get-session")
    assert response.status_code == 200
    session_id = response.json()['session_id']

    # Add multiple reactions
    reactions = [
        {
            "reaction": 1,
            "timeStamp": "2023-10-03T14:15:22Z",
            "sessionId": session_id,
            "userSessionId": "user1"
        },
        {
            "reaction": 2,
            "timeStamp": "2023-10-03T14:16:22Z",
            "sessionId": session_id,
            "userSessionId": "user2"
        }
    ]
    for reaction in reactions:
        response = client.post("/add-reaction/", json=reaction)
        assert response.status_code == 200
        assert response.json()["status"] == "success"

    # Get reactions
    response = client.get(f"/get-reaction/{session_id}")
    print(response.json())
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0] == reactions[0]
    assert response.json()[1] == reactions[1]


def test_create_new_session_and_get_empty_reaction():
    # Create a new session
    response = client.get("/get-session")
    assert response.status_code == 200
    session_id = response.json()['session_id']

    # Get reactions for the newly created session
    response = client.get(f"/get-reaction/{session_id}")
    assert response.status_code == 200
    assert response.json() == []


def test_session_and_reactions():
    # Create a new session
    response = client.get("/get-session")
    assert response.status_code == 200
    session_id = response.json()['session_id']

    # Test 1: Get reactions for the newly created session (expecting an empty array)
    response = client.get(f"/get-reaction/{session_id}")
    assert response.status_code == 200
    assert response.json() == []

    # Test 2: Add one reaction
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

    # Test 3: Get reactions for the session and ensure the added reaction is correct
    response = client.get(f"/get-reaction/{session_id}")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0] == reaction_data

    # Test 4: Add two more reactions
    reactions = [
        {
            "reaction": 1,
            "timeStamp": "2023-10-03T14:15:22Z",
            "sessionId": session_id,
            "userSessionId": "user1"
        },
        {
            "reaction": 2,
            "timeStamp": "2023-10-03T14:16:22Z",
            "sessionId": session_id,
            "userSessionId": "user2"
        }
    ]
    for reaction in reactions:
        response = client.post("/add-reaction/", json=reaction)
        assert response.status_code == 200
        assert response.json()["status"] == "success"

    # Test 5: Get reactions for the session and ensure the added reactions are correct
    response = client.get(f"/get-reaction/{session_id}")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json() == reactions
