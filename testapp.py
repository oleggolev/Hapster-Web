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
    assert response.json() == "Reaction added successfully"

    # Get reactions
    response = client.get(f"/get-reaction/{session_id}")
    print(response.json())
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]['reaction'] == reaction_data['reaction']


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
        assert response.json() == "Reaction added successfully"

    # Get reactions
    response = client.get(f"/get-reaction/{session_id}")
    print(response.json())
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]['reaction'] == reactions[0]['reaction']
    assert response.json()[1]['reaction'] == reactions[1]['reaction']


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
    assert response.json() == "Reaction added successfully"

    # Test 3: Get reactions for the session and ensure the added reaction is correct
    response = client.get(f"/get-reaction/{session_id}")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["reaction"] == reaction_data["reaction"]

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
        assert response.json() == "Reaction added successfully"

    # Test 5: Get reactions for the session and ensure the added reactions are correct
    response = client.get(f"/get-reaction/{session_id}")
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["reaction"] == reactions[0]["reaction"]
    assert response.json()[1]["reaction"] == reactions[1]["reaction"]

    # Test 6: End the session by sending the session_id as part of the URL
    response = client.get(f"/end-session/{session_id}")

    # Assert the response status code and content
    assert response.status_code == 200
    print(response.json())
    assert response.json() == "Session ended, added data to firebase"

    # Test 7: Attempt to add a reaction to the ended session
    reaction_data = {
        "reaction": 1,
        "timeStamp": "2022-10-03T14:15:22Z",
        "sessionId": session_id,
        "userSessionId": "us12345"
    }
    response = client.post("/add-reaction/", json=reaction_data)

    # Assert that the response status code is 200 and that the message indicates that the session ended
    assert response.status_code == 200
    assert response.json() == "session ended"


def test_end_session_that_does_not_exist():
    # Attempt to end a session that doesn't exist
    non_existing_session_id = "non_existing_session"
    response = client.get(f"/end-session/{non_existing_session_id}")

    # Assert the response status code and content
    print(response.json())
    assert response.status_code == 404
    assert response.json() == {
        "detail": f"Session {non_existing_session_id} not found"}


def test_get_reaction_for_session_that_does_not_exist():
    # Attempt to get reactions for a session that doesn't exist
    non_existing_session_id = "non_existing_session"
    response = client.get(f"/get-reaction/{non_existing_session_id}")

    # Assert the response status code and content
    assert response.status_code == 404
    assert response.json() == {
        "detail": f"Reactions not found for session {non_existing_session_id}"}


def test_add_reaction_to_ended_session():
    # Create a session first
    response = client.get("/get-session")
    assert response.status_code == 200
    session_id = response.json()['session_id']

    # End the session
    end_session_response = client.get(f"/end-session/{session_id}")
    assert end_session_response.status_code == 200

    # Attempt to add a reaction to the ended session
    reaction_data = {
        "reaction": 1,
        "timeStamp": "2022-10-03T14:15:22Z",
        "sessionId": session_id,
        "userSessionId": "us12345"
    }
    response = client.post("/add-reaction/", json=reaction_data)

    # Assert the response status code and content
    assert response.status_code == 200
    assert response.json() == "session ended"
