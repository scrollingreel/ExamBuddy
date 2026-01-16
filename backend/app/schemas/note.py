from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class NoteBase(BaseModel):
    title: str
    university: str = "AKTU"
    branch: str
    semester: int
    subject: str
    year: Optional[int] = None
    is_premium: bool = False
    category: str = "NOTE"

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None

class NoteResponse(NoteBase):
    id: UUID
    file_url: str
    uploaded_by: UUID
    status: str
    created_at: datetime
    vote_count: int = 0
    rating: float = 0.0
    rating_count: int = 0
    
    class Config:
        from_attributes = True

class NoteList(BaseModel):
    items: List[NoteResponse]
    total: int
