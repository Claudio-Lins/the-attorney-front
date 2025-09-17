import { getClientByClientId } from "@/actions/client";

import { ClientTabs } from "@/components/client/client-tabs";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

// Configuração otimizada para produção
export const dynamic = "force-dynamic"; // Necessário para rotas dinâmicas com dados do banco
export const runtime = "nodejs";

export default async function ClientPage({
	params,
}: {
	params: Promise<{ clientId: string }>;
}) {
	try {
		const resolvedParams = await params;
		const clientId = resolvedParams.clientId;

		// Validar clientId antes de buscar no banco
		if (!clientId || clientId.trim().length === 0) {
			console.error("ClientId inválido:", clientId);
			return notFound();
		}

		const locale = await getLocale();

		console.log("Buscando cliente com ID:", clientId);
		const client = await getClientByClientId(clientId);

		if (!client) {
			console.log("Cliente não encontrado:", clientId);
			return notFound();
		}

		console.log("Cliente encontrado:", client.client_id);

		return (
			<div className="flex flex-col gap-4">
				<ClientTabs clientId={client.id} clientData={client} />
				{/* <ClientCard clientData={client} /> */}
				{/* <ClientServiceList id={client.id} isAdmin={true} /> */}
			</div>
		);
	} catch (error) {
		console.error("Erro na página do cliente:", JSON.stringify(error, null, 2));
		console.error("Params recebidos:", params);

		// Em caso de erro, mostrar página de erro
		throw new Error(
			`Erro ao carregar página do cliente: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
		);
	}
}
