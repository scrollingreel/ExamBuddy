from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Integer, Text, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
import enum
from ..core.database import Base

class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    ADMIN = "ADMIN"

class NoteStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class SubscriptionPlan(str, enum.Enum):
    MONTHLY = "MONTHLY"
    SEMESTER = "SEMESTER"
    YEARLY = "YEARLY"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default=UserRole.STUDENT)
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Profile Fields
    full_name = Column(String, nullable=True)
    mobile_number = Column(String, nullable=True)
    semester = Column(Integer, nullable=True)
    cgpa = Column(Float, nullable=True)
    sgpa = Column(Float, nullable=True)
    target_cgpa = Column(Float, nullable=True)
    study_hours = Column(Float, default=0.0)
    
    notes = relationship("Note", back_populates="uploader")
    subscriptions = relationship("Subscription", back_populates="user")
    downloads = relationship("Download", back_populates="user")



class NoteCategory(str, enum.Enum):
    NOTE = "NOTE"
    SESSIONAL_PAPER = "SESSIONAL_PAPER"
    UNIVERSITY_PAPER = "UNIVERSITY_PAPER"

class Note(Base):
    __tablename__ = "notes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(String, default=NoteStatus.PENDING)
    
    university = Column(String, default="AKTU")
    branch = Column(String, nullable=False)
    semester = Column(Integer, nullable=False)
    subject = Column(String, nullable=False)
    is_premium = Column(Boolean, default=False)
    category = Column(String, default=NoteCategory.NOTE)
    year = Column(Integer, nullable=True)
    vote_count = Column(Integer, default=0)
    rating = Column(Float, default=0.0) # Average rating
    rating_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    uploader = relationship("User", back_populates="notes")
    votes = relationship("Vote", back_populates="note", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="note", cascade="all, delete-orphan")
    downloads = relationship("Download", back_populates="note", cascade="all, delete-orphan")

class Download(Base):
    __tablename__ = "downloads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    note_id = Column(UUID(as_uuid=True), ForeignKey("notes.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="downloads")
    note = relationship("Note", back_populates="downloads")

class Vote(Base):
    __tablename__ = "votes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    note_id = Column(UUID(as_uuid=True), ForeignKey("notes.id"))
    vote_type = Column(Integer) # 1 for upvote, -1 for downvote
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
    note = relationship("Note", back_populates="votes")

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    note_id = Column(UUID(as_uuid=True), ForeignKey("notes.id"))
    rating = Column(Integer) # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User")
    note = relationship("Note", back_populates="reviews")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    plan_type = Column(String, nullable=False)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
    payment_id = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="subscriptions")

class Circular(Base):
    __tablename__ = "circulars"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    link = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String, primary_key=True, index=True)
    value = Column(String, nullable=False)
    description = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
