import { User } from "@/types";
import { api, tokenManager } from "../api";

export interface LoginPayload {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}

export interface SignupPayload {
	name: string;
	email: string;
	password: string;
	age: number;
	gender: string;
	phonenumber: string;
}

export interface VerifyPayload extends SignupPayload {
	otp: string;
}

export interface ChangePasswordPayload {
	email: string;
	newPassword: string;
}

export interface RefreshTokenResponse {
	accessToken: string;
	user: User;
}

const auth = api.injectEndpoints({
	endpoints: (build) => ({
		signin: build.mutation<LoginResponse, LoginPayload>({
			query: (payload) => ({
				url: "/auth/signin",
				method: "POST",
				body: payload,
			}),
			async onQueryStarted(arg, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					// Store tokens after successful login
					tokenManager.setTokens(data.accessToken, data.refreshToken);
				} catch (error) {
					// Handle error
					console.error("Login failed:", error);
				}
			},
			invalidatesTags: ["user"],
		}),
		signup: build.mutation<{ message: string }, SignupPayload>({
			query: (payload) => ({
				url: "/auth/signup",
				method: "POST",
				body: payload,
			}),
		}),
		verify: build.mutation<{ message: string }, VerifyPayload>({
			query: (payload) => ({
				url: "/auth/verify-registration",
				method: "POST",
				body: payload,
			}),
		}),
		forgotPassword: build.mutation<{ message: string }, { email: string }>({
			query: (payload) => ({
				url: "/auth/forgot-password",
				method: "POST",
				body: payload,
			}),
		}),
		verifyForgotPassword: build.mutation<
			{ message: string },
			{ email: string; otp: string }
		>({
			query: (payload) => ({
				url: "/auth/verify-forgot-password",
				method: "POST",
				body: payload,
			}),
		}),
		changePassword: build.mutation<{ message: string }, ChangePasswordPayload>({
			query: (payload) => ({
				url: "/auth/change-password",
				method: "POST",
				body: payload,
			}),
		}),
		refresh: build.mutation<RefreshTokenResponse, { refreshToken: string }>({
			query: (payload) => ({
				url: "/auth/refresh",
				method: "POST",
				body: payload,
			}),
			async onQueryStarted(arg, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					// Update access token
					tokenManager.setTokens(data.accessToken, arg.refreshToken);
				} catch (error) {
					// Clear tokens on refresh failure
					tokenManager.clearTokens();
				}
			},
		}),
		signout: build.mutation<void, void>({
			query: () => ({
				url: "/auth/signout",
				method: "POST",
			}),
			async onQueryStarted(arg, { queryFulfilled }) {
				// Clear tokens immediately on signout
				tokenManager.clearTokens();
				try {
					await queryFulfilled;
				} catch (error) {
					// Ignore errors on signout
				}
			},
			invalidatesTags: ["user"],
		}),
	}),
});

export const {
	useSigninMutation,
	useSignupMutation,
	useSignoutMutation,
	useVerifyMutation,
	useForgotPasswordMutation,
	useVerifyForgotPasswordMutation,
	useChangePasswordMutation,
	useRefreshMutation,
} = auth;
