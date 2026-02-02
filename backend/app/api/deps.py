from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..core.database import get_db
from ..models.models import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

import time

# Simple in-memory cache: token -> (email, timestamp)
TOKEN_CACHE = {}
CACHE_TTL = 60  # seconds

async def get_current_user_optional(token: str = Depends(OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)), db: AsyncSession = Depends(get_db)):
    if not token:
        return None
    
    current_time = time.time()
    
    # Check cache
    if token in TOKEN_CACHE:
        email, timestamp = TOKEN_CACHE[token]
        if current_time - timestamp < CACHE_TTL:
            # Cache hit
            pass
        else:
             # Expired
             del TOKEN_CACHE[token]
             email = None
    else:
        email = None

    if not email:
        from ..core.supabase_client import supabase
        try:
            user_response = supabase.auth.get_user(token)
            if not user_response or not user_response.user:
                return None
            email = user_response.user.email
            # Update cache
            TOKEN_CACHE[token] = (email, current_time)
        except Exception:
            return None
        
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    return user

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    current_time = time.time()
    email = None

    # Check cache
    if token in TOKEN_CACHE:
        cached_email, timestamp = TOKEN_CACHE[token]
        if current_time - timestamp < CACHE_TTL:
            email = cached_email
    
    if not email:
        # Verify Supabase Token
        from ..core.supabase_client import supabase
        try:
            # print(f"DEBUG: Verifying token: {token[:10]}...") 
            user_response = supabase.auth.get_user(token)
            # print(f"DEBUG: Supabase response: {user_response}")
            if not user_response or not user_response.user:
                print("DEBUG: No user in Supabase response")
                raise credentials_exception
            email = user_response.user.email
            # Update cache
            TOKEN_CACHE[token] = (email, current_time)
            # print(f"DEBUG: Backend verified email: {email}")
        except Exception as e:
            print(f"DEBUG: Supabase verification failed: {e}")
            raise credentials_exception

    # Check against local DB
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    
    if user is None:
        # Lazy creation of user in our DB
        # We need a dummy password as the column is nullable=False
        user = User(
            email=email, 
            hashed_password="supabase_otp_managed",
            role=UserRole.STUDENT
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
    return user

async def get_current_admin(user: User = Depends(get_current_user)):
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    return user
