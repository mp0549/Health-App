from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_PATH = "workouts.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    return conn, conn.cursor()

@app.route('/add_session', methods=['POST'])
def add_session():
    data = request.get_json()
    date = data.get('date')

    conn, cursor = get_db()
    cursor.execute("INSERT INTO sessions (date) VALUES (?)", (date,))
    session_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({'session_id': session_id})

@app.route('/add_workout', methods=['POST'])
def add_workout():
    data = request.get_json()
    conn, cursor = get_db()
    cursor.execute("INSERT INTO workouts (session_id, name) VALUES (?, ?)", (data['session_id'], data['name']))
    workout_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'workout_id': workout_id})

@app.route('/add_exercise', methods=['POST'])
def add_exercise():
    data = request.get_json()
    conn, cursor = get_db()
    cursor.execute("INSERT INTO exercises (workout_id, name) VALUES (?, ?)", (data['workout_id'], data['name']))
    exercise_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return jsonify({'exercise_id': exercise_id})

@app.route('/add_set', methods=['POST'])
def add_set():
    data = request.get_json()
    conn, cursor = get_db()
    cursor.execute(
        "INSERT INTO sets (exercise_id, reps, weight, duration_sec) VALUES (?, ?, ?, ?)",
        (data['exercise_id'], data.get('reps'), data.get('weight'), data.get('duration_sec'))
    )
    conn.commit()
    conn.close()
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    # Optional: call your init_db function here to ensure the DB exists
    from workout import init_db
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)