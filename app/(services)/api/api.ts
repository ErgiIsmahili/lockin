import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = "https://crazy-cups-enjoy.loca.lt";
const AUTH_TOKEN_KEY = 'authToken';

const loginUser = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/users/login`,
      { email, password }
    );
    const { token } = response.data;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const registerUser = async ({ username, email, password }: { username: string; email: string; password: string}) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/users/register`,
      { email, password , username}
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface CreateGroupData {
  name: string;
  image?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  howManyDaysPerWeek?: number;
  weeksPerMonth?: number;
}

const createGroup = async (data: CreateGroupData) => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await axios.post(
      `${baseURL}/api/groups`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export { loginUser, registerUser, createGroup };
