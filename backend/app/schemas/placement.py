from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class PlacementQuestionBase(BaseModel):
    title: str
    link: str

class PlacementQuestionCreate(PlacementQuestionBase):
    pass

class PlacementQuestionUpdate(BaseModel):
    title: Optional[str] = None
    link: Optional[str] = None

class PlacementQuestion(PlacementQuestionBase):
    id: UUID
    material_id: UUID
    created_at: datetime
    is_completed: Optional[bool] = False

    class Config:
        from_attributes = True

class PlacementMaterialBase(BaseModel):
    title: str
    company: str
    category: str
    type: str

class PlacementMaterialCreate(PlacementMaterialBase):
    pass

class PlacementMaterialUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None

class PlacementMaterial(PlacementMaterialBase):
    id: UUID
    created_at: datetime
    questions_count: Optional[int] = 0
    completed_count: Optional[int] = 0

    class Config:
        from_attributes = True

class PlacementMaterialDetail(PlacementMaterial):
    questions: List[PlacementQuestion] = []

class MockTestSubmissionCreate(BaseModel):
    student_name: str
    student_email: Optional[str] = None
    college: Optional[str] = "ABES Engineering College"
    test_id: str
    test_title: str
    score: int
    total_marks: int = 40
    percentage: float
    time_taken_seconds: int
    ai_score: int = 0
    tech_score: int = 0

class MockTestSubmissionOut(BaseModel):
    id: UUID
    student_name: str
    student_email: Optional[str] = None
    college: Optional[str] = None
    test_id: str
    test_title: str
    score: int
    total_marks: int
    percentage: float
    time_taken_seconds: int
    ai_score: int
    tech_score: int
    submitted_at: datetime
    rank: Optional[int] = None

    class Config:
        from_attributes = True

