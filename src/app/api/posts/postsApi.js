import { coreApi } from "../core/coreApi";

export const postsApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all posts
    getAllPosts: builder.query({
      query: () => "/posts",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'posts', id: _id })),
              { type: 'posts', id: 'LIST' },
            ]
          : [{ type: 'posts', id: 'LIST' }],
    }),
  }),
});

export const { useGetAllPostsQuery } = postsApi;
