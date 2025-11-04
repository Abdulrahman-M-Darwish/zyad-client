"use client";
import StoreProvider from "@/store/redux";
import React from "react";
import { Protected } from "./Protected";
import { SidebarProvider } from "./ui/sidebar";

type Props = {
	children: React.ReactNode;
};

export const Providers: React.FC<Props> = ({ children }) => {
	return (
		<StoreProvider>
			<Protected>
				<SidebarProvider defaultOpen>{children}</SidebarProvider>
			</Protected>
		</StoreProvider>
	);
};
