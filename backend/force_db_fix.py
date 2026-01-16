import sqlite3
import os

DB_PATH = "backend/exambuddy.db" # Standard default for FastAPI/SQLAlchemy localized
# If not there, try generic
if not os.path.exists(DB_PATH):
    print(f"{DB_PATH} not found. Searching...")
    for root, dirs, files in os.walk("."):
        if "sql_app.db" in files:
            DB_PATH = os.path.join(root, "sql_app.db")
            print(f"Found at {DB_PATH}")
            break

def fix_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Check/Add sgpa to users
    try:
        cursor.execute("SELECT sgpa FROM users LIMIT 1")
        print("'sgpa' column exists in 'users'.")
    except sqlite3.OperationalError:
        print("Adding 'sgpa' column to 'users'...")
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN sgpa FLOAT")
            print("Success: 'sgpa' column added.")
        except Exception as e:
            print(f"Error adding sgpa: {e}")

    # 2. Check/Create downloads table
    try:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS downloads (
                id CHAR(36) PRIMARY KEY,
                user_id CHAR(36),
                note_id CHAR(36),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(note_id) REFERENCES notes(id)
            )
        """)
        print("Checked/Created 'downloads' table.")
    except Exception as e:
        print(f"Error creating downloads table: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_db()
