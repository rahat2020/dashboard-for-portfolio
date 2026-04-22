import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessToken } from "../../../utils/appHelpers";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const customBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const token = state?.auth?.token || getAccessToken();

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
