import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={{ uri: 'https://picsum.photos/200/300' }}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome to Your Health App</Text>
      <Text style={styles.subtitle}>Let's achieve your fitness goals!</Text>

      <View style={styles.buttonContainer}>
        <Link href="/workout" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Workout</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/plans" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>View Plans</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/progress" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Progress</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    backgroundColor: '#F0A500',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
