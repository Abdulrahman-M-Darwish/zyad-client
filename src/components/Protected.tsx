"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { setUser } from "@/store/features/userSlice";
import { useLazyGetMeQuery } from "@/store/api/user";
import { PUBLIC_PATHS } from "@/lib/constants";
import { useCookiesNext } from "cookies-next";

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
  const { setCookie, deleteCookie } = useCookiesNext();
  useEffect(() => {
    setCookie("userRole", user?.role || "");
    if (user) return;
    let mounted = true;
    const checkAuth = async () => {
      try {
        const user = await getMe().unwrap();
        if (!mounted) return;
        if (user) {
          setCookie("userRole", user.role);
          dispatch(setUser(user));
        } else {
          dispatch(setUser(null));
          deleteCookie("userRole");
          const pathname = window.location.pathname;
          if (!isPublicPath(pathname)) router.replace("/login");
        }
      } catch {
        dispatch(setUser(null));
        deleteCookie("userRole");
        const pathname = window.location.pathname;
        if (!isPublicPath(pathname)) router.replace("/login");
      }
    };
    checkAuth();
    return () => {
      mounted = false;
    };
  }, [deleteCookie, dispatch, getMe, router, setCookie, user]);
  return children;
};
