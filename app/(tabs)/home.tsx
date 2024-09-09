import React from 'react';
import { View, StyleSheet, Button, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView>
      <Header />
      <View style={styles.contentContainer}>
        <Button title="Welcome" onPress={() => router.replace('/')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    paddingTop: 300, 
    padding: 16,
  },
});
