from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class VoteCreate(BaseModel):
    vote_type: int # 1 or -1

class VoteResponse(BaseModel):
    note_id: UUID
    vote_count: int
    user_vote: int # Current user's vote

class ReviewCreate(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: UUID
    user_id: UUID
    note_id: UUID
    rating: int
    comment: Optional[str]
    created_at: datetime
    user_name: str # For display

    class Config:
        from_attributes = True
