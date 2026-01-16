import os
from dotenv import load_dotenv
from sqlalchemy.engine.url import make_url

load_dotenv()

url_str = os.getenv("DATABASE_URL")
if not url_str:
    print("DATABASE_URL not found")
    exit(1)

try:
    url = make_url(url_str)
    with open("debug_result.txt", "w") as f:
        f.write(f"Driver: {url.drivername}\n")
        f.write(f"User: {url.username}\n")
        f.write(f"Host: {url.host}\n")
        f.write(f"Port: {url.port}\n")
        f.write(f"Database: {url.database}\n")
        
        expected_host = "db.mevuclijgmvpulzagjlh.supabase.co"
        if url.host != expected_host:
            f.write(f"\n[ERROR] Host mismatch!\n")
            f.write(f"Expected: '{expected_host}'\n")
            f.write(f"Found:    '{url.host}'\n")
            f.write("Check for spaces or unescaped special characters (like @, :, /) in your password.\n")
        else:
            f.write("\n[SUCCESS] URL structure looks valid.\n")

except Exception as e:
    with open("debug_result.txt", "w") as f:
        f.write(f"\n[CRITICAL ERROR] Could not parse URL: {e}\n")
