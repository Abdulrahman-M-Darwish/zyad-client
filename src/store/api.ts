import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

// Create a mutex for token refresh
const mutex = new Mutex();

// Token management utilities
export const tokenManager = {
	getAccessToken: () => {
		if (typeof window !== "undefined") {
			return getCookie("accessToken") as string;
		}
		return null;
	},
	getRefreshToken: () => {
		if (typeof window !== "undefined") {
			return getCookie("refreshToken") as string;
		}
		return null;
	},
	setTokens: (accessToken: string, refreshToken: string) => {
		if (typeof window !== "undefined") {
			setCookie("accessToken", accessToken);
			setCookie("refreshToken", refreshToken);
		}
	},
	clearTokens: () => {
		if (typeof window !== "undefined") {
			deleteCookie("accessToken");
			deleteCookie("refreshToken");
		}
	},
};

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
	prepareHeaders: (headers) => {
		const token = tokenManager.getAccessToken();
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	// Wait until the mutex is available without locking it
	await mutex.waitForUnlock();

	let result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		// Check if mutex is locked (another request is refreshing)
		if (!mutex.isLocked()) {
			const release = await mutex.acquire();

			try {
				const refreshToken = tokenManager.getRefreshToken();

				if (refreshToken) {
					// Try to refresh the token
					const refreshResult = await baseQuery(
						{
							url: "/auth/refresh",
							method: "POST",
							body: { refreshToken },
						},
						api,
						extraOptions
					);

					if (refreshResult.data) {
						// Store the new tokens
						const { accessToken, refreshToken: newRefreshToken } =
							refreshResult.data as {
								accessToken: string;
								refreshToken?: string;
							};

						tokenManager.setTokens(
							accessToken,
							newRefreshToken || refreshToken
						);

						// Retry the original request with new token
						result = await baseQuery(args, api, extraOptions);
					} else {
						// Refresh failed, clear tokens and redirect to login
						tokenManager.clearTokens();
						if (typeof window !== "undefined") {
							window.location.href = "/login";
						}
					}
				} else {
					// No refresh token, redirect to login
					if (typeof window !== "undefined") {
						window.location.href = "/login";
					}
				}
			} finally {
				release();
			}
		} else {
			// Wait for the mutex to be released and retry
			await mutex.waitForUnlock();
			result = await baseQuery(args, api, extraOptions);
		}
	}

	return result;
};

export const api = createApi({
	baseQuery: baseQueryWithReauth,
	reducerPath: "api",
	tagTypes: ["user", "levels", "sections"],
	endpoints: () => ({}),
});
