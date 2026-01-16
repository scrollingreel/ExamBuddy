import sqlite3

def add_year_column():
    conn = sqlite3.connect('backend/exambuddy.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE notes ADD COLUMN year INTEGER DEFAULT NULL")
        print("Added column year to notes table")
    except sqlite3.OperationalError as e:
        print(f"Error adding column (might already exist): {e}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_year_column()
