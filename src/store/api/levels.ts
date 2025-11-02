import { api } from "../api";
import { CreateLevelDto, UpdateLevelDto, Level } from "@/types";

const levelsApi = api.injectEndpoints({
	endpoints: (build) => ({
		// Get all levels
		getLevels: build.query<Level[], void>({
			query: () => ({
				url: "/levels",
				method: "GET",
			}),
			providesTags: ["levels"],
		}),

		// Get level by id
		getLevel: build.query<Level, string>({
			query: (id) => ({
				url: `/levels/${id}`,
				method: "GET",
			}),
			providesTags: ["levels"],
		}),

		// Create level
		createLevel: build.mutation<Level, CreateLevelDto>({
			query: (body) => ({
				url: "/levels",
				method: "POST",
				body,
			}),
			invalidatesTags: ["levels"],
		}),

		// Update level
		updateLevel: build.mutation<Level, { id: string; data: UpdateLevelDto }>({
			query: ({ id, data }) => ({
				url: `/levels/${id}`,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: ["levels"],
		}),

		// Delete level
		deleteLevel: build.mutation<{ success: boolean }, string>({
			query: (id) => ({
				url: `/levels/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["levels"],
		}),
	}),
});

export const {
	useGetLevelsQuery,
	useGetLevelQuery,
	useCreateLevelMutation,
	useUpdateLevelMutation,
	useDeleteLevelMutation,
	useLazyGetLevelQuery,
	useLazyGetLevelsQuery,
} = levelsApi;
