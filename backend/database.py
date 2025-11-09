import sqlite3

DATABASE = 'attendance.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    return conn

def init_db():
    with get_db() as db:
        cursor = db.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            face_data BLOB NOT NULL
        )
        """)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            FOREIGN KEY (student_id) REFERENCES students (id)
        )
        """)
        db.commit()

def numpy_to_binary(arr):
    return arr.tobytes()

def binary_to_numpy(blob):
    return np.frombuffer(blob, dtype=np.float64)

def fetch_all_attendance():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("""
        SELECT students.name, attendance.date, attendance.time
        FROM attendance
        JOIN students ON attendance.student_id = students.id
    """)
    records = cursor.fetchall()
    db.close()
    return [{"name": row[0], "date": row[1], "time": row[2]} for row in records]

def add_attendance(student_id):
    db = get_db()
    cursor = db.cursor()
    import datetime
    now = datetime.datetime.now()
    date = now.strftime("%Y-%m-%d")
    time = now.strftime("%H:%M:%S")
    cursor.execute("INSERT INTO attendance (student_id, date, time) VALUES (?, ?, ?)", (student_id, date, time))
    db.commit()
    db.close()

def get_student_by_name(name):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id FROM students WHERE name = ?", (name,))
    student = cursor.fetchone()
    db.close()
    return student[0] if student else None

def add_student(name, face_data):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO students (name, face_data) VALUES (?, ?)", (name, face_data))
    db.commit()
    db.close()

def get_all_students_with_faces():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT id, name, face_data FROM students")
    students = cursor.fetchall()
    db.close()
    return students

if __name__ == '__main__':
    init_db()