
import sqlite3
import datetime

def add_last_active_column():
    conn = sqlite3.connect('backend/exambuddy.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN last_active_at DATETIME")
        print("Added column last_active_at to users table")
    except sqlite3.OperationalError as e:
        print(f"Error adding column (might already exist): {e}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_last_active_column()
