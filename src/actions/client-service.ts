"use server";

import { prisma } from "@/lib/prisma";
import { clientServiceSchema, createClientServiceSchema, updateClientServiceSchema } from "@/zod-schemas/prisma-schemas";
import { revalidatePath } from "next/cache";

// Listar todos os vínculos cliente-serviço
export async function getClientServices() {
	const clientServices = await prisma.client_service.findMany({
		include: {
			client: true,
			service: true,
		},
	});
	return clientServices;
}

// Buscar vínculo por ID
export async function getClientServiceById(id: string) {
	if (!id) return null;
	const clientService = await prisma.client_service.findUnique({
		where: { id },
		include: {
			client: true,
			service: true,
		},
	});
	return clientService;
}

// Criar vínculo cliente-serviço
export async function createClientService(data: unknown) {
	const parsed = createClientServiceSchema.safeParse(data);
	if (!parsed.success) {
		console.log("Dados recebidos:", JSON.stringify(data, null, 2));
		console.log("Erros de validação:", JSON.stringify(parsed.error.issues, null, 2));
		throw new Error(
			`Dados inválidos para criação de vínculo cliente-serviço: ${parsed.error.issues.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ")}`,
		);
	}

	// Gerar osNumber: clientId + '-' + número sequencial (ex: FV773604-001)
	const { client_id } = parsed.data;
	const client = await prisma.client.findUnique({ where: { id: client_id } });
	if (!client) throw new Error("Cliente não encontrado para gerar OSNumber");

	// Contar quantos vínculos já existem para esse cliente
	const count = await prisma.client_service.count({ where: { client_id } });
	const nextNumber = (count + 1).toString().padStart(3, "0");
	const osNumber = `${client.client_id}-${nextNumber}`;

	const clientService = await prisma.client_service.create({
		data: {
			...parsed.data,
			os_number: osNumber,
			updated_at: new Date(),
		},
		include: {
			client: true,
			service: true,
		},
	});
	revalidatePath("/[locale]/(authenticated)/admin/clients", "page");
	return clientService;
}

// Atualizar vínculo cliente-serviço
export async function updateClientService(id: string, data: unknown) {
	if (!id) return null;

	// ✅ Remove o campo 'id' dos dados se existir (já temos o id como parâmetro)
	const cleanData =
		typeof data === "object" && data !== null
			? Object.fromEntries(Object.entries(data as any).filter(([key]) => key !== "id"))
			: data;

	const parsed = updateClientServiceSchema.safeParse(cleanData);
	if (!parsed.success) {
		console.log("ID recebido:", id);
		console.log("Dados recebidos:", JSON.stringify(cleanData, null, 2));
		console.log("Erros de validação:", JSON.stringify(parsed.error.issues, null, 2));
		throw new Error(
			`Dados inválidos para atualização de vínculo cliente-serviço: ${parsed.error.issues.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ")}`,
		);
	}

	const updateData: any = { ...parsed.data, updated_at: new Date() };
	const clientService = await prisma.client_service.update({
		where: { id },
		data: updateData,
		include: {
			client: true,
			service: true,
		},
	});
	revalidatePath("/[locale]/(authenticated)/admin/clients", "page");
	return clientService;
}

// Deletar vínculo cliente-serviço
export async function deleteClientService(id: string) {
	if (!id) return null;
	const clientService = await prisma.client_service.delete({ where: { id } });
	return clientService;
}

// Listar todos os serviços de um cliente específico
export async function getServicesByClient(clientId: string) {
	if (!clientId) return [];
	const clientServices = await prisma.client_service.findMany({
		where: { client_id: clientId },
		include: { service: true, client: true },
	});

	return clientServices;
}
