import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";

export const coreApi = createApi({
  reducerPath: "coreApi",
  baseQuery: customBaseQuery,
  tagTypes: ["posts", "users", "projects", "experiences", "About"],
  endpoints: () => ({}),
});
