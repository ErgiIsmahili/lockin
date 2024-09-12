import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store"; // import your store's dispatch type

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

const USER_INFO_KEY = "userInfo";

const loadUserFromStorage = async (): Promise<User | null> => {
  try {
    const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Failed to load user from storage", error);
    return null;
  }
};

const initialState: AuthState = {
  user: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUserAction: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
      AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(action.payload)).catch((error) => {
        console.error("Failed to save user to storage", error);
      });
    },
    logoutUserAction: (state) => {
      state.user = null;
      state.isLoading = false;
      AsyncStorage.removeItem(USER_INFO_KEY).catch((error) => {
        console.error("Failed to remove user from storage", error);
      });
    },
    setUserAction: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
  },
});

export const { loginUserAction, logoutUserAction, setUserAction } = authSlice.actions;
export default authSlice.reducer;

export const loadUser = () => async (dispatch: AppDispatch) => {
  try {
    const userInfo = await loadUserFromStorage();
    dispatch(setUserAction(userInfo)); // Correctly handle both User and null
  } catch (error) {
    console.error("Failed to load user", error);
    dispatch(setUserAction(null)); // Ensure that null is handled
  }
};
