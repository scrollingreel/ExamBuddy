from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ExamBuddy API",
    description="Backend for ExamBuddy Web Platform",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "Welcome to ExamBuddy API", "status": "running"}



from .api import auth, notes, payments, admin
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(payments.router, prefix="/subscription", tags=["Subscription"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

from .api import circulars
app.include_router(circulars.router, prefix="/circulars", tags=["Circulars"])

