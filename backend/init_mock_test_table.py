import asyncio
from app.core.database import engine, Base
from app.models.models import MockTestSubmission
from sqlalchemy import text
from datetime import datetime, timedelta
import uuid

SAMPLE_LEADERBOARD = [
    {
        "student_name": "Aarav Sharma",
        "college": "ABES Engineering College",
        "test_id": "mock-1",
        "test_title": "Capgemini 2027 Mock Test 1",
        "score": 39,
        "total_marks": 40,
        "percentage": 97.5,
        "time_taken_seconds": 1240,
        "ai_score": 20,
        "tech_score": 19,
        "minutes_ago": 120
    },
    {
        "student_name": "Priya Verma",
        "college": "ABES Engineering College",
        "test_id": "mock-1",
        "test_title": "Capgemini 2027 Mock Test 1",
        "score": 38,
        "total_marks": 40,
        "percentage": 95.0,
        "time_taken_seconds": 1315,
        "ai_score": 19,
        "tech_score": 19,
        "minutes_ago": 180
    },
    {
        "student_name": "Rohan Gupta",
        "college": "KIET Group of Institutions",
        "test_id": "mock-1",
        "test_title": "Capgemini 2027 Mock Test 1",
        "score": 37,
        "total_marks": 40,
        "percentage": 92.5,
        "time_taken_seconds": 1420,
        "ai_score": 18,
        "tech_score": 19,
        "minutes_ago": 240
    },
    {
        "student_name": "Ananya Singh",
        "college": "ABES Engineering College",
        "test_id": "mock-2",
        "test_title": "Capgemini 2027 Mock Test 2",
        "score": 38,
        "total_marks": 40,
        "percentage": 95.0,
        "time_taken_seconds": 1290,
        "ai_score": 19,
        "tech_score": 19,
        "minutes_ago": 90
    },
    {
        "student_name": "Utkarsh Gupta",
        "college": "ABES Engineering College",
        "test_id": "mock-2",
        "test_title": "Capgemini 2027 Mock Test 2",
        "score": 40,
        "total_marks": 40,
        "percentage": 100.0,
        "time_taken_seconds": 1150,
        "ai_score": 20,
        "tech_score": 20,
        "minutes_ago": 60
    },
    {
        "student_name": "Devansh Pandey",
        "college": "AKGEC Ghaziabad",
        "test_id": "mock-3",
        "test_title": "Capgemini 2027 Mock Test 3",
        "score": 36,
        "total_marks": 40,
        "percentage": 90.0,
        "time_taken_seconds": 1510,
        "ai_score": 18,
        "tech_score": 18,
        "minutes_ago": 300
    },
    {
        "student_name": "Sneha Patel",
        "college": "ABES Engineering College",
        "test_id": "mock-4",
        "test_title": "Capgemini 2027 Mock Test 4",
        "score": 37,
        "total_marks": 40,
        "percentage": 92.5,
        "time_taken_seconds": 1380,
        "ai_score": 19,
        "tech_score": 18,
        "minutes_ago": 150
    },
    {
        "student_name": "Kartik Mishra",
        "college": "ABES Engineering College",
        "test_id": "mock-5",
        "test_title": "Capgemini 2027 Mock Test 5",
        "score": 38,
        "total_marks": 40,
        "percentage": 95.0,
        "time_taken_seconds": 1340,
        "ai_score": 19,
        "tech_score": 19,
        "minutes_ago": 45
    }
]

async def init():
    print("Connecting to DB and creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables ensured!")

    async with engine.connect() as conn:
        check = await conn.execute(text("SELECT count(*) FROM mock_test_submissions"))
        count = check.scalar()
        print(f"Current mock_test_submissions count: {count}")
        if count == 0:
            print("Seeding initial leaderboard submissions...")
            for s in SAMPLE_LEADERBOARD:
                sub_time = datetime.utcnow() - timedelta(minutes=s["minutes_ago"])
                stmt = text("""
                    INSERT INTO mock_test_submissions 
                    (id, student_name, college, test_id, test_title, score, total_marks, percentage, time_taken_seconds, ai_score, tech_score, submitted_at)
                    VALUES (:id, :student_name, :college, :test_id, :test_title, :score, :total_marks, :percentage, :time_taken_seconds, :ai_score, :tech_score, :submitted_at)
                """)
                await conn.execute(stmt, {
                    "id": str(uuid.uuid4()),
                    "student_name": s["student_name"],
                    "college": s["college"],
                    "test_id": s["test_id"],
                    "test_title": s["test_title"],
                    "score": s["score"],
                    "total_marks": s["total_marks"],
                    "percentage": s["percentage"],
                    "time_taken_seconds": s["time_taken_seconds"],
                    "ai_score": s["ai_score"],
                    "tech_score": s["tech_score"],
                    "submitted_at": sub_time
                })
            await conn.commit()
            print("Seeded successfully!")
        else:
            print("Table already has data.")

if __name__ == "__main__":
    asyncio.run(init())
