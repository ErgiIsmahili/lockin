import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store"; 

export interface Group {
  id: string;
  name: string;
  image?: string;
  frequency: string;
  streak: number;
}

export interface CheckIn {
  date: string;
  confirmed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  image?: string;
  groups: Group[]; 
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
    updateUserAction: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(state.user)).catch((error) => {
          console.error("Failed to update user in storage", error);
        });
      }
    },
    updateGroupDataAction: (state, action: PayloadAction<Group[]>) => {
      if (state.user) {
        state.user.groups = action.payload; 
        AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(state.user)).catch((error) => {
          console.error("Failed to update user groups in storage", error);
        });
      }
    },
    updateCheckInAction: (state, action: PayloadAction<{ groupId: string; checkIn: CheckIn }>) => {
      if (state.user) {
        const group = state.user.groups.find(g => g.id === action.payload.groupId);
        if (group) {
        }
      }
    },
  },
});

export const { 
  loginUserAction, 
  logoutUserAction, 
  setUserAction, 
  updateUserAction, 
  updateGroupDataAction, 
  updateCheckInAction 
} = authSlice.actions;

export default authSlice.reducer;

export const loadUser = () => async (dispatch: AppDispatch) => {
  try {
    const userInfo = await loadUserFromStorage();
    dispatch(setUserAction(userInfo));
  } catch (error) {
    console.error("Failed to load user", error);
    dispatch(setUserAction(null));
  }
};

export const updateUser = (updates: Partial<User>) => async (dispatch: AppDispatch) => {
  dispatch(updateUserAction(updates));
};

export const updateGroups = (groups: Group[]) => async (dispatch: AppDispatch) => {
  dispatch(updateGroupDataAction(groups));
};