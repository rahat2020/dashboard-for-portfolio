import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../services/apiSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
