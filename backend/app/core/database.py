from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./exambuddy.db")
# Fix for Render/Heroku providing "postgres://" instead of "postgresql://"
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL and DATABASE_URL.startswith("postgresql://") and "asyncpg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Robust SSL handling for Supabase/Asyncpg
import ssl
import socket
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
            print(f"Connecting to DB -> Host: {url_obj.host}, Port: {url_obj.port}")
            
            # FORCE IPv4: Resolve hostname to IPv4 to avoid Render/Supabase IPv6 issues
            try:
                resolved_ip = socket.gethostbyname(url_obj.host)
                if resolved_ip != url_obj.host:
                    print(f"Resolved DB Host {url_obj.host} to {resolved_ip} to force IPv4")
                    # Reconstruct URL with IP
                    url_obj = url_obj.set(host=resolved_ip)
                    DATABASE_URL = url_obj.render_as_string(hide_password=False)
            except Exception as dns_e:
                 print(f"Could not resolve DB Host to IPv4: {dns_e}")

        except Exception as e:
            print(f"Could not parse DB URL for logging/resolution: {e}")

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
