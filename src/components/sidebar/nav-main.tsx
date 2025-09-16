"use client";

import { type Icon } from "@tabler/icons-react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
	}[];
}) {
	const pathname = usePathname();
	const locale = useLocale();

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem
							key={item.title}
							className={cn(
								pathname === `/${locale}${item.url}` &&
									"bg-gradient-to-r from-blue-900 to-blue-600 rounded-md text-white",
								"hover:bg-blue-900/10 hover:text-blue-900",
							)}
						>
							<SidebarMenuButton tooltip={item.title} asChild>
								<Link
									href={`/${locale}${item.url}`}
									className={cn(
										pathname === `/${locale}${item.url}` &&
											"bg-gradient-to-r from-blue-900 to-blue-600 rounded-md text-white",
										"hover:bg-gradient-to-r hover:from-blue-900 hover:to-blue-600 hover:text-white",
									)}
								>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
