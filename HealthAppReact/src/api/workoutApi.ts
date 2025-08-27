import axios from 'axios';

// const API_BASE = 'http://localhost:5000'; // Maanan Laptop
const API_BASE = 'http://10.0.0.20:5000'; // Maanan Phone
//const API_BASE = 'http://localhost:5000';

export async function sendSession(date: string) {
  const res = await axios.post(`${API_BASE}/add_session`, { date });
  return res.data.session_id;
}

export async function sendWorkout(sessionId: number, name: string) {
  const res = await axios.post(`${API_BASE}/add_workout`, {
    session_id: sessionId,
    name,
  });
  return res.data.workout_id;
}

export async function sendExercise(workoutId: number, name: string) {
  const res = await axios.post(`${API_BASE}/add_exercise`, {
    workout_id: workoutId,
    name,
  });
  return res.data.exercise_id;
}

export async function sendSet(
  exerciseId: number,
  reps?: string,
  weight?: string,
  duration_sec?: string
) {
  await axios.post(`${API_BASE}/add_set`, {
    exercise_id: exerciseId,
    reps,
    weight,
    duration_sec,
  });
}