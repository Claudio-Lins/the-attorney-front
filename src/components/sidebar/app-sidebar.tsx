'use client';

import { IconDashboard, IconFileDescription, IconUser, IconUsers } from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

import logoTheAttorney from "@assets/the-attorney-logo.svg";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";

const data = {
	navAdmin: [
		{
			title: "Dashboard",
			url: "/admin/dashboard",
			icon: IconDashboard,
		},
		{
			title: "Clientes",
			url: "/admin/clients",
			icon: IconUsers,
		},
		{
			title: "Serviços",
			url: "/admin/services",
			icon: IconFileDescription,
		},
	],
	navClient: [
		{
			title: "Dashboard",
			url: "/client/dashboard",
			icon: IconDashboard,
		},
		{
			title: "Perfil",
			url: "/client/profile",
			icon: IconUser,
		},
		{
			title: "Procuração",
			url: "/client/power-attorney",
			icon: IconFileDescription,
		},
		{
			title: "Documentos",
			url: "/client/documents",
			icon: IconFileDescription,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const locale = useLocale();
	const { data: session } = useSession();
	const userRole = session?.user?.role;

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
							<Link prefetch href={`/${locale}`} className="flex flex-col items-center gap-2 justify-center h-auto">
								<Image src={logoTheAttorney} alt="The Attorney" width={50} height={50} />
								<span className="text-xl font-bold text-blue-800">The Attorney</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{userRole === "ADMIN" && <NavMain items={data.navAdmin} />}
				{userRole === "USER" && <NavMain items={data.navClient} />}
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
