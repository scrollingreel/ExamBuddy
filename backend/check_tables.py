import asyncio
from app.core.database import engine
from sqlalchemy import inspect
from sqlalchemy import text

async def check_tables():
    async with engine.connect() as conn:
        # For aiosqlite/asyncpg, we need to run inspection in a sync context or use raw SQL
        # Using raw SQL for sqlite to list tables
        result = await conn.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
        tables = result.scalars().all()
        print("Existing tables:", tables)
        
        if "circulars" in tables:
            print("Table 'circulars' exists.")
        else:
            print("Table 'circulars' DOES NOT exist.")

if __name__ == "__main__":
    asyncio.run(check_tables())
