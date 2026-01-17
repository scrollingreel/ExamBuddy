import os
import razorpay
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..core.database import get_db
from ..models.models import User, Subscription, SubscriptionPlan, UserRole
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
    user: User = Depends(get_current_user)
):
    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=500, detail="Payment gateway not configured")

    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

    amount = 9900 # default: 99 INR
    if sub_data.plan_type == SubscriptionPlan.SEMESTER:
        amount = 49900 # 499 INR
    elif sub_data.plan_type == SubscriptionPlan.YEARLY:
        amount = 99900 # 999 INR
    
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
