import { Image, StyleSheet, Platform, View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../(redux)/store';
import { logoutUserAction } from '../(redux)/authSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const handleLogout = () => {
    dispatch(logoutUserAction());
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>User Profile</Text>
        {user ? (
          <>
            <Text style={styles.text}>Email: {user.email}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

