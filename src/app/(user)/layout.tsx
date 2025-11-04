import { SidebarInset } from "@/components";
import { Navbar } from "@/components/Navbar";
import React from "react";

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarInset>
			<Navbar />
			{children}
		</SidebarInset>
	);
};

export default UsersLayout;
