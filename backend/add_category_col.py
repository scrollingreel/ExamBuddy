import sqlite3

def add_category_column():
    conn = sqlite3.connect('backend/exambuddy.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE notes ADD COLUMN category VARCHAR DEFAULT 'NOTE'")
        print("Added column category to notes table")
    except sqlite3.OperationalError as e:
        print(f"Error adding column (might already exist): {e}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_category_column()
