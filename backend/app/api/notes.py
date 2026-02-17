from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from uuid import UUID
import uuid
from ..core.database import get_db
from ..models.models import Note, User, NoteStatus, UserRole, Vote, Review
from ..schemas.note import NoteResponse, NoteList, NoteUpdate
from ..schemas.interaction import VoteCreate, VoteResponse, ReviewCreate, ReviewResponse
from .deps import get_current_user, get_current_admin, get_current_user_optional

router = APIRouter()

@router.post("/upload", response_model=NoteResponse)
async def upload_note(
    title: str = Form(...),
    branch: str = Form(...),
    semester: int = Form(...),
    subject: str = Form(...),
    category: str = Form("NOTE"),
    year: Optional[int] = Form(None),
    file: UploadFile = File(...),
    is_premium: bool = Form(False),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Initialize Supabase Client
    import os
    from supabase import create_client, Client
    
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase credentials not configured")

    supabase: Client = create_client(url, key)
    
    # Create unique filename
    file_ext = file.filename.split(".")[-1]
    file_path = f"{user.id}/{uuid.uuid4()}.{file_ext}"
    
    # Read file content
    content = await file.read()
    
    try:
        # Upload to 'notes' bucket
        res = supabase.storage.from_("notes").upload(
            file_path,
            content,
            {"content-type": file.content_type}
        )
        
        # Get Public URL
        # Note: 'get_public_url' might vary by SDK version, usually it's this:
        public_url_response = supabase.storage.from_("notes").get_public_url(file_path)
        # Check if it returns a string or object. Recent SDK returns str usually. 
        # If it returns an object, we might need to access .publicURL or similar.
        # Assuming string for now based on common usage.
        file_url = public_url_response
        
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload file to storage")
    
    new_note = Note(
        title=title,
        file_url=file_url,
        uploaded_by=user.id,
        branch=branch,
        semester=semester,
        subject=subject,
        category=category,
        year=year,
        is_premium=is_premium,
        status=NoteStatus.APPROVED if user.role == UserRole.ADMIN else NoteStatus.PENDING
    )
    
    db.add(new_note)
    await db.commit()
    await db.refresh(new_note)
    return new_note

@router.get("/", response_model=List[NoteResponse])
async def list_notes(
    branch: Optional[str] = None,
    semester: Optional[int] = None,
    subject: Optional[str] = None,
    category: Optional[str] = None,
    year: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional),
    limit: int = 100,
    sort_by: Optional[str] = "newest" # newest, rating
):
    query = select(Note).filter(Note.status == NoteStatus.APPROVED)
    
    if sort_by == "rating":
        # Sort by rating desc, then vote count desc
        query = query.order_by(Note.rating.desc(), Note.vote_count.desc())
    else:
        # Default newest
        query = query.order_by(Note.created_at.desc())
    
    if branch:
        query = query.filter(Note.branch == branch)
    if semester:
        query = query.filter(Note.semester == semester)
    if subject:
        query = query.filter(Note.subject.ilike(f"%{subject}%"))
    if category:
        query = query.filter(Note.category == category)
    if year:
        query = query.filter(Note.year == year)
        
    if limit:
        query = query.limit(limit)
        
    result = await db.execute(query)
    notes = result.scalars().all()
    
    # Enforce Premium Access
    final_notes = []
    for note in notes:
        # Clone to avoid DB detach issues or modify in place if safe (Pydantic from_attributes handles it)
        # But we need to return objects with 'file_url' modified if locked.
        # Since response_model is NoteResponse, we can populate it manually or return dicts.
        # Easiest: modify the object attributes temporarily or wrap in a dict.
        
        # We can't easily modify the SQLAlchmey object without dirtying it.
        # So we convert to schema first? Or just dict.
        note_dict = {
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
        }
        
        if note.is_premium:
            # If user is None (Guest) OR user is not premium --> LOCK IT
            if not user or not user.is_premium:
                note_dict["file_url"] = "LOCKED"
        
        final_notes.append(note_dict)
            
    return final_notes

