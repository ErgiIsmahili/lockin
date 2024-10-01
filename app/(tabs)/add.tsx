import React from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import { Ionicons } from '@expo/vector-icons'

export default function AddScreen() {
  const router = useRouter();

  return (
    <ScrollView>
      <Header />
        {/* Searc Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search a dish, restaurant, etc" />
      </View>
            {/* Location Input */}
            <View style={styles.locationContainer}>
        <Ionicons name="location" size={20} color="gray" style={styles.locationIcon} />
        <TextInput style={styles.locationInput} placeholder="Location" />
      </View>
            {/* Tabs (Trending, Recs, Saved) */}
            <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButton}><Text>Filter</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}><Text>Trending</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}><Text>Recs</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}><Text>Saved</Text></TouchableOpacity>
      </View>
      {/* Recents List */}
      <ScrollView style={styles.recentsContainer}>
        <Text style={styles.recentsHeader}>Recents</Text>
      </ScrollView>
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
  header: {
    fontSize: 52,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  locationIcon: {
    marginRight: 10,
  },
  locationInput: {
    flex: 1,
    height: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // keeps the buttons aligned side by side
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderColor: 'black',  
    borderWidth: 1,        
    marginHorizontal: 5,  
  },
  recentsContainer: {
    flex: 1,
  },
  recentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
