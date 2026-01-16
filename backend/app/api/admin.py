from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from ..core.database import get_db
from ..models.models import User, UserRole
from ..api.deps import get_current_user
from pydantic import BaseModel
import uuid
from datetime import datetime

router = APIRouter()

# Schema for User List in Admin
class AdminUserResponse(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str | None = None
    role: str
    is_premium: bool
    created_at: datetime | None = None
    
    class Config:
        from_attributes = True

# Dependency to check if current user is admin
async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

@router.get("/users", response_model=List[AdminUserResponse])
async def get_all_users(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return users

@router.patch("/users/{user_id}/premium")
async def toggle_premium(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.is_premium = not user.is_premium
    await db.commit()
    await db.refresh(user)
    
    return {"message": "User premium status updated", "is_premium": user.is_premium}
