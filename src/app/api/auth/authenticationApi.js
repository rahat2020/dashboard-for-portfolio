import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const authenticationApi = createApi({
  reducerPath: "authentication",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState();
      const token = state?.auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["auth"],

  endpoints: (builder) => ({
    // customer registration
    registration: builder.mutation({
      query: (formData) => {
        return {
          url: "/account_verification_store",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["auth"],
    }),

    // customer login
    loginUser: builder.mutation({
      query: (formData) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["auth"],
    }),

    // get user profile
    getProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["auth"],
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginUserMutation,
  useGetProfileQuery,
} = authenticationApi;
