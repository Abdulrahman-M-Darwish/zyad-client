"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { setUser } from "@/store/features/userSlice";
import { useLazyGetMeQuery } from "@/store/api/user";
import { PUBLIC_PATHS } from "@/lib/constants";
import { tokenManager } from "@/store/api";

type Props = {
	children?: React.ReactNode;
};

function isPublicPath(pathname: string) {
	if (!pathname) return false;
	return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p));
}

export const Protected: React.FC<Props> = ({ children }) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [getMe] = useLazyGetMeQuery();
	const user = useAppSelector((state) => state.user.user);

	useEffect(() => {
		// If user already loaded, skip
		if (user) return;

		let mounted = true;

		const checkAuth = async () => {
			// Check if we have an access token
			const accessToken = tokenManager.getAccessToken();
			const pathname = window.location.pathname;

			// If no token and not on public path, redirect to login
			if (!accessToken) {
				dispatch(setUser(null));
				if (!isPublicPath(pathname)) {
					router.replace("/login");
				}
				return;
			}

			// Try to fetch user with the token
			try {
				const userData = await getMe().unwrap();
				if (!mounted) return;

				if (userData) {
					dispatch(setUser(userData));
				} else {
					// User data not found, clear tokens
					tokenManager.clearTokens();
					dispatch(setUser(null));
					if (!isPublicPath(pathname)) {
						router.replace("/login");
					}
				}
			} catch (error) {
				// Token invalid or expired, baseQuery will handle refresh
				// If refresh fails, it will clear tokens and redirect
				if (!mounted) return;
				dispatch(setUser(null));
				tokenManager.clearTokens();
				if (!isPublicPath(pathname)) {
					router.replace("/login");
				}
			}
		};

		checkAuth();

		return () => {
			mounted = false;
		};
	}, [dispatch, getMe, router, user]);

	return children;
};
