import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = "http://localhost:8000";
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

const registerUser = async ({ username, email, password }: { username: string; email: string; password: string }) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/users/register`,
      { email, password, username }
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

const getUserGroups = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No auth token found');
    }

    const url = `${baseURL}/api/users/groups`;
    console.log('Fetching user groups from:', url);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw new Error(`Request failed: ${error.response?.status} ${error.response?.data?.message || error.message}`);
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
};

const getGroupById = async (id: string) => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No auth token found');
    }

    const url = `${baseURL}/api/groups/${id}`;
    console.log('Fetching group details from:', url);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw new Error(`Request failed: ${error.response?.status} ${error.response?.data?.message || error.message}`);
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
};

export { loginUser, registerUser, createGroup, getUserGroups, getGroupById };