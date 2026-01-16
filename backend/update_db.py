import sqlite3

def add_columns():
    conn = sqlite3.connect('backend/exambuddy.db')
    cursor = conn.cursor()
    
    columns = [
        ("full_name", "VARCHAR"),
        ("mobile_number", "VARCHAR"),
        ("semester", "INTEGER"),
        ("cgpa", "FLOAT"),
        ("target_cgpa", "FLOAT")
    ]
    
    for col_name, col_type in columns:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name}")
        except sqlite3.OperationalError as e:
            print(f"Column {col_name} already exists or error: {e}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_columns()
