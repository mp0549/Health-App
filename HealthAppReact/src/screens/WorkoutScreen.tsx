import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import {
  sendSession,
  sendWorkout,
  sendExercise,
  sendSet,
} from '../api/workoutApi';

type SetData = {
  reps?: string;
  weight?: string;
};

type ExerciseData = {
  name: string;
  sets: SetData[];
  isSaved: boolean;
};

export default function WorkoutScreen() {
  const [date, setDate] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  const [newExercise, setNewExercise] = useState('');

  const addExercise = () => {
    if (!newExercise.trim()) return;
    setExercises([
      ...exercises,
      { name: newExercise.trim(), sets: [], isSaved: false },
    ]);
    setNewExercise('');
  };

  const addSetToExercise = (exerciseIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({ reps: '', weight: '' });
    setExercises(updated);
  };

  const updateSetField = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const saveExercise = (exerciseIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].isSaved = true;
    setExercises(updated);
  };

  const editExercise = (exerciseIndex: number) => {
    const updated = [...exercises];
    updated[exerciseIndex].isSaved = false;
    setExercises(updated);
  };

  const allSaved = exercises.length > 0 && exercises.every((ex) => ex.isSaved);

  const handleEndWorkout = async () => {
    if (!allSaved) {
      Alert.alert(
        'Not all exercises are saved',
        'Please save all exercises before ending the workout.'
      );
      return;
    }

    Alert.alert(
      'End Workout',
      'Are you sure you want to end the workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, End Workout',
          onPress: async () => {
            try {
              const sessionId = await sendSession(date);
              const workoutId = await sendWorkout(sessionId, workoutName);

              for (const exercise of exercises) {
                const exerciseId = await sendExercise(workoutId, exercise.name);
                for (const set of exercise.sets) {
                  await sendSet(
                    exerciseId,
                    set.reps || undefined,
                    set.weight || undefined,
                    undefined
                  );
                }
              }

              Alert.alert('Workout saved!', 'Great job today 💪');
              setDate('');
              setWorkoutName('');
              setExercises([]);
            } catch (error) {
              console.error('Failed to send workout data:', error);
              Alert.alert('Error', 'Something went wrong while saving your workout.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Workout Tracker</Text>

        <TextInput
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />

        <TextInput
          placeholder="Workout Name"
          value={workoutName}
          onChangeText={setWorkoutName}
          style={styles.input}
        />

        <View style={styles.exerciseSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>

          <View style={styles.row}>
            <TextInput
              placeholder="Exercise Name"
              value={newExercise}
              onChangeText={setNewExercise}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={addExercise} style={styles.button}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {exercises.map((exercise, exerciseIndex) => (
            <View key={exerciseIndex} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>

              {exercise.sets.map((set, setIndex) =>
                exercise.isSaved ? (
                  <Text key={setIndex} style={styles.setText}>
                    Set {setIndex + 1}: {set.weight} lbs x {set.reps} reps
                  </Text>
                ) : (
                  <View key={setIndex} style={styles.setRow}>
                    <TextInput
                      placeholder="Weight"
                      keyboardType="numeric"
                      value={set.weight}
                      onChangeText={(val) =>
                        updateSetField(
                          exerciseIndex,
                          setIndex,
                          'weight',
                          val.replace(/[^0-9.]/g, '')
                        )
                      }
                      style={styles.smallInput}
                    />
                    <TextInput
                      placeholder="Reps"
                      keyboardType="numeric"
                      value={set.reps}
                      onChangeText={(val) =>
                        updateSetField(
                          exerciseIndex,
                          setIndex,
                          'reps',
                          val.replace(/[^0-9]/g, '')
                        )
                      }
                      style={styles.smallInput}
                    />
                  </View>
                )
              )}

              {!exercise.isSaved && (
                <TouchableOpacity
                  onPress={() => addSetToExercise(exerciseIndex)}
                  style={[styles.button, { marginTop: 5 }]}
                >
                  <Text style={styles.buttonText}>+ Add Set</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() =>
                  exercise.isSaved
                    ? editExercise(exerciseIndex)
                    : saveExercise(exerciseIndex)
                }
                style={[
                  styles.saveButton,
                  { backgroundColor: exercise.isSaved ? '#ffc107' : '#28a745' },
                ]}
              >
                <Text style={styles.saveText}>
                  {exercise.isSaved ? 'Edit' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text
          style={[
            styles.saveStatus,
            { color: allSaved ? 'green' : 'red' },
          ]}
        >
          {allSaved
            ? 'All exercises have been saved.'
            : 'Some exercises have not been saved yet.'}
        </Text>

        <TouchableOpacity
          onPress={handleEndWorkout}
          style={[styles.button, { marginTop: 20, backgroundColor: '#dc3545' }]}
        >
          <Text style={styles.buttonText}>End Workout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  exerciseSection: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  button: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  exerciseCard: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  exerciseName: { fontWeight: 'bold', fontSize: 16 },
  setText: { fontSize: 14, marginVertical: 2 },
  setRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 5,
  },
  smallInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
  },
  saveButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: { color: 'white', fontWeight: 'bold' },
  saveStatus: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
});
