from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: UUID
    role: str
    is_premium: bool
    full_name: Optional[str] = None
    mobile_number: Optional[str] = None
    semester: Optional[int] = None
    cgpa: Optional[float] = None
    sgpa: Optional[float] = None
    target_cgpa: Optional[float] = None
    study_hours: float = 0.0
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    mobile_number: Optional[str] = None
    semester: Optional[int] = None
    cgpa: Optional[float] = None
    sgpa: Optional[float] = None
    target_cgpa: Optional[float] = None
    study_hours: Optional[float] = None

class Token(BaseModel):
    access_token: str
    token_type: str
