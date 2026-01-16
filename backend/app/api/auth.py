from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..core.database import get_db
from ..models.models import User
from ..schemas.user import UserCreate, UserLogin, UserResponse, Token
from ..core.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user_credentials.email))
    user = result.scalars().first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

from ..schemas.user import UserUpdate
from .deps import get_current_user

@router.put("/me", response_model=UserResponse)
async def update_profile(
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print(f"Received update for {current_user.email}: {user_update}")
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    if user_update.mobile_number is not None:
        current_user.mobile_number = user_update.mobile_number
    if user_update.semester is not None:
        current_user.semester = user_update.semester
    if user_update.cgpa is not None:
        current_user.cgpa = user_update.cgpa
    if user_update.sgpa is not None:
        current_user.sgpa = user_update.sgpa
    if user_update.target_cgpa is not None:
        current_user.target_cgpa = user_update.target_cgpa
    if user_update.study_hours is not None:
        current_user.study_hours = user_update.study_hours
        
    await db.commit()
    await db.refresh(current_user)
    return current_user

@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

from typing import List
from ..schemas.note import NoteResponse
from ..models.models import Note, Download, NoteStatus

@router.get("/me/uploads", response_model=List[NoteResponse])
async def get_my_uploads(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Note)
        .filter(Note.uploaded_by == current_user.id)
        .order_by(Note.created_at.desc())
    )
    notes = result.scalars().all()
    # Normalize for schema
    final_notes = []
    for note in notes:
        final_notes.append({
            "id": note.id,
            "title": note.title,
            "university": note.university,
            "branch": note.branch,
            "semester": note.semester,
            "subject": note.subject,
            "is_premium": note.is_premium,
            "uploaded_by": note.uploaded_by,
            "status": note.status,
            "created_at": note.created_at,
            "category": note.category,
            "year": note.year,
            "vote_count": note.vote_count or 0,
            "rating": note.rating or 0.0,
            "rating_count": note.rating_count or 0,
            "file_url": note.file_url 
        })
    return final_notes

@router.get("/me/downloads", response_model=List[NoteResponse])
async def get_my_downloads(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Join download -> note
    query = (
        select(Note)
        .join(Download, Download.note_id == Note.id)
        .filter(Download.user_id == current_user.id)
        .order_by(Download.created_at.desc())
    )
    result = await db.execute(query)
    notes = result.scalars().all()
    
    final_notes = []
    for note in notes:
        final_notes.append({
            "id": note.id,
            "title": note.title,
            "university": note.university,
            "branch": note.branch,
            "semester": note.semester,
            "subject": note.subject,
            "is_premium": note.is_premium,
            "uploaded_by": note.uploaded_by,
            "status": note.status,
            "created_at": note.created_at,
            "category": note.category,
            "year": note.year,
            "vote_count": note.vote_count or 0,
            "rating": note.rating or 0.0,
            "rating_count": note.rating_count or 0,
            "file_url": note.file_url 
        })
    return final_notes
