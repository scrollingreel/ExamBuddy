import requests
import json

base_url = "https://exambuddy-ymor.onrender.com"

# 1. Test Root
print("--- Testing Root ---")
try:
    resp = requests.get(base_url + "/")
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")
except Exception as e:
    print(f"Root request failed: {e}")

# 2. Test Register
print("\n--- Testing Register (Expected Failure/Success) ---")
payload = {
    "email": "debug_user_001@example.com",
    "password": "StrongPassword123!"
}
try:
    resp = requests.post(base_url + "/auth/register", json=payload)
    print(f"Status: {resp.status_code}")
    print(f"Headers: {resp.headers}")
    print(f"Body: {resp.text}")
except Exception as e:
    print(f"Register request failed: {e}")
