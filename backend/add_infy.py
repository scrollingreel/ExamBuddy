import sqlite3
import uuid
import datetime

questions = [
    {'title': '219. Contains Duplicate II', 'link': 'https://leetcode.com/problems/contains-duplicate-ii/description/'},
    {'title': '205. Isomorphic Strings', 'link': 'https://leetcode.com/problems/isomorphic-strings/description/'},
    {'title': '383. Ransom Note', 'link': 'https://leetcode.com/problems/ransom-note/description/'},
    {'title': 'Caesar Cipher', 'link': 'https://www.hackerrank.com/challenges/caesar-cipher-1/problem?isFullScreen=false'},
    {'title': 'Mars Exploration', 'link': 'https://www.hackerrank.com/challenges/mars-exploration/problem?isFullScreen=false'},
    {'title': '242. Valid Anagram', 'link': 'https://leetcode.com/problems/valid-anagram/description/?envType=problem-list-v2&envId=string'},
    {'title': '128. Longest Consecutive Sequence', 'link': 'https://leetcode.com/problems/longest-consecutive-sequence/description/'},
    {'title': 'Super Reduced String', 'link': 'https://www.hackerrank.com/challenges/reduced-string/problem?isFullScreen=false'},
    {'title': 'Strong Password', 'link': 'https://www.hackerrank.com/challenges/strong-password/problem?isFullScreen=false'},
    {'title': '49. Group Anagrams', 'link': 'https://leetcode.com/problems/group-anagrams/description/'},
    {'title': '151. Reverse Words in a String', 'link': 'https://leetcode.com/problems/reverse-words-in-a-string/description/?envType=study-plan-v2&envId=top-interview-150'},
    {'title': '290. Word Pattern', 'link': 'https://leetcode.com/problems/word-pattern/description/'},
    {'title': '3. Longest substring without repeating characters', 'link': 'https://leetcode.com/problems/longest-substring-without-repeating-characters/description/?envType=problem-list-v2&envId=string'}
]

def add_hackwithinfy():
    conn = sqlite3.connect('exambuddy.db')
    cursor = conn.cursor()
    
    mat_id = str(uuid.uuid4()).replace('-', '')
    now = datetime.datetime.utcnow().isoformat()
    
    try:
        # Note: SQLAlchemy uses UUIDs represented as hex strings with or without dashes depending on the dialect
        # For sqlite it usually stores dashes by default when using python UUID, but let's check schema.
        # It's better to use regular string with dashes for UUID 
        mat_id = str(uuid.uuid4())
        cursor.execute(
            """INSERT INTO placement_materials (id, title, company, category, type, created_at)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (mat_id.replace('-',''), 'Hack with Infy Prep Sheet', 'Infosys', 'Coding', 'Question Sheet', now)
        )
    except sqlite3.OperationalError as e:
        print("Error inserting material:", e)
        # Maybe ID is binary 16? Let's use hyphenated if the dialect requires
        try:
            mat_id = str(uuid.uuid4())
            cursor.execute(
                """INSERT INTO placement_materials (id, title, company, category, type, created_at)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (mat_id, 'Hack with Infy Prep Sheet', 'Infosys', 'Coding', 'Question Sheet', now)
            )
        except Exception as e2:
            print("Second attempt Error:", e2)
            
    try:
        for q in questions:
            q_id = str(uuid.uuid4()).replace('-', '')
            cursor.execute(
                """INSERT INTO placement_questions (id, material_id, title, link, created_at)
                   VALUES (?, ?, ?, ?, ?)""",
                (q_id, mat_id.replace('-',''), q['title'], q['link'], now)
            )
    except sqlite3.IntegrityError:
        pass
    except sqlite3.OperationalError as e:
        print("Error inserting questions:", e)
        for q in questions:
            q_id = str(uuid.uuid4())
            cursor.execute(
                """INSERT INTO placement_questions (id, material_id, title, link, created_at)
                   VALUES (?, ?, ?, ?, ?)""",
                (q_id, mat_id, q['title'], q['link'], now)
            )
            
    conn.commit()
    conn.close()
    print("Added successfully")

if __name__ == "__main__":
    add_hackwithinfy()
