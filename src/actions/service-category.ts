"use server";

import { prisma } from "@/lib/prisma";
import { createServiceCategorySchema, serviceCategorySchema } from "@/zod-schemas/prisma-schemas";

// Listar todas as categorias
export async function getServiceCategories() {
	const categories = await prisma.service_category.findMany();
	return categories;
}

// Buscar categoria por ID
export async function getServiceCategoryById(id: string) {
	if (!id) return null;
	const category = await prisma.service_category.findUnique({ where: { id } });
	return category;
}

// Criar nova categoria
export async function createServiceCategory(data: unknown) {
	const parsed = createServiceCategorySchema.safeParse(data);
	if (!parsed.success) {
		console.log("Dados recebidos:", JSON.stringify(data, null, 2));
		console.log("Erros de validação:", JSON.stringify(parsed.error.issues, null, 2));
		throw new Error(
			`Dados inválidos para criação de categoria: ${parsed.error.issues.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ")}`,
		);
	}

	// Omitir campos que são gerados automaticamente pelo Prisma
	const { name, description } = parsed.data;
	const category = await prisma.service_category.create({
		data: {
			name,
			description,
			updatedAt: new Date(),
		},
	});
	return category;
}

// Atualizar categoria existente
export async function updateServiceCategory(id: string, data: unknown) {
	if (!id) return null;
	const parsed = createServiceCategorySchema.partial().safeParse(data);
	if (!parsed.success) {
		console.log("Dados recebidos:", JSON.stringify(data, null, 2));
		console.log("Erros de validação:", JSON.stringify(parsed.error.issues, null, 2));
		throw new Error(
			`Dados inválidos para atualização de categoria: ${parsed.error.issues.map((err: any) => `${err.path.join(".")}: ${err.message}`).join(", ")}`,
		);
	}

	const updateData: any = { ...parsed.data, updatedAt: new Date() };
	const category = await prisma.service_category.update({ where: { id }, data: updateData });
	return category;
}

// Deletar categoria
export async function deleteServiceCategory(id: string) {
	if (!id) return null;
	const category = await prisma.service_category.delete({ where: { id } });
	return category;
}
