from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

if not GENAI_API_KEY:
    print("NO_API_KEY")
    exit()

try:
    client = genai.Client(api_key=GENAI_API_KEY)
    print("---BEGIN MODELS---")
    for m in client.models.list():
        if "gemini" in m.name:
            print(m.name)
    print("---END MODELS---")
except Exception as e:
    print(f"ERROR: {e}")
