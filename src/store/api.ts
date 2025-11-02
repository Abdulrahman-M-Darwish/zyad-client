import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
		credentials: "include",
	}),
	reducerPath: "api",
	tagTypes: ["user", "levels", "sections"],
	endpoints: (build) => ({}),
});
