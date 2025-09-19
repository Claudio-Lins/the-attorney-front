import { getClientRoleByEmail } from "@/actions/client";
import { ClientDataVerifier } from "@/components/client/client-data-verifier";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "@/lib/user-utils";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function AuthenticatedLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	// Garante que o locale é válido
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Ativa o rendering estático
	setRequestLocale(locale);

	// Obter role do usuário
	const user = await getCurrentUser();
	const clientRole = await getClientRoleByEmail(user?.email ?? "");

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-col p-4 min-h-dvh w-full bg-background overflow-y-hidden">
					<ClientDataVerifier clientRole={clientRole} />
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
