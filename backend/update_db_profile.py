import asyncio
from app.core.database import engine, Base
from sqlalchemy import text

async def update_db():
    async with engine.begin() as conn:
        print("Creating 'downloads' table if not exists...")
        await conn.execute(text("""
            CREATE TABLE IF NOT EXISTS downloads (
                id UUID PRIMARY KEY,
                user_id UUID REFERENCES users(id),
                note_id UUID REFERENCES notes(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        
        print("Adding 'sgpa' column to 'users' table...")
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN sgpa FLOAT"))
            print("Added 'sgpa' column.")
        except Exception as e:
            print(f"Column 'sgpa' might already exist: {e}")

if __name__ == "__main__":
    asyncio.run(update_db())
