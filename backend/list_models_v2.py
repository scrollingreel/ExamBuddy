from google import genai
import os
from dotenv import load_dotenv

load_dotenv()
GENAI_API_KEY = os.getenv("GENAI_API_KEY")

if GENAI_API_KEY:
    client = genai.Client(api_key=GENAI_API_KEY)
    print("Listing models...")
    for m in client.models.list():
        print(m.name)
else:
    print("API Key not found")
