"use client";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider defaultOpen>
			<div className="gap-0 flex bg-background w-full" style={{ height: `` }}>
				<AdminSidebar />
				<SidebarInset>
					<Navbar />
					<main className="p-4">{children}</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};

export default AdminLayout;
