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
