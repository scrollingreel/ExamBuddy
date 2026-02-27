from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..core.database import get_db
from ..models.models import SystemSetting, User, UserRole
from .deps import get_current_admin
from pydantic import BaseModel
from typing import List

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
