import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from model import Reaction
from datetime import datetime

# Use a service account.
cred = credentials.Certificate(
    'haptic-xcel-firebase-adminsdk-wn5xe-6dd25bfdba.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()


def add_data(data_array):
    for i in range(len(data_array)):
        data = data_array[i].model_dump()
        formatted_data = {str(i): {"reaction": data['reaction'], "timeStamp": data['timeStamp'],
                                   "userSessionId": data['userSessionId']}}

        try:
            db.collection(
                "session-data").document(data["sessionId"]).update(formatted_data)
        except:
            db.collection(
                "session-data").document(data["sessionId"]).set(formatted_data)


def get_data(sessionID):
    # Attempt to get the document with the given sessionID
    doc_ref = db.collection("session-data").document(sessionID)
    try:
        doc = doc_ref.get()
        if doc.exists:

            # Parse the data into a list of dictionaries
            raw_data = doc.to_dict()
            reactions = []

            for line in raw_data:
                reaction_dict = {
                    "reaction": int(raw_data[line]["reaction"]),
                    "timeStamp": raw_data[line]["timeStamp"].isoformat() + 'Z',
                    "userSessionID": raw_data[line]["userSessionId"]
                }
                # print(reaction_dict)
                reactions.append(reaction_dict)
            # Sort the list of dictionaries by the TimeStamp\
            sorted_reactions = sorted(reactions, key=lambda x: x['timeStamp'])
            print(sorted_reactions)

            return sorted_reactions
        else:
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


# Test
if __name__ == "__main__":
    sample_data = [
        Reaction(
            reaction=1,
            timeStamp="2023-10-24T12:00:00Z",
            userSessionId="user123",
            sessionId="sessionA"
        ),
        Reaction(
            reaction=5,
            timeStamp="2023-10-24T12:05:00Z",
            userSessionId="user456",
            sessionId="sessionA"
        )
    ]

    add_data(sample_data)
    get_data("5NLQFH")
