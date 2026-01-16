from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..core.database import get_db
from ..models.models import User, Subscription, SubscriptionPlan, UserRole
from .deps import get_current_user
from datetime import datetime, timedelta
from pydantic import BaseModel
import uuid
import hmac
import hashlib

router = APIRouter()

# Mock Razorpay credentials
RAZORPAY_KEY_ID = "rzp_test_12345678"
RAZORPAY_KEY_SECRET = "supersecretrazorpay"

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
    user: User = Depends(get_current_user)
):
    # In a real app, call Razorpay API to create an order
    order_id = f"order_{uuid.uuid4().hex[:10]}"
    
    amount = 9900 # default MONTHLY
    if sub_data.plan_type == SubscriptionPlan.SEMESTER:
        amount = 49900
    elif sub_data.plan_type == SubscriptionPlan.YEARLY:
        amount = 99900
    
    return {
        "order_id": order_id,
        "amount": amount,
        "currency": "INR",
        "key_id": RAZORPAY_KEY_ID,
        "plan": sub_data.plan_type
    }

@router.post("/verify-payment")
async def verify_payment(
    data: PaymentVerify,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Verify signature
    msg = f"{data.razorpay_order_id}|{data.razorpay_payment_id}"
    generated_signature = hmac.new(
        RAZORPAY_KEY_SECRET.encode(),
        msg.encode(),
        hashlib.sha256
    ).hexdigest()
    
    # In a real app: if generated_signature != data.razorpay_signature: raise Exception
    # For simulation, we assume success if provided
    
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
    user.is_premium = True
    
    await db.commit()
    return {"status": "success", "message": "Premium activated"}
