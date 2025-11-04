import { SidebarInset } from "@/components";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return <SidebarInset>{children}</SidebarInset>;
};

export default AuthLayout;
