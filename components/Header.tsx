// Header.js
import React from 'react';
import { Image, Text, View, StyleSheet, Platform } from 'react-native';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>plate</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 75, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8', 
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerTitle: {
    fontSize: 48,
    color: '#F17F05',
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
  },
});

export default Header;
