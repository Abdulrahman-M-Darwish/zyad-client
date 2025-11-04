"use client";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { SidebarInset } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="gap-0 flex bg-background w-full" style={{ height: `` }}>
			<AdminSidebar />
			<SidebarInset>
				<Navbar />
				<main className="p-4">{children}</main>
			</SidebarInset>
		</div>
	);
};

export default AdminLayout;
