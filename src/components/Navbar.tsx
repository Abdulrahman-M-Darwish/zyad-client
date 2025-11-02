"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/redux";
import { setUser } from "@/store/features/userSlice";
import { Sun, Moon, LogOut, ChevronDown } from "lucide-react";
import { useSignoutMutation } from "@/store/api/auth";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";

export const Navbar: React.FC = () => {
  const [logout] = useSignoutMutation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.user);
  const router = useRouter();
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return (
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // ignore in SSR
    }
  }, [isDark]);

  const handleLogout = async () => {
    // clear user from redux store
    await logout().unwrap();
    dispatch(setUser(null));
    router.replace("/login");
  };
  if (!user) return null;
  return (
    <header className="sticky top-0 z-40 border-b bg-background shadow-primary/5 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {user.role === "admin" && <SidebarTrigger />}
        <div className="flex mr-auto items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-3 text-inherit no-underline">
            <span className="font-semibold text-sm">Zyad</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto flex items-center gap-3 rounded-md px-2 py-1"
                aria-label="Open user menu">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-primary flex items-center justify-center">
                  <span className="font-semibold text-sm text-primary-foreground">
                    {user.name.charAt(0)}
                  </span>
                </div>

                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>

                <ChevronDown className="size-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setIsDark((s) => !s)}
            className={"p-2"}
            title={isDark ? "Switch to light" : "Switch to dark"}>
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
