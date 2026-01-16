from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./exambuddy.db")

# Robust SSL handling for Supabase/Asyncpg
import ssl
connect_args = {}
if "postgresql" in DATABASE_URL:
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        connect_args["ssl"] = ctx
        
        # Log connection details (masking password)
        try:
            from sqlalchemy.engine.url import make_url
            url_obj = make_url(DATABASE_URL)
            print(f"Attempting DB Connection -> Host: {url_obj.host}, Port: {url_obj.port}, Database: {url_obj.database}")
        except Exception as e:
            print(f"Could not parse DB URL for logging: {e}")

    except Exception as e:
        print(f"Error creating SSL context: {e}")

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    connect_args=connect_args
)

SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as session:
        yield session
