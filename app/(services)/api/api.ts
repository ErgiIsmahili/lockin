import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = "http://localhost:8000";
const AUTH_TOKEN_KEY = 'authToken';
const USER_ID_KEY = 'userId';

interface User {
  _id: string;
  username: string;
}

interface CheckIn {
  user: User;
  date: string;
  confirmed: boolean;
}

interface Group {
  _id: string;
  name: string;
  frequency: string;
  streak: number;
  image: string;
  checkIns: CheckIn[];
  isCheckedInToday?: boolean;
}

const loginUser = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/users/login`,
      { email, password }
    );
    const { token, id } = response.data; 
    if (token && id) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_ID_KEY, id);
      console.log('Stored user ID:', id);
    } else {
      console.error('Token or user ID (id) is missing in the response');
    }
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

const registerUser = async ({ username, email, password, image }: { username: string; email: string; password: string; image?: string }) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/users/register`,
      { email, password, username, image }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUserProfile = async ({ username, image }: { username?: string; image?: string }) => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await axios.put(
      `${baseURL}/api/users/profile`,
      { username, image },
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

const getUserId = async (): Promise<string | null> => {
  try {
    const userId = await AsyncStorage.getItem(USER_ID_KEY);
    return userId;
  } catch (error) {
    console.error('Error retrieving user ID from AsyncStorage:', error);
    return null;
  }
};

const getGroupById = async (id: string): Promise<Group> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No auth token found');
    }

    const url = `${baseURL}/api/groups/${id}`;

    const response = await axios.get<Group>(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 10000,
    });

    const data = response.data;
    const today = new Date().toISOString().split('T')[0];
    const userId = await getUserId();

    if (userId) {
      data.isCheckedInToday = data.checkIns.some((checkIn: CheckIn) =>
        checkIn.user._id === userId && checkIn.date.split('T')[0] === today && checkIn.confirmed
      );
    } else {
      console.warn('User ID not found');
      data.isCheckedInToday = false;
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw new Error(`Failed to fetch group details: ${error.response?.status} ${error.response?.data?.message || error.message}`);
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
};

const checkIn = async (groupId: string) => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error('No auth token found');
    }

    const url = `${baseURL}/api/groups/${groupId}/checkin`;
    console.log('Sending check-in request to:', url);

    const response = await axios.post(url, {}, {
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
      throw new Error(`Check-in failed: ${error.response?.status} ${error.response?.data?.message || error.message}`);
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
};

export { loginUser, registerUser, updateUserProfile, createGroup, getUserGroups, getGroupById, checkIn };
