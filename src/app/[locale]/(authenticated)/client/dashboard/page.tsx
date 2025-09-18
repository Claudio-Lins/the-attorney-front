import { getAuthenticatedClient } from "@/actions/client";
import { ClientServiceList } from "@/components/client/client-service-list";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

interface ClientDashboardPageProps {}

export default async function ClientDashboardPage({}: ClientDashboardPageProps) {
	const session = await auth();

	console.log("session", session);

	if (!session?.user) {
		return notFound();
	}

	// Usa a action correta que busca o cliente a partir da sessão do usuário logado.
	const client = await getAuthenticatedClient();

	// Se não houver um cliente vinculado a este usuário, ou se o usuário não for um cliente normal, não mostra a página.
	if (!client || session.user.role !== "USER") {
		return notFound();
	}

	return (
		<div className="flex flex-col w-full min-h-full">
			<ClientServiceList id={client.id} isAdmin={false} />
		</div>
	);
}
