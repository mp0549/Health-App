import sqlite3

# ==========================
# 1️⃣ DATABASE INITIALIZATION
# ==========================
def init_db():
    conn = sqlite3.connect("workouts.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY,
        date TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY,
        session_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (session_id) REFERENCES sessions (id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY,
        workout_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (workout_id) REFERENCES workouts (id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY,
        exercise_id INTEGER NOT NULL,
        reps INTEGER,
        weight REAL,
        duration_sec INTEGER,
        FOREIGN KEY (exercise_id) REFERENCES exercises (id)
    );
    """)

    conn.commit()
    return conn, cursor


# ==========================
# 2️⃣ INSERTION HELPER FUNCS
# ==========================
def add_session(cursor, date):
    cursor.execute("INSERT INTO sessions (date) VALUES (?)", (date,))
    return cursor.lastrowid

def add_workout(cursor, session_id, name):
    cursor.execute("INSERT INTO workouts (session_id, name) VALUES (?,?)", (session_id, name))
    return cursor.lastrowid

def add_exercise(cursor, workout_id, name):
    cursor.execute("INSERT INTO exercises (workout_id, name) VALUES (?,?)", (workout_id, name))
    return cursor.lastrowid

def add_set(cursor, exercise_id, reps=None, weight=None, duration_sec=None):
    cursor.execute("""
    INSERT INTO sets (exercise_id, reps, weight, duration_sec) VALUES (?,?,?,?) 
    """, (exercise_id, reps, weight, duration_sec))


# ==========================
# 3️⃣ QUERY FUNCTION
# ==========================
def get_workout(cursor, session_id):
    cursor.execute("""
    SELECT e.name, s.reps, s.weight, s.duration_sec
    FROM workouts w
    JOIN exercises e ON w.id = e.workout_id
    JOIN sets s ON e.id = s.exercise_id
    WHERE w.session_id = ?;
    """, (session_id,))
    results = cursor.fetchall()
    return results


# ==========================
# 4️⃣ MAIN CLI
# ==========================
def main():
    conn, cursor = init_db()

    # Session
    date = input("Enter session date (YYYY-MM-DD): ")
    session_id = add_session(cursor, date)

    # Workout
    workout_name = input("Enter workout name (e.g., 'Upper Body', 'Leg Day'): ").strip()
    workout_id = add_workout(cursor, session_id, workout_name)

    while True:
        exercise_name = input("\nEnter exercise name (or 'done' to finish): ").strip()
        if exercise_name.lower() == 'done':
            break
        exercise_id = add_exercise(cursor, workout_id, exercise_name)

        while True:
            mode = input(f"Enter 'reps' for repetitions, 'duration' for a timed exercise, or 'next' for next exercise: ").strip().lower()
            if mode == 'next':
                break
            if mode == 'reps':
                reps = int(input("Enter number of repetitions: "))
                weight = float(input("Enter weight (negative for assisted): "))
                add_set(cursor, exercise_id, reps=reps, weight=weight)
            elif mode == 'duration':
                duration_sec = int(input("Enter duration in seconds: "))
                weight = float(input("Enter weight (negative for assisted, or 0 if none): "))
                add_set(cursor, exercise_id, weight=weight, duration_sec=duration_sec)

    conn.commit()

    # Print results
    results = get_workout(cursor, session_id)
    print("\nYour Session Results:\n----------------------")
    for name, reps, weight, duration_sec in results:
        if duration_sec:
            print(f"Exercise: {name}, Duration: {duration_sec} seconds, Weight: {weight}")
        else:
            print(f"Exercise: {name}, Reps: {reps}, Weight: {weight}")

    conn.close()


if __name__ == '__main__':
    main()
