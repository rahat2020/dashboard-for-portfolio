import { coreApi } from "../core/coreApi";

export const projectsApi = coreApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all projects
    getAllProjects: builder.query({
      query: () => "/projects",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'projects', id: _id })),
              { type: 'projects', id: 'LIST' },
            ]
          : [{ type: 'projects', id: 'LIST' }],
    }),

    // Create a new project
    createProject: builder.mutation({
      query: (projectData) => ({
        url: "/projects",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: [{ type: 'projects', id: 'LIST' }],
    }),
  }),
});

export const { useGetAllProjectsQuery, useCreateProjectMutation } = projectsApi;
