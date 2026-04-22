import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { apiSlice } from "../services/apiSlice";
import { authenticationApi } from "./api/auth/authenticationApi";
import { coreApi } from "./api/core/coreApi";
import uiReducer from "../features/ui/uiSlice";
import authReducer from "../features/auth/authSlice";

// Resilient storage wrapper for Vite/ESM compatibility
const customStorage = {
  getItem: (key) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key, value) => {
    return Promise.resolve(localStorage.setItem(key, value));
  },
  removeItem: (key) => {
    return Promise.resolve(localStorage.removeItem(key));
  },
};

const persistConfig = {
  key: "root",
  version: 1,
  storage: customStorage,
  whitelist: ["auth", "ui"], // Persist auth and ui states
};

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [authenticationApi.reducerPath]: authenticationApi.reducer,
  [coreApi.reducerPath]: coreApi.reducer,
  ui: uiReducer,
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware, authenticationApi.middleware, coreApi.middleware),
});

export const persistor = persistStore(store);

export default store;
