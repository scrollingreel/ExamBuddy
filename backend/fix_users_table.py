
import asyncio
from sqlalchemy import text
from backend.app.core.database import engine

async def fix_users_table():
    print("Checking users table...")
    async with engine.begin() as conn:
        # Check if last_active_at exists
        result = await conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='last_active_at'"))
        exists = result.scalar()
        
        if exists:
            print("Row 'last_active_at' exists. Making it nullable...")
            # Make it nullable to avoid insert errors if model doesn't use it
            await conn.execute(text("ALTER TABLE users ALTER COLUMN last_active_at DROP NOT NULL"))
        else:
            print("Row 'last_active_at' does not exist. Adding it as nullable for safety...")
            await conn.execute(text("ALTER TABLE users ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE NULL"))
            
    print("Users table fixed.")

if __name__ == "__main__":
    asyncio.run(fix_users_table())
