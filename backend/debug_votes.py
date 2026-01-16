import asyncio
import httpx

async def check_api():
    async with httpx.AsyncClient() as client:
        # 1. Fetch newest
        print("--- Newest ---")
        try:
            r = await client.get("http://localhost:8000/notes/?category=NOTE&sort_by=newest")
            notes = r.json()
            # print("DEBUG RAW:", notes[:1])
            for n in notes[:3]:
                print(f"ID: {n['id']}, Title: {n['title']}, Vote: {n.get('vote_count')}, Rating: {n.get('rating')}, Debug: {n.get('debug_flag')}")
        except Exception as e:
            print(f"Error fetching newest: {e}")

        # 2. Fetch rating
        print("\n--- Highest Rated ---")
        try:
            r = await client.get("http://localhost:8000/notes/?category=NOTE&sort_by=rating")
            notes = r.json()
            for n in notes[:3]:
                print(f"ID: {n['id']}, Title: {n['title']}, Vote: {n.get('vote_count')}, Rating: {n.get('rating')}, Debug: {n.get('debug_flag')}")
        except Exception as e:
            print(f"Error fetching rating: {e}")

if __name__ == "__main__":
    asyncio.run(check_api())
