from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import JWTError, jwt
from ..core.database import get_db
from ..models.models import User, UserRole
from ..core.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user_optional(token: str = Depends(OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)), db: AsyncSession = Depends(get_db)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except JWTError:
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
    
    # Verify Supabase Token
    from ..core.supabase_client import supabase
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise credentials_exception
        email = user_response.user.email
    except Exception:
        # Fallback to old JWT logic if Supabase verify fails (for backward compat if needed, or just fail)
        # But since we switched frontend, we should primarily trust Supabase.
        # If headers are missing, Supabase client might raise or return error.
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
