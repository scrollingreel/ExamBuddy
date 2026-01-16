from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from ..core.database import get_db
from ..models.models import Circular, User, UserRole
from .deps import get_current_user, get_current_admin
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

router = APIRouter()

class CircularCreate(BaseModel):
    title: str
    message: str = None
    link: str = None

class CircularResponse(CircularCreate):
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/", response_model=CircularResponse)
async def create_circular(
    circular: CircularCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    new_circular = Circular(
        title=circular.title,
        message=circular.message,
        link=circular.link
    )
    db.add(new_circular)
    await db.commit()
    await db.refresh(new_circular)
    return new_circular

@router.get("/", response_model=List[CircularResponse])
async def list_circulars(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Circular).order_by(Circular.created_at.desc()))
    return result.scalars().all()

@router.delete("/{circular_id}")
async def delete_circular(
    circular_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Circular).filter(Circular.id == circular_id))
    circular = result.scalars().first()
    if not circular:
        raise HTTPException(status_code=404, detail="Circular not found")
        
    await db.delete(circular)
    await db.commit()
    return {"message": "Circular deleted"}
