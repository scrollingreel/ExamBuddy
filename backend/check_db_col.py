import sqlite3

def check_db():
    conn = sqlite3.connect('backend/exambuddy.db')
    cursor = conn.cursor()
    try:
        # Check if column exists by selecting it
        cursor.execute("SELECT category FROM notes LIMIT 1")
        print("Column 'category' exists.")
    except Exception as e:
        print(f"Error: {e}")
    conn.close()

if __name__ == "__main__":
    check_db()
