import queue
import random
import string
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime


class Reaction(BaseModel):
    reaction: int
    timeStamp: datetime
    sessionId: str
    userSessionId: str

    class Config:
        json_schema_extra = {
            "example": {
                "Reaction": 1,
                "TimeStamp": "2022-10-03T14:15:22Z",
                "SessionId": "s12345",
                "UserSessionId": "us12345"
            }
        }


# Config
APP_LINK = "http://localhost:8000"

# Initialize an empty dictionary to hold sessions
sessions = {}

app = FastAPI()


def generate_session_id(length: int = 6):
    """
    Generate a unique session ID of uppercase letters and digits.

    Parameters:
    length (int): Desired length of the ID. Default is 6.

    Returns:
    str: Unique session ID.

    Ensures uniqueness by checking against existing IDs in the global 
    `sessions` dictionary.
    """
    # Generate a random string of upper case letters and digits
    session_id = ''.join(random.choices(
        string.ascii_uppercase + string.digits, k=length))
    while sessions.get(session_id):
        session_id = ''.join(random.choices(
            string.ascii_uppercase + string.digits, k=length))
    return session_id


@app.get("/get-session")
async def get_session():
    session_id = generate_session_id()
    link = f"{APP_LINK}/{session_id}"

    # Initialize a queue for the session
    sessions[session_id] = queue.Queue()
    print(f'Started new session {session_id}')

    return {"session_id": session_id, "link": link}


@app.post("/add-reaction/")
async def add_reaction(reaction_data: Reaction):
    try:
        session_id = reaction_data.sessionId
        sessions[session_id].put(reaction_data)
        print(f"Add reaction:{reaction_data.reaction}")
        return {"status": "success", "message": "Reaction added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get-reaction/{session_id}", response_model=list[Reaction])
async def get_reaction(session_id: str):
    try:
        reactions = sessions.get(session_id)
        if not reactions:
            print(f'Failed to retrieve reactions for session {session_id}')
            raise HTTPException(status_code=404, detail="Session not found")
        print(f'Successfully retrieved reactions for session {session_id}')
        return list(reactions.queue)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