@router.post("/{note_id}/vote", response_model=VoteResponse)
async def vote_note(
    note_id: UUID,
    vote: VoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if note exists
    result = await db.execute(select(Note).filter(Note.id == note_id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # Check existing vote
    result = await db.execute(select(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.note_id == note_id
    ))
    existing_vote = result.scalars().first()

    if existing_vote:
        if existing_vote.vote_type == vote.vote_type:
             # Toggle off (delete)
             await db.delete(existing_vote)
             # Update count
             note.vote_count -= vote.vote_type
        else:
             # Change vote
             diff = vote.vote_type - existing_vote.vote_type
             existing_vote.vote_type = vote.vote_type
             note.vote_count += diff
    else:
        new_vote = Vote(
            user_id=current_user.id,
            note_id=note_id,
            vote_type=vote.vote_type
        )
        db.add(new_vote)
        if note.vote_count is None: note.vote_count = 0
        note.vote_count += vote.vote_type
    
    await db.commit()
    await db.refresh(note)

    # Get current user vote state
    current_vote_state = 0
    # Re-fetch to be safe or just deduce. Re-fetching is safer.
    result = await db.execute(select(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.note_id == note_id
    ))
    updated_vote = result.scalars().first()
    if updated_vote:
        current_vote_state = updated_vote.vote_type

    return {
        "note_id": note_id,
        "vote_count": note.vote_count,
        "user_vote": current_vote_state
    }

@router.post("/{note_id}/review", response_model=ReviewResponse)
async def add_review(
    note_id: UUID,
    review: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if note exists
    result = await db.execute(select(Note).filter(Note.id == note_id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # Check if user already reviewed
    result = await db.execute(select(Review).filter(
        Review.user_id == current_user.id,
        Review.note_id == note_id
    ))
    existing_review = result.scalars().first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this note")

    new_review = Review(
        user_id=current_user.id,
        note_id=note_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(new_review)
    await db.commit() # Commit review to enable aggregate query

    # Update note average rating
    rating_stats = await db.execute(
        select(func.avg(Review.rating), func.count(Review.id)).filter(Review.note_id == note_id)
    )
    avg_rating, count_rating = rating_stats.one()
    
    note.rating = float(avg_rating) if avg_rating else 0.0
    note.rating_count = count_rating
    
    await db.commit()

    return {
        "id": new_review.id,
        "user_id": new_review.user_id,
        "note_id": new_review.note_id,
        "rating": new_review.rating,
        "comment": new_review.comment,
        "created_at": new_review.created_at,
        "user_name": current_user.full_name
    }

@router.get("/{note_id}/reviews", response_model=List[ReviewResponse])
async def list_reviews(
    note_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    # Eager load user for name? OR join.
    # Note: Review model has user relationship.
    # We need to make sure we load it. Explicit join or joinedload options.
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Review)
        .filter(Review.note_id == note_id)
        .order_by(Review.created_at.desc())
        .options(selectinload(Review.user))
    )
    reviews = result.scalars().all()
    
    return [
        {
            **review.__dict__,
            "user_name": review.user.full_name if review.user else "Unknown"
        }
        for review in reviews
    ]

@router.post("/{note_id}/vote", response_model=VoteResponse)
async def vote_note(
    note_id: UUID,
    vote: VoteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if note exists
    result = await db.execute(select(Note).filter(Note.id == note_id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # Check existing vote
    result = await db.execute(select(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.note_id == note_id
    ))
    existing_vote = result.scalars().first()

    if existing_vote:
        if existing_vote.vote_type == vote.vote_type:
             # Toggle off (delete)
             await db.delete(existing_vote)
             # Update count
             note.vote_count -= vote.vote_type
        else:
             # Change vote
             diff = vote.vote_type - existing_vote.vote_type
             existing_vote.vote_type = vote.vote_type
             note.vote_count += diff
    else:
        new_vote = Vote(
            user_id=current_user.id,
            note_id=note_id,
            vote_type=vote.vote_type
        )
        db.add(new_vote)
        note.vote_count += vote.vote_type
    
    await db.commit()
    await db.refresh(note)

    # Get current user vote state
    current_vote_state = 0
    # Re-fetch to be safe or just deduce. Re-fetching is safer.
    result = await db.execute(select(Vote).filter(
        Vote.user_id == current_user.id,
        Vote.note_id == note_id
    ))
    updated_vote = result.scalars().first()
    if updated_vote:
        current_vote_state = updated_vote.vote_type

    return {
        "note_id": note_id,
        "vote_count": note.vote_count,
        "user_vote": current_vote_state
    }

@router.post("/{note_id}/download")
async def download_note(
    note_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check note
    result = await db.execute(select(Note).filter(Note.id == note_id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    # Check if already filtered (optional, but good for history to avoid duplicates?)
    # Let's simple add a new record for every download or just one?
    # History usually implies unique items. Let's check unique (user_id, note_id).
    
    from ..models.models import Download
    result = await db.execute(select(Download).filter(
        Download.user_id == current_user.id,
        Download.note_id == note_id
    ))
    existing = result.scalars().first()
    
    if not existing:
        new_download = Download(user_id=current_user.id, note_id=note_id)
        db.add(new_download)
        await db.commit()
        
    return {"message": "Download recorded"}

@router.post("/{note_id}/review", response_model=ReviewResponse)
async def add_review(
    note_id: UUID,
    review: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if note exists
    result = await db.execute(select(Note).filter(Note.id == note_id))
    note = result.scalars().first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # Check if user already reviewed
    result = await db.execute(select(Review).filter(
        Review.user_id == current_user.id,
        Review.note_id == note_id
    ))
    existing_review = result.scalars().first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this note")

    new_review = Review(
        user_id=current_user.id,
        note_id=note_id,
        rating=review.rating,
        comment=review.comment
    )
    db.add(new_review)
    await db.commit() # Commit review to enable aggregate query

    # Update note average rating
    rating_stats = await db.execute(
        select(func.avg(Review.rating), func.count(Review.id)).filter(Review.note_id == note_id)
    )
    avg_rating, count_rating = rating_stats.one()
    
    note.rating = float(avg_rating) if avg_rating else 0.0
    note.rating_count = count_rating
    
    await db.commit()

    return {
        "id": new_review.id,
        "user_id": new_review.user_id,
        "note_id": new_review.note_id,
        "rating": new_review.rating,
        "comment": new_review.comment,
        "created_at": new_review.created_at,
        "user_name": current_user.full_name
    }

@router.get("/{note_id}/reviews", response_model=List[ReviewResponse])
async def list_reviews(
    note_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    # Eager load user for name? OR join.
    # Note: Review model has user relationship.
    # We need to make sure we load it. Explicit join or joinedload options.
    # For simplicity, let's assume lazy loading might verify, but async requires eager.
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Review)
        .filter(Review.note_id == note_id)
        .order_by(Review.created_at.desc())
        .options(selectinload(Review.user))
    )
    reviews = result.scalars().all()
    
    return [
        {
            **review.__dict__,
            "user_name": review.user.full_name if review.user else "Unknown"
        }
        for review in reviews
    ]

@router.get("/pending", response_model=List[NoteResponse])
async def list_pending_notes(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Note).filter(Note.status == NoteStatus.PENDING))
    return result.scalars().all()

@router.put("/{note_id}/verify", response_model=NoteResponse)
async def verify_note(
    note_id: UUID,
    action: str = Query(..., regex="^(approve|reject)$"),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Note).filter(Note.id == note_id))
    note = result.scalars().first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    if action == "approve":
        note.status = NoteStatus.APPROVED
    else:
        note.status = NoteStatus.REJECTED
        
    await db.commit()
    await db.refresh(note)
    return note

@router.get("/admin/all", response_model=List[NoteResponse])
async def list_all_notes_admin(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Note).order_by(Note.created_at.desc()))
    return result.scalars().all()

from ..schemas.note import NoteUpdate

@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: UUID,
    note_update: NoteUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Note).filter(Note.id == note_id))
    note = result.scalars().first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    if note_update.title is not None:
        note.title = note_update.title
    if note_update.status is not None:
        note.status = note_update.status
    if note_update.is_premium is not None:
        note.is_premium = note_update.is_premium
    # Add other fields as needed from NoteUpdate schema
        
    await db.commit()
    await db.refresh(note)
    return note

@router.delete("/{note_id}")
async def delete_note(
    note_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Note).filter(Note.id == note_id))
    note = result.scalars().first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
        
    await db.delete(note)
    await db.commit()
    return {"message": "Note deleted successfully"}

from sqlalchemy import func

@router.get("/leaderboard", response_model=List[dict])
async def get_leaderboard(
    db: AsyncSession = Depends(get_db),
    limit: int = 10
):
    """
    Get top users by number of approved notes uploaded.
    """
    query = (
        select(User.full_name, func.count(Note.id).label("note_count"))
        .join(Note, User.id == Note.uploaded_by)
        .filter(Note.status == NoteStatus.APPROVED)
        .group_by(User.id, User.full_name)
        .order_by(func.count(Note.id).desc())
        .limit(limit)
    )
    
    result = await db.execute(query)
    leaderboard = result.all()
    
    # Format result as list of dicts
    return [
        {"rank": idx + 1, "name": row.full_name or "Anonymous", "count": row.note_count}
        for idx, row in enumerate(leaderboard)
    ]
