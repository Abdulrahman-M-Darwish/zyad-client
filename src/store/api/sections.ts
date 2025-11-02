import { api } from "../api";
import { CreateSectionDto, UpdateSectionDto, Section } from "@/types";

const sectionsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // Get all sections
    getSections: build.query<Section[], string | void>({
      query: (levelId) => ({
        url: `/sections?levelId=${levelId || ""}`,
        method: "GET",
      }),
      providesTags: ["sections"],
    }),

    // Get section by id
    getSection: build.query<Section, string>({
      query: (id) => ({
        url: `/sections/${id}`,
        method: "GET",
      }),
      providesTags: ["sections"],
    }),

    // Create section
    createSection: build.mutation<Section, CreateSectionDto>({
      query: (body) => ({
        url: "/sections",
        method: "POST",
        body,
      }),
      invalidatesTags: ["sections"],
    }),

    // Update section
    updateSection: build.mutation<
      Section,
      { id: string; data: UpdateSectionDto }
    >({
      query: ({ id, data }) => ({
        url: `/sections/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["sections"],
    }),

    // Delete section
    deleteSection: build.mutation<
      { success: boolean },
      { id: string; order: number }
    >({
      query: ({ id, order }) => ({
        url: `/sections/${id}`,
        method: "DELETE",
        body: { order },
      }),
      invalidatesTags: ["sections"],
    }),
  }),
});

export const {
  useGetSectionsQuery,
  useGetSectionQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useLazyGetSectionQuery,
  useLazyGetSectionsQuery,
} = sectionsApi;
