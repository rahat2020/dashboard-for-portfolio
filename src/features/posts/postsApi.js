import { apiSlice } from '../../services/apiSlice';

export const postsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (params) => ({
        url: '/posts',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Posts', id: _id })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    getPost: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: '/posts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Posts', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsApi;
