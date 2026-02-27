import os
import razorpay
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..core.database import get_db
from ..models.models import User, Subscription, SubscriptionPlan, UserRole, SystemSetting

from .deps import get_current_user
from datetime import datetime, timedelta
from pydantic import BaseModel
import uuid

router = APIRouter()

# Initialize Razorpay Client
# Credentials should be in .env
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

class SubscriptionCreate(BaseModel):
    plan_type: SubscriptionPlan

class PaymentVerify(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str
    plan_type: SubscriptionPlan

@router.post("/create-order")
async def create_subscription_order(
    sub_data: SubscriptionCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Payment gateway not configured")

    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

    # Fetch dynamic prices
    semester_setting = await db.execute(select(SystemSetting).filter(SystemSetting.key == "semester_price"))
    yearly_setting = await db.execute(select(SystemSetting).filter(SystemSetting.key == "yearly_price"))
    
    sem_price = semester_setting.scalars().first()
    year_price = yearly_setting.scalars().first()
    
    semester_amount = int(float(sem_price.value) * 100) if sem_price else 49900
    yearly_amount = int(float(year_price.value) * 100) if year_price else 99900

    amount = 9900 
    if sub_data.plan_type == SubscriptionPlan.SEMESTER:
        amount = semester_amount
    elif sub_data.plan_type == SubscriptionPlan.YEARLY:
        amount = yearly_amount
    
    data = {
        "amount": amount,
        "currency": "INR",
        "receipt": f"rcpt_{uuid.uuid4().hex[:12]}",
        "notes": {
            "user_id": str(user.id),
            "plan": sub_data.plan_type
        }
    }
    
    try:
        order = client.order.create(data=data)
    except Exception as e:
        print(f"Razorpay Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")
    
    return {
        "order_id": order["id"],
        "amount": order["amount"],
        "currency": order["currency"],
        "key_id": RAZORPAY_KEY_ID,
        "plan": sub_data.plan_type
    }

@router.post("/verify-payment")
async def verify_payment(
    data: PaymentVerify,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Payment gateway not configured")

    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

    try:
        # Verify signature
        client.utility.verify_payment_signature({
            'razorpay_order_id': data.razorpay_order_id,
            'razorpay_payment_id': data.razorpay_payment_id,
            'razorpay_signature': data.razorpay_signature
        })
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Payment signature verification failed")
    
    # Calculate end date
    now = datetime.utcnow()
    days = 365 if data.plan_type == SubscriptionPlan.YEARLY else 180
    end_date = now + timedelta(days=days)
    
    new_sub = Subscription(
        user_id=user.id,
        plan_type=data.plan_type,
        start_date=now,
        end_date=end_date,
        payment_id=data.razorpay_payment_id,
        is_active=True
    )
    
    db.add(new_sub)
    user.is_premium = True # Activate premium for user
    
    await db.commit()
    return {"status": "success", "message": "Premium activated"}

from ..models.models import ManualSubscriptionRequest, SubscriptionStatus
from fastapi import UploadFile, File, Form
from .deps import get_current_admin

@router.post("/manual-subscribe")
async def manual_subscribe(
    name: str = Form(...),
    mobile_number: str = Form(...),
    email: str = Form(...),
    transaction_id: str = Form(...),
    plan_type: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    import os
    from supabase import create_client, Client
    
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase not configured")

    supabase: Client = create_client(url, key)
    file_ext = file.filename.split(".")[-1]
    file_path = f"payments/{user.id}/{uuid.uuid4()}.{file_ext}"
    content = await file.read()
    
    try:
        supabase.storage.from_("notes").upload(
            file_path,
            content,
            {"content-type": file.content_type}
        )
        file_url = supabase.storage.from_("notes").get_public_url(file_path)
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload screenshot")
        
    req = ManualSubscriptionRequest(
        user_id=user.id,
        name=name,
        mobile_number=mobile_number,
        email=email,
        transaction_id=transaction_id,
        plan_type=plan_type,
        screenshot_url=file_url
    )
    db.add(req)
    await db.commit()
    return {"message": "Request submitted successfully"}

@router.get("/admin/manual")
async def list_manual_requests(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)  # Assuming admin dependency
):
    result = await db.execute(select(ManualSubscriptionRequest).order_by(ManualSubscriptionRequest.created_at.desc()))
    return result.scalars().all()

@router.put("/admin/manual/{req_id}/status")
async def update_manual_request(
    req_id: str,
    status: str = Form(...),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(ManualSubscriptionRequest)
        .filter(ManualSubscriptionRequest.id == req_id)
        .options(selectinload(ManualSubscriptionRequest.user))
    )
    req = result.scalars().first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    req.status = status
    
    if status == SubscriptionStatus.APPROVED:
        # Create subscription
        now = datetime.utcnow()
        days = 365 if req.plan_type == "YEARLY" else 180
        end_date = now + timedelta(days=days)
        
        new_sub = Subscription(
            user_id=req.user_id,
            plan_type=req.plan_type,
            start_date=now,
            end_date=end_date,
            payment_id=f"manual_{req.transaction_id}",
            is_active=True
        )
        db.add(new_sub)
        req.user.is_premium = True
        
    await db.commit()
    return {"message": "Status updated"}
