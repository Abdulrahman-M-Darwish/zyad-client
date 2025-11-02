"use client";
import StoreProvider from "@/store/redux";
import React from "react";
import { Protected } from "./Protected";

type Props = {
	children: React.ReactNode;
};

export const Providers: React.FC<Props> = ({ children }) => {
	return (
		<StoreProvider>
			<Protected>{children}</Protected>
		</StoreProvider>
	);
};
