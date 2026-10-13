from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from uuid import UUID

from ..core.database import get_db
from ..models.models import PlacementMaterial, PlacementQuestion, PlacementProgress, MockTestSubmission, User
from ..schemas.placement import (
    PlacementMaterial as PlacementMaterialSchema,
    PlacementMaterialCreate,
    PlacementMaterialDetail,
    PlacementQuestion as PlacementQuestionSchema,
    PlacementQuestionCreate,
    PlacementQuestionUpdate,
    MockTestSubmissionCreate,
    MockTestSubmissionOut
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

@router.post("/mock-tests/submit", response_model=MockTestSubmissionOut)
async def submit_mock_test(
    submission: MockTestSubmissionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    user_id = current_user.id if current_user else None
    email = current_user.email if current_user and not submission.student_email else submission.student_email
    name = current_user.full_name if (current_user and current_user.full_name and submission.student_name in ["Student", ""]) else submission.student_name

    new_sub = MockTestSubmission(
        user_id=user_id,
        student_name=name or "Student",
        student_email=email,
        college=submission.college or "ABES Engineering College",
        test_id=submission.test_id,
        test_title=submission.test_title,
        score=submission.score,
        total_marks=submission.total_marks,
        percentage=submission.percentage,
        time_taken_seconds=submission.time_taken_seconds,
        ai_score=submission.ai_score,
        tech_score=submission.tech_score
    )
    db.add(new_sub)
    await db.commit()
    await db.refresh(new_sub)

    # Compute rank for this test
    better_count_query = select(MockTestSubmission).filter(
        MockTestSubmission.test_id == submission.test_id,
        (
            (MockTestSubmission.score > new_sub.score) |
            ((MockTestSubmission.score == new_sub.score) & (MockTestSubmission.time_taken_seconds < new_sub.time_taken_seconds))
        )
    )
    better_res = await db.execute(better_count_query)
    rank = len(better_res.scalars().all()) + 1

    return {
        "id": new_sub.id,
        "student_name": new_sub.student_name,
        "student_email": new_sub.student_email,
        "college": new_sub.college,
        "test_id": new_sub.test_id,
        "test_title": new_sub.test_title,
        "score": new_sub.score,
        "total_marks": new_sub.total_marks,
        "percentage": new_sub.percentage,
        "time_taken_seconds": new_sub.time_taken_seconds,
        "ai_score": new_sub.ai_score,
        "tech_score": new_sub.tech_score,
        "submitted_at": new_sub.submitted_at,
        "rank": rank
    }

@router.get("/mock-tests/leaderboard", response_model=List[MockTestSubmissionOut])
async def get_mock_test_leaderboard(
    test_id: Optional[str] = None,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    query = select(MockTestSubmission)
    if test_id and test_id != "all":
        query = query.filter(MockTestSubmission.test_id == test_id)
    
    query = query.order_by(
        MockTestSubmission.score.desc(),
        MockTestSubmission.time_taken_seconds.asc(),
        MockTestSubmission.submitted_at.asc()
    ).limit(limit)
    
    result = await db.execute(query)
    rows = list(result.scalars().all())
    
    leaderboard = []
    for idx, row in enumerate(rows):
        leaderboard.append({
            "id": row.id,
            "student_name": row.student_name,
            "student_email": row.student_email,
            "college": row.college,
            "test_id": row.test_id,
            "test_title": row.test_title,
            "score": row.score,
            "total_marks": row.total_marks,
            "percentage": row.percentage,
            "time_taken_seconds": row.time_taken_seconds,
            "ai_score": row.ai_score,
            "tech_score": row.tech_score,
            "submitted_at": row.submitted_at,
            "rank": idx + 1
        })
        
    return leaderboard

