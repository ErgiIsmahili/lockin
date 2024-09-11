import AsyncStorage from "@react-native-async-storage/async-storage";
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

const loadUserFromStorage = async (): Promise<User | null> => {
  try {
    const userInfo = await AsyncStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
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
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutUserAction: (state) => {
      state.user = null;
      state.isLoading = false;
      AsyncStorage.removeItem("userInfo");
    },
    setUserAction: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
  },
});

export const { loginUserAction, logoutUserAction, setUserAction } = authSlice.actions;
export default authSlice.reducer;

export const loadUser = () => async (dispatch: AppDispatch) => {
  const userInfo = await loadUserFromStorage();
  if (userInfo) {
    dispatch(setUserAction(userInfo));
  }
};
