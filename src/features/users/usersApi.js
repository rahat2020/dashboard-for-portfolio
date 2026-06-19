import { apiSlice } from "../../services/apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get all users
    getUsers: builder.query({
      query: (params) => ({
        url: "/auth/admins",
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Users", id: _id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    // get user by id
    getUserById: builder.query({
      query: (id) => `/auth/admins/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    // create user
    createUser: builder.mutation({
      query: (data) => ({
        url: "/auth/admins",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    // update user
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/auth/admins/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        { type: "Users", id: "LIST" },
      ],
    }),
    // delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/auth/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
