import sqlite3

def update_db_interaction():
    conn = sqlite3.connect('backend/exambuddy.db')
    cursor = conn.cursor()
    
    # Create Votes Table
    try:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS votes (
                id CHAR(36) PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                note_id CHAR(36) NOT NULL,
                vote_type INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (note_id) REFERENCES notes (id)
            )
        ''')
        print("Created votes table")
    except Exception as e:
        print(f"Error creating votes table: {e}")

    # Create Reviews Table
    try:
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reviews (
                id CHAR(36) PRIMARY KEY,
                user_id CHAR(36) NOT NULL,
                note_id CHAR(36) NOT NULL,
                rating INTEGER NOT NULL,
                comment TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (note_id) REFERENCES notes (id)
            )
        ''')
        print("Created reviews table")
    except Exception as e:
        print(f"Error creating reviews table: {e}")

    # Add columns to notes table
    cols = [
        ("vote_count", "INTEGER DEFAULT 0"),
        ("rating", "FLOAT DEFAULT 0.0"),
        ("rating_count", "INTEGER DEFAULT 0"),
    ]
    
    for col_name, col_type in cols:
        try:
            cursor.execute(f"ALTER TABLE notes ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name} to notes table")
        except sqlite3.OperationalError as e:
            print(f"Skipping {col_name} (likely exists): {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    update_db_interaction()
