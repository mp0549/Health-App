import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  TouchableHighlight, 
  Platform,
  StatusBar
} from 'react-native';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to your Health App!</Text>

      <TouchableHighlight onPress={() => alert('Image clicked!')}>
        <Image
          source={{
            uri: 'https://picsum.photos/200/300',
          }}
          style={{ width: 200, height: 300 }}
        />
      </TouchableHighlight>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for Android status bar


  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
});
