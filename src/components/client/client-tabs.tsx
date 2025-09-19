"use client";

import { ClientCard } from "@/components/client/client-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { address, client } from "@/generated/prisma/client";
import { ClientServiceList } from "./client-service-list";

import { PowerAttorneyTab } from "./power-attorney-tab";

interface ClientTabsProps {
	clientId: string;
	clientData: client & { address?: address[] };
}

export function ClientTabs({ clientId, clientData }: ClientTabsProps) {
	return (
		<Tabs defaultValue="client-data" className="w-full">
			<TabsList>
				<TabsTrigger value="client-data">Dados do cliente</TabsTrigger>
				<TabsTrigger value="services">Serviços vinculados</TabsTrigger>
				<TabsTrigger value="power-attorney">Procurações</TabsTrigger>
			</TabsList>
			<TabsContent value="client-data">
				<ClientCard clientData={clientData} />
			</TabsContent>
			<TabsContent value="services">
				<ClientServiceList id={clientId} isAdmin={true} />
			</TabsContent>
			<TabsContent value="power-attorney">
				<PowerAttorneyTab clientData={clientData} />
			</TabsContent>
		</Tabs>
	);
}
