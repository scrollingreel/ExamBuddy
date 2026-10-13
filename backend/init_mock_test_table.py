import asyncio
from app.core.database import engine, Base
from app.models.models import MockTestSubmission

async def init():
    print("Ensuring tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables ensured. No sample data added.")

if __name__ == "__main__":
    asyncio.run(init())
