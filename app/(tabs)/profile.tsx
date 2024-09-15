import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../(redux)/store';
import { logoutUserAction, updateUser } from '../(redux)/authSlice';
import { updateUserProfile } from '../(services)/api/api';
import * as ImagePicker from 'expo-image-picker';

type UpdatedUser = {
  username: string;
  image: string;
  email: string;
};

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [image, setImage] = useState(user?.image || '');

  const handleLogout = () => {
    dispatch(logoutUserAction());
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedUser: UpdatedUser = await updateUserProfile({ username, image });
      dispatch(updateUser(updatedUser));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <TouchableOpacity onPress={pickImage} disabled={!isEditing}>
            <Image 
              source={{ uri: image || 'https://via.placeholder.com/150' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />
          ) : (
            <Text style={styles.title}>{user.username}</Text>
          )}
          <Text style={styles.text}>Email: {user.email}</Text>
          {isEditing ? (
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>No user logged in</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    width: 300,
  },
  button: {
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  logoutButton: {
    backgroundColor: "#d32f2f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});