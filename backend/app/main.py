from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback

app = FastAPI(
    title="ExamBuddy API",
    description="Backend for ExamBuddy Web Platform",
    version="1.0.0"
)

# Startup: Create Tables
from .core.database import engine, Base
# Import models to ensure they are registered
from .models import models 

@app.on_event("startup")
async def startup_db_client():
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print(f"Startup DB Connection Failed: {e}")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler to ensure CORS headers are sent even on 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    error_msg = str(exc)
    print(f"Global Exception: {error_msg}")
    traceback.print_exc()
    
    return JSONResponse(
        status_code=500,
        content={"detail": error_msg, "type": type(exc).__name__},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )

from fastapi.staticfiles import StaticFiles
import os

if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/debug-network")
async def debug_network():
    import socket
    import os
    
    results = {}
    db_url = os.getenv("DATABASE_URL", "")
    results["db_url_masked"] = db_url.replace(db_url.split("@")[0], "postgresql://***") if "@" in db_url else "NOT_SET"
    
    # Parse Host/Port
    try:
        from sqlalchemy.engine.url import make_url
        u = make_url(db_url)
        host = u.host
        port = u.port
        results["parsed"] = {"host": host, "port": port}
        
        # DNS Resolution
        try:
            ip = socket.gethostbyname(host)
            results["dns_resolution_ipv4"] = ip
            
            # Check for all addresses (IPv4 and IPv6)
            addr_info = socket.getaddrinfo(host, port)
            results["dns_all_results"] = str(addr_info)
        except Exception as e:
            results["dns_resolution_error"] = str(e)
            return results

        # TCP Connectivity Hostname
        try:
            sock = socket.create_connection((host, port), timeout=5)
            results["tcp_connect_hostname"] = "SUCCESS"
            sock.close()
        except Exception as e:
            results["tcp_connect_hostname_error"] = str(e)

        # TCP Connectivity IP
        if "dns_resolution" in results:
            try:
                sock = socket.create_connection((results["dns_resolution"], port), timeout=5)
                results["tcp_connect_ip"] = "SUCCESS"
                sock.close()
            except Exception as e:
                results["tcp_connect_ip_error"] = str(e)
                
    except Exception as e:
        results["parsing_error"] = str(e)
        
    return results

@app.get("/")
async def root():
    return {"message": "Welcome to ExamBuddy API", "status": "running"}



from .api import auth, notes, payments, admin, circulars
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(payments.router, prefix="/subscription", tags=["Subscription"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(circulars.router, prefix="/circulars", tags=["Circulars"])



