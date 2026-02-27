import requests
r = requests.post("http://127.0.0.1:8000/auth/register", json={"email": "testmobile@gmail.com", "password": "password123"})
print(r.status_code, r.text)
