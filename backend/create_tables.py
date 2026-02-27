
import asyncio
from backend.app.core.database import engine, Base
# Import models to register them
from backend.app.models import models 

async def init_db():
    print("Creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created.")

if __name__ == "__main__":
    asyncio.run(init_db())
