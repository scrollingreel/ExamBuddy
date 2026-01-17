import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional
import os

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password, hashed_password):
    # Truncate to 72 bytes to avoid errors
    encoded = plain_password.encode('utf-8')
    if len(encoded) > 72:
        plain_password = encoded[:72].decode('utf-8', errors='ignore')
    
    # Check password
    # bcrypt.checkpw requires bytes, so encode both
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )

def get_password_hash(password):
    # Truncate to 72 bytes to avoid errors
    encoded = password.encode('utf-8')
    if len(encoded) > 72:
        password = encoded[:72].decode('utf-8', errors='ignore')
        
    # Hash password
    # gensalt() generates a salt, hashpw() hashes it
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
