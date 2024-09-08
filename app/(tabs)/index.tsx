import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/Header';

export default function HomeScreen() {
  return (
    <ScrollView>
      <Header />
      <View style={styles.contentContainer}>
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
