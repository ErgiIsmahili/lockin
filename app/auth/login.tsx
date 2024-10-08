import React from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from "../(services)/api/api";
import { loginUserAction } from "../(redux)/authSlice";
import { useDispatch, useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required").email().label("Email"),
  password: Yup.string().required("Password is required").min(4).label("Password"),
});

export default function Login() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: loginUser,
    mutationKey:['login'],
  }) 

  const dispatch = useDispatch();

  useSelector((state) => console.log("Store data", state))
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {mutation?.isError && (
        <Text style={styles.errorText}>
          {mutation?.error?.message}
          </Text>
      )}
    <Formik
      initialValues={{ email: "ergi@gmail.com", password: "ergi123" }}
      onSubmit={(values) => {
        mutation
          .mutateAsync(values)
          .then((data) => {
            dispatch(loginUserAction(data))
            router.replace("../home"); 
          })
          .catch((error) => {
            console.log("Login error:", error); 
          });
      }}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            keyboardType="email-address"
            placeholderTextColor="#888"
          />
          {errors.email && touched.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            secureTextEntry
            placeholderTextColor="#888"
          />
          {errors.password && touched.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleSubmit()}
            disabled={mutation?.isPending}  
          >
            {mutation?.isPending ? (
              <ActivityIndicator color='#fff'/>
            ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
          </TouchableOpacity>
        </View>
      )}
    </Formik>


      <Button title="Register" onPress={() => router.replace('/auth/register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
