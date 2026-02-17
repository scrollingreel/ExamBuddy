from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..core.database import get_db
from ..models.models import SystemSetting, User, UserRole
from ..schemas.user import UserResponse
from .deps import get_current_admin
from pydantic import BaseModel
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Optional

router = APIRouter()

class SettingUpdate(BaseModel):
    key: str
    value: str
    description: str = None

class SettingResponse(SettingUpdate):
    pass

@router.get("/settings", response_model=List[SettingResponse])
async def get_settings(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(SystemSetting))
    return result.scalars().all()

@router.post("/settings", response_model=SettingResponse)
async def update_setting(
    setting: SettingUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(SystemSetting).filter(SystemSetting.key == setting.key))
    existing_setting = result.scalars().first()
    
    if existing_setting:
        existing_setting.value = setting.value
        if setting.description:
            existing_setting.description = setting.description
    else:
        new_setting = SystemSetting(
            key=setting.key,
            value=setting.value,
            description=setting.description
        )
        db.add(new_setting)
        existing_setting = new_setting
    
    await db.commit()
    await db.refresh(existing_setting)
    return existing_setting

@router.get("/public-config")
async def get_public_config(db: AsyncSession = Depends(get_db)):
    """
    Public endpoint to fetch non-sensitive config like prices.
    """
    keys_to_fetch = ["semester_price", "yearly_price"]
    result = await db.execute(select(SystemSetting).filter(SystemSetting.key.in_(keys_to_fetch)))
    settings = result.scalars().all()
    
    config = {
        "semester_price": 499, # Default fallback
        "yearly_price": 999
    }
    
    for s in settings:
        try:
            config[s.key] = float(s.value)
        except:
            pass
            
    return config


@router.get("/users", response_model=List[UserResponse])
async def get_users(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(
        select(User).order_by(User.created_at.desc())
    )
    return result.scalars().all()

@router.patch("/users/{user_id}/premium")
async def toggle_premium(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_premium = not user.is_premium
    await db.commit()
    return {"status": "success", "is_premium": user.is_premium}

@router.get("/stats/live")
async def get_live_users_count(
    minutes: int = 5,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Get count of users active in the last `minutes` (default 5).
    """
    threshold = datetime.utcnow() - timedelta(minutes=minutes)
    result = await db.execute(
        select(func.count()).select_from(User).filter(User.last_active_at >= threshold)
    )
    count = result.scalar() or 0
    return {"live_users": count}
