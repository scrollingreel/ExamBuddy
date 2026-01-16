import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def check_tables():
    print(f"Connecting to: {DATABASE_URL.split('@')[1]}") # Hide password
    engine = create_async_engine(DATABASE_URL)
    
    async with engine.connect() as conn:
        print("Connected!")
        result = await conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = result.fetchall()
        print("\nTables found:")
        for table in tables:
            print(f"- {table[0]}")
    
    await engine.dispose()

if __name__ == "__main__":
    try:
        asyncio.run(check_tables())
    except Exception as e:
        print(f"Error: {e}")
