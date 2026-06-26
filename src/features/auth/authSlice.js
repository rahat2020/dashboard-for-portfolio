import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  userData: null,
  token: Cookies.get("token") || null,
  isAuthenticated: !!Cookies.get("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, rememberMe } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      if (token) {
        Cookies.set("token", token, { expires: rememberMe ? 365 : undefined }); 
      }
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userData = null;
      state.isAuthenticated = false;
      Cookies.remove("token");
    },
  },
});

export const { setCredentials, setUserData, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUserData = (state) => state.auth.userData;
