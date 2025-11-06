import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookies } from "cookies-next";

export const api = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
		credentials: "include",
		async prepareHeaders(headers) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const cookies = (await getCookies()) as any;
			const cookiesText = Object.keys(cookies)
				.map((cookie: string) => `${cookie}=${cookies[cookie]}`)
				.join(";");
			headers.set("cookies", cookiesText);
		},
	}),
	reducerPath: "api",
	tagTypes: ["user", "levels", "sections"],

	endpoints: () => ({}),
});
