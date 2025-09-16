'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useScrollHeader } from "@/hooks/use-scroll-header";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userDataStore";
import logoTheAttorneyNeg from "@assets/the-attorney-logo_neg.svg";
import logoTheAttorneyPos from "@assets/the-attorney-logo_pos.svg";
import { LogOut, Settings, User, UserRoundIcon } from "lucide-react";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "../dashboard/dashboard-header";
import { Button } from "../ui/button";
import LocaleSwitcher from "./LocaleSwitcher";

interface HeaderProps {
	clientRole: "ADMIN" | "USER" | null;
}

export default function Header({ clientRole }: HeaderProps) {
	const t = useTranslations("HomeData");
	const locale = useLocale();
	const isScrolled = useScrollHeader();
	const router = useRouter();
	const { clearUserData, firstName, lastName, email, photoUrl } = useUserStore();
	const navigation = t.raw("headerData.navigation");
  const logo = t.raw("headerData.logo");
  const session = useSession();


	function signIn() {
		clearUserData();
		router.push(`/${locale}/sign-in`);
	}

	async function handleSignOut() {
		clearUserData();
		await nextAuthSignOut({ callbackUrl: `/${locale}` });
	}

	const userInitials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();

	return (
		<div
			className={cn(
				"fixed z-50 h-20 w-full md:h-[100px] px-6 md:px-0 transition-all duration-500 ease-in-out",
				!isScrolled ? "bg-transparent" : "bg-white/75 backdrop-blur-sm shadow-md",
			)}
		>
			<div className="mx-auto flex h-full items-center justify-between md:container w-full">
				<div className="flex items-center gap-4">
					<Link href={`/${locale}`} className="flex items-center gap-2">
						<Image
							src={isScrolled ? logoTheAttorneyPos : logoTheAttorneyNeg}
							alt={logo.logoText || ""}
							width={isScrolled ? Number(logo.imagePos.width) : Number(logo.imageNeg.width)}
							height={isScrolled ? Number(logo.imagePos.height) : Number(logo.imageNeg.height)}
							className={cn("size-14 object-contain")}
						/>
						<h1 className={cn("text-xl font-medium uppercase font-serif", !isScrolled ? "text-white" : "text-black")}>
							{logo.logoText}
						</h1>
					</Link>
				</div>

				<div className="flex items-center gap-4">
					{navigation.map((item: any) => (
						<Link
							href={
								item?.isAdmin
									? `/${locale}${item.href}`
									: item?.isClient
										? `/${locale}${item.href}`
										: item?.anchor || ""
							}
							key={item.id}
							className={cn(
								"cursor-pointer",
								item.isAdmin && clientRole !== "ADMIN" && "hidden",
								item.isAdmin && clientRole === "ADMIN" && "block",
								item.isClient && clientRole !== "USER" && "hidden",
								item.isClient && clientRole === "USER" && "block",
							)}
						>
							<p className={cn("hidden md:block font-bold uppercase", !isScrolled ? "text-white" : "text-black")}>
								{item.text}
							</p>
						</Link>
					))}
				</div>

				<div className="flex items-center gap-4">
					<Link href={`/${locale}`} className="cursor-pointer">
						<LocaleSwitcher />
					</Link>
					{clientRole ? (
           <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.data?.user?.image || undefined} alt={session.data?.user?.name || ""} />
                  <AvatarFallback>
                    {session.data?.user?.name?.charAt(0) || session.data?.user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.data?.user?.name || "Usuário"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.data?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => handleSignOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
                    ) : (
                        <Button variant="link" className="cursor-pointer" onClick={signIn}>
                            <UserRoundIcon
                                size={42}
                                className={cn(
                                    "transition-colors hover:text-accent cursor-pointer",
                                    !isScrolled ? "text-accent" : "text-accent-foreground",
                                )}
                            />
                        </Button>
                    )}
				</div>
			</div>
		</div>
	);
}
