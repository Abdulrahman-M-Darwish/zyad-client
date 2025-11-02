"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, Layers, FileText, Users } from "lucide-react";

const items = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin/levels", label: "Levels", icon: Layers },
  { href: "/admin/sections", label: "Sections", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
];

function SidebarBrand() {
  const { open } = useSidebar();
  return (
    <SidebarHeader>
      <div className="flex items-center gap-3 px-2">
        <div>
          <div className="text-sm font-semibold">{open ? "Zyad" : "Z"}</div>
          {open && (
            <div className="text-xs text-muted-foreground">Control panel</div>
          )}
        </div>
      </div>
    </SidebarHeader>
  );
}

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname() || "/";
  return (
    <Sidebar
      side="left"
      collapsible="icon"
      className="shadow-lg shadow-primary/10">
      <SidebarBrand />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((it) => (
              <SidebarMenuItem key={it.href}>
                <SidebarMenuButton asChild isActive={pathname === it.href}>
                  <Link href={it.href} className="flex items-center gap-2">
                    <it.icon className="size-4" />
                    <span>{it.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="m-0" />
    </Sidebar>
  );
};

export default AdminSidebar;
