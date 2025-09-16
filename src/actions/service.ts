"use server";

import { prisma } from "@/lib/prisma";
import { createServiceSchema, serviceSchema, updateServiceSchema } from "@/zod-schemas/prisma-schemas";

// Buscar todos os serviços
export async function getServices() {
	const services = await prisma.service.findMany({
		include: {
			service_category: true,
		},
	});
	return services;
}

// Buscar serviço por ID
export async function getServiceById(id: string) {
	if (!id) return null;
	const service = await prisma.service.findUnique({ where: { id }, include: { service_category: true } });
	return service;
}

// Criar novo serviço
export async function createService(data: unknown) {
	const parsed = createServiceSchema.safeParse(data);
	if (!parsed.success) {
		console.log("Dados recebidos:", JSON.stringify(data, null, 2));
		console.log("Erros de validação:", JSON.stringify(parsed.error.issues, null, 2));
		throw new Error(
			`Dados inválidos para criação de serviço: ${parsed.error.issues.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ")}`,
		);
	}

	// Criar dados compatíveis com o Prisma
	const { name, description, price, duration, is_active, category_id } = parsed.data;
	const service = await prisma.service.create({
		data: {
			name,
			description,
			price,
			duration,
			is_active,
			category_id,
			updated_at: new Date(),
		},
		include: {
			service_category: true,
		},
	});
	return service;
}

// Atualizar serviço existente
export async function updateService(id: string, data: unknown) {
	if (!id) return null;
	const parsed = updateServiceSchema.safeParse(data);
	if (!parsed.success) {
		console.log("Dados recebidos:", JSON.stringify(data, null, 2));
		console.log("Erros de validação:", JSON.stringify(parsed.error.issues, null, 2));
		throw new Error(
			`Dados inválidos para atualização de serviço: ${parsed.error.issues.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ")}`,
		);
	}

	const updateData: any = { ...parsed.data, updated_at: new Date() };
	const service = await prisma.service.update({
		where: { id },
		data: updateData,
		include: {
			service_category: true,
		},
	});
	return service;
}

// Deletar serviço
export async function deleteService(id: string) {
	if (!id) return null;
	const service = await prisma.service.delete({ where: { id } });
	return service;
}

// Buscar serviços por categoria
export async function getServicesByCategory(categoryId: string) {
	if (!categoryId) return [];
	const services = await prisma.service.findMany({
		where: { category_id: categoryId },
		include: {
			service_category: true,
		},
	});
	return services;
}

// Buscar apenas serviços ativos
export async function getActiveServices() {
	const services = await prisma.service.findMany({
		where: { is_active: true },
		include: {
			service_category: true,
		},
	});
	return services;
}
