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
