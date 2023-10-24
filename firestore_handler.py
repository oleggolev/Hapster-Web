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
        data = data_array[i]
        formatted_data = {
            str(i): {"reaction": data['Reaction'], "timeStamp": data['TimeStamp'],
                     "userSessionId": data['UserSessionId']}
        }
        try:
            db.collection(
                "session-data").document(data["SessionId"]).update(formatted_data)
        except:
            db.collection(
                "session-data").document(data["SessionId"]).set(formatted_data)


# Test
if __name__ == "__main__":
    sample_data = [
        {
            "Reaction": 1,
            "TimeStamp": "2023-10-24T12:00:00Z",
            "UserSessionId": "user123",
            "SessionId": "sessionA"
        },
        {
            "Reaction": 5,
            "TimeStamp": "2023-10-24T12:05:00Z",
            "UserSessionId": "user456",
            "SessionId": "sessionA"
        }
    ]

    add_data(sample_data)
