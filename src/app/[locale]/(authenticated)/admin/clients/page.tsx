"use client";

import { getAllClients } from "@/actions/client";
import { CreateClientDialog } from "@/components/client/create-client-dialog";
import type { ClientSchema } from "@/zod-schemas/client-schema";
import { useCallback, useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

function processClientData(clients: any[]): ClientSchema[] {
	return clients.map((client) => {
		let filiation = client.filiation;
		if (typeof filiation === "string") {
			try {
				filiation = JSON.parse(filiation);
			} catch (e) {
				filiation = null;
			}
		}
		if (
			!filiation ||
			typeof filiation !== "object" ||
			Array.isArray(filiation) ||
			Object.keys(filiation).some((key) => key !== "father" && key !== "mother")
		) {
			filiation = null;
		}
		return {
			...client,
			filiation,
		};
	});
}

export default function ClientsPage() {
	const [data, setData] = useState<ClientSchema[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadClients = useCallback(async function loadClients() {
		try {
			setIsLoading(true);
			const clients = await getAllClients();
			const processedData = processClientData(clients);
			setData(processedData);
		} catch (error) {
			console.error("Erro ao carregar clientes:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadClients();
	}, [loadClients]);

	function handleClientCreated() {
		loadClients(); // ✅ Recarrega a lista quando um cliente é criado
	}

	if (isLoading) {
		return (
			<div className="container mx-auto max-h-full overflow-y-hidden space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-slate-600">Carregando clientes...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-h-full overflow-y-hidden space-y-6">
			{/* Header com botão de criar cliente */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
					<p className="text-slate-600 mt-1">Gerencie todos os clientes do escritório</p>
				</div>
				<CreateClientDialog onClientCreated={handleClientCreated} />
			</div>

			{/* Tabela de clientes */}
			<DataTable columns={columns} data={data} />
		</div>
	);
}
