"use client";

import LocaleSwitcher from "@/components/locale/LocaleSwitcher";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function SiteHeader() {
	const pathname = usePathname();
	const { data: session } = useSession();

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<div className="flex items-center justify-between gap-2 w-full">
					<div className="flex items-center gap-2 w-full">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
						<span className="text-base font-bold">{session?.user?.name}</span>
					</div>
					<LocaleSwitcher />
				</div>
			</div>
		</header>
	);
}
