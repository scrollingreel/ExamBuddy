from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from ..core.database import get_db
from ..models.models import PlacementMaterial, PlacementQuestion, PlacementProgress, User
from ..schemas.placement import (
    PlacementMaterial as PlacementMaterialSchema,
    PlacementMaterialCreate,
    PlacementMaterialDetail,
    PlacementQuestion as PlacementQuestionSchema,
    PlacementQuestionCreate,
    PlacementQuestionUpdate
)
from .deps import get_current_admin, get_current_user, get_current_user_optional

router = APIRouter()

@router.get("/materials", response_model=List[PlacementMaterialSchema])
async def get_materials(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PlacementMaterial).order_by(PlacementMaterial.created_at.desc()))
    materials = list(result.scalars().all())
    
    # Optional: fetch question counts
    for material in materials:
        q_res = await db.execute(select(PlacementQuestion).filter(PlacementQuestion.material_id == material.id))
        material.questions_count = len(q_res.scalars().all())
        material.completed_count = 0 # To be detailed per user if needed
        
    return materials

@router.get("/materials/{material_id}", response_model=PlacementMaterialDetail)
async def get_material(
    material_id: UUID, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    result = await db.execute(select(PlacementMaterial).filter(PlacementMaterial.id == material_id))
    material = result.scalars().first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
        
    q_result = await db.execute(select(PlacementQuestion).filter(PlacementQuestion.material_id == material_id).order_by(PlacementQuestion.created_at.asc()))
    questions = list(q_result.scalars().all())
    
    progresses = {}
    if current_user:
        p_result = await db.execute(select(PlacementProgress).filter(PlacementProgress.user_id == current_user.id))
        progresses = {p.question_id: True for p in p_result.scalars().all()}
    
    completed_count = 0
    for q in questions:
        q.is_completed = progresses.get(q.id, False)
        if q.is_completed:
            completed_count += 1
            
    return {
        "id": material.id,
        "title": material.title,
        "company": material.company,
        "category": material.category,
        "type": material.type,
        "created_at": material.created_at,
        "questions_count": len(questions),
        "completed_count": completed_count,
        "questions": questions
    }

@router.post("/materials", response_model=PlacementMaterialSchema)
async def create_material(
    material: PlacementMaterialCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    new_mat = PlacementMaterial(**material.model_dump())
    db.add(new_mat)
    await db.commit()
    await db.refresh(new_mat)
    return new_mat
    
@router.post("/materials/{material_id}/questions", response_model=PlacementQuestionSchema)
async def create_question(
    material_id: UUID,
    question: PlacementQuestionCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    new_q = PlacementQuestion(material_id=material_id, **question.model_dump())
    db.add(new_q)
    await db.commit()
    await db.refresh(new_q)
    return new_q

@router.delete("/materials/{material_id}")
async def delete_material(
    material_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(PlacementMaterial).filter(PlacementMaterial.id == material_id))
    mat = result.scalars().first()
    if mat:
        await db.delete(mat)
        await db.commit()
    return {"status": "ok"}

@router.delete("/questions/{question_id}")
async def delete_question(
    question_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(PlacementQuestion).filter(PlacementQuestion.id == question_id))
    q = result.scalars().first()
    if q:
        await db.delete(q)
        await db.commit()
    return {"status": "ok"}

@router.post("/questions/{question_id}/toggle-progress")
async def toggle_question_progress(
    question_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(PlacementProgress).filter(
            PlacementProgress.user_id == current_user.id,
            PlacementProgress.question_id == question_id
        )
    )
    prog = result.scalars().first()
    if prog:
        await db.delete(prog)
        is_completed = False
    else:
        new_prog = PlacementProgress(user_id=current_user.id, question_id=question_id)
        db.add(new_prog)
        is_completed = True
        
    await db.commit()
    return {"status": "ok", "is_completed": is_completed}
