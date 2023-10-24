import queue
import random
import string
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import firestore_handler


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

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://127.0.0.1:8000/",
    "https://haptic-excel.onrender.com/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_current_reaction(session_id):
    current_index = sessions[session_id]["index"]
    sessions[session_id]["index"] = len(sessions[session_id]["reactions"])
    return sessions[session_id]['reactions'][current_index:]


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
    sessions[session_id] = {'index': 0, 'reactions': [], 'active': True}
    print(f'Started new session {session_id}')

    return {"session_id": session_id, "link": link}


@app.post("/add-reaction/")
async def add_reaction(reaction_data: Reaction):
    try:
        session_id = reaction_data.sessionId
        # Add current timestamp to the reaction data
        reaction_data.timeStamp = datetime.utcnow()
        if not sessions.get(session_id):
            return "session not found"
        elif not sessions.get(session_id)["active"]:
            return "session ended"
        sessions[session_id]['reactions'].append(reaction_data)
        print(f"Add reaction:{reaction_data.reaction}")
        return "Reaction added successfully"
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/end-session/{session_id}")
async def end_session(session_id: str):
    if session_id not in sessions:
        print('Session {session_id} not found')
        raise HTTPException(
            status_code=404, detail=f'Session {session_id} not found')
    sessions[session_id]["active"] = False
    try:
        firestore_handler.add_data(sessions[session_id]["data"]["reactions"])
        print('added data to firebase')
        return "Session ended"
    except:
        print('no data to add')
        return "Session ended"


@app.get("/get-reaction/{session_id}", response_model=list[Reaction])
async def get_reaction(session_id: str):
    if session_id in sessions and sessions[session_id]['active']:
        reactions = get_current_reaction(session_id)
        if not reactions:
            print(f'No new reaction to retrieve {session_id}')
            return []
        print(f'Successfully retrieved reactions for session {session_id}')
        print(reactions)
        return reactions
    raise HTTPException(
        status_code=404, detail=f'Reactions not found for session {session_id}')


@app.get("/get-session-data/{session_id}")
async def get_session_data(session_id: str):
    try:
        # Retrieve session data
        session_data = sessions.get(session_id)

        # Handle case where session data does not exist
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")

        # Return session data
        return {"status": "success", "data": session_data}
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(status_code=500, detail=str(e))
