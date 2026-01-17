import asyncio
import sys
import os

# Add parent dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.models import User
from app.core.security import get_password_hash
from sqlalchemy import select

async def reset_password(email: str, new_password: str):
    async with SessionLocal() as session:
        result = await session.execute(select(User).filter(User.email == email))
        user = result.scalars().first()
        
        if not user:
            print(f"User with email '{email}' not found.")
            return
            
        hashed_pw = get_password_hash(new_password)
        user.hashed_password = hashed_pw
        await session.commit()
        print(f"Password for '{email}' has been reset successfully.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python reset_password.py <email> <new_password>")
    else:
        email = sys.argv[1]
        new_password = sys.argv[2]
        asyncio.run(reset_password(email, new_password))
