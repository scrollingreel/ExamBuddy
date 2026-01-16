import asyncio
import sys
import os

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.models import User, UserRole
from sqlalchemy import select

async def promote_to_admin(email: str):
    async with SessionLocal() as session:
        result = await session.execute(select(User).filter(User.email == email))
        user = result.scalars().first()
        
        if not user:
            print(f"User with email '{email}' not found.")
            return
            
        user.role = UserRole.ADMIN
        await session.commit()
        print(f"User '{email}' has been promoted to ADMIN.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_admin.py <email>")
    else:
        email = sys.argv[1]
        asyncio.run(promote_to_admin(email))
