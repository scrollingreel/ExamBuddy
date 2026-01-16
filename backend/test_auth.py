import requests
import json

URL = "http://127.0.0.1:8000/auth/register"
DATA = {
    "email": "testauth@example.com",
    "password": "password123"
}

try:
    print(f"Sending POST to {URL}...")
    response = requests.post(URL, json=DATA)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
