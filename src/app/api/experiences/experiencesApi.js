import { coreApi } from "../core/coreApi";

export const experiencesApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all experiences
    getAllExperiences: builder.query({
      query: () => "/experiences",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'experiences', id: _id })),
              { type: 'experiences', id: 'LIST' },
            ]
          : [{ type: 'experiences', id: 'LIST' }],
    }),
  }),
});

export const { useGetAllExperiencesQuery } = experiencesApi;
