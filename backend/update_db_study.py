import sqlite3

def add_columns():
    conn = sqlite3.connect('backend/exambuddy.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN study_hours FLOAT DEFAULT 0.0")
        print("Added column study_hours")
    except sqlite3.OperationalError as e:
        print(f"Column study_hours likely exists or error: {e}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_columns()
