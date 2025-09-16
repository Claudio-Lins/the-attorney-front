'use client';

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export function NavUser() {
	const { isMobile } = useSidebar();
	const { data: session } = useSession();

	if (!session || !session.user) {
		return null; // Não renderiza nada se não houver sessão
	}

	const { user } = session;
	const userInitials = user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={user.image || undefined} alt={user.name || ""} />
								<AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="text-muted-foreground truncate text-xs">
									{user.email}
								</span>
							</div>
							<IconDotsVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={user.image || undefined} alt={user.name || ""} />
									<AvatarFallback className="rounded-lg">{userInitials}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="text-muted-foreground truncate text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                            <IconLogout className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
