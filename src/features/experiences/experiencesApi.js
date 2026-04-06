import { apiSlice } from '../../services/apiSlice';

export const experiencesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExperiences: builder.query({
      query: (params) => ({
        url: '/experiences',
        params,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Experiences', id: _id })),
              { type: 'Experiences', id: 'LIST' },
            ]
          : [{ type: 'Experiences', id: 'LIST' }],
    }),
    getExperience: builder.query({
      query: (id) => `/experiences/${id}`,
      providesTags: (result, error, id) => [{ type: 'Experiences', id }],
    }),
    createExperience: builder.mutation({
      query: (data) => ({
        url: '/experiences',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Experiences', id: 'LIST' }],
    }),
    updateExperience: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/experiences/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Experiences', id },
        { type: 'Experiences', id: 'LIST' },
      ],
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({
        url: `/experiences/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Experiences', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetExperiencesQuery,
  useGetExperienceQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experiencesApi;
