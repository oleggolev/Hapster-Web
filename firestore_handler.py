import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

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


# Test
if __name__ == "__main__":
    sample_data = [
        {
            "reaction": 1,
            "timeStamp": "2023-10-24T12:00:00Z",
            "userSessionId": "user123",
            "sessionId": "sessionA"
        },
        {
            "reaction": 5,
            "timeStamp": "2023-10-24T12:05:00Z",
            "userSessionId": "user456",
            "sessionId": "sessionA"
        }
    ]

    add_data(sample_data)
