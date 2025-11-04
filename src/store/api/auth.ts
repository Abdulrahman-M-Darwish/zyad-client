import { User } from "@/types";
import { api } from "../api";

export interface LoginPayload {
	email: string;
	password: string;
}

export interface SignupPayload {
	name: string;
	email: string;
	password: string;
	age: number;
	phonenumber: string;
}

export interface VerifyPayload extends SignupPayload {
	otp: string;
}

export interface ChangePasswordPayload {
	email: string;
	newPassword: string;
}

const auth = api.injectEndpoints({
	endpoints: (build) => ({
		signin: build.mutation<User, LoginPayload>({
			query: (payload) => ({
				url: "/auth/signin",
				method: "POST",
				body: payload,
			}),
		}),
		signup: build.mutation<User, SignupPayload>({
			query: (payload) => ({
				url: "/auth/signup",
				method: "POST",
				body: payload,
			}),
		}),
		verify: build.mutation<void, VerifyPayload>({
			query: (payload) => ({
				url: "/auth/verify-registration",
				method: "POST",
				body: payload,
			}),
		}),
		forgotPassword: build.mutation<void, { email: string }>({
			query: (payload) => ({
				url: "/auth/forgot-password",
				method: "POST",
				body: payload,
			}),
		}),
		verifyForgotPassword: build.mutation<void, { email: string; otp: string }>({
			query: (payload) => ({
				url: "/auth/verify-forgot-password",
				method: "POST",
				body: payload,
			}),
		}),
		changePassword: build.mutation<void, ChangePasswordPayload>({
			query: (payload) => ({
				url: "/auth/change-password",
				method: "POST",
				body: payload,
			}),
		}),
		signout: build.mutation<void, void>({
			query: () => ({
				url: "/auth/signout",
				method: "POST",
			}),
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
} = auth;
