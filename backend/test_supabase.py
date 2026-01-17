import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

print(f"URL found: {bool(url)}")
print(f"Key found: {bool(key)}")

if url and key:
    try:
        print("Connecting to Supabase...")
        supabase = create_client(url, key)
        print("Connected.")
        
        print("Listing buckets...")
        res = supabase.storage.list_buckets()
        print("Buckets:", res)
        
        # Check for 'notes' bucket
        buckets = res if isinstance(res, list) else [] # Verification might depend on version
        notes_bucket = next((b for b in buckets if b.name == 'notes'), None)
        
        if notes_bucket:
            print("Bucket 'notes' exists.")
        else:
            print("Bucket 'notes' NOT found.")
            # Try creating it? No, better just report.
            
    except Exception as e:
        print(f"Error checking Supabase: {e}")
else:
    print("Missing Supabase credentials in .env")
