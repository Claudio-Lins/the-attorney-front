"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { client } from "@/generated/prisma/client";
import { ClientCard } from "./client-card";
import { ClientServiceList } from "./client-service-list";

interface ClientTabsProps {
	clientId: string;
	clientData: client;
}

export function ClientTabs({ clientId, clientData }: ClientTabsProps) {
	return (
		<Tabs defaultValue="services" className="w-full">
			<TabsList>
				<TabsTrigger value="services">Serviços vinculados</TabsTrigger>
				<TabsTrigger value="client-data">Dados do cliente</TabsTrigger>
			</TabsList>
			<TabsContent value="services">
				<ClientServiceList id={clientId} isAdmin={true} />
			</TabsContent>
			<TabsContent value="client-data">
				<ClientCard clientData={clientData} />
			</TabsContent>
		</Tabs>
	);
}
