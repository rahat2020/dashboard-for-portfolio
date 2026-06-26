import { coreApi } from '../../app/api/core/coreApi';

export const aboutApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query({
      query: () => '/about',
      providesTags: [{ type: 'About', id: 'SINGLETON' }],
    }),
    createAbout: builder.mutation({
      query: (data) => ({
        url: '/about',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'About', id: 'SINGLETON' }],
    }),
    updateAbout: builder.mutation({
      query: (data) => ({
        url: '/about',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'About', id: 'SINGLETON' }],
    }),
    deleteAbout: builder.mutation({
      query: () => ({
        url: '/about',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'About', id: 'SINGLETON' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAboutQuery,
  useCreateAboutMutation,
  useUpdateAboutMutation,
  useDeleteAboutMutation,
} = aboutApi;
