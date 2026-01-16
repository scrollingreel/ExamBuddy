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
            print(f"Original DB URL -> Host: {url_obj.host}, Port: {url_obj.port}")

            # Force IPv4 Resolution to avoid [Errno 101] Network is unreachable on Render/Supabase
            import socket
            try:
                # Resolve hostname to IPv4 address
                ipv4_address = socket.gethostbyname(url_obj.host)
                print(f"Resolved {url_obj.host} to {ipv4_address}")
                
                 # Replace hostname with IPv4 in the DATABASE_URL
                DATABASE_URL = DATABASE_URL.replace(url_obj.host, ipv4_address)
            except Exception as e:
                print(f"IPv4 Resolution failed: {e}")

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
