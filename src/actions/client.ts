"use server";

import { type EditClientSchema } from "@/zod-schemas/client-schema";

import { createClientService, getServicesByClient } from "@/actions/client-service";
import { type address, type client } from "@/generated/prisma/client";
import { auth } from "@/lib/auth"; // Usar o auth do NextAuth
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Esta função foi removida pois sua lógica é insegura e foi substituída pelo fluxo de cadastro
// em src/actions/sign-up-actions.ts, que cria um `User` e o vincula ao `client`.
// async function updateClientCredentials(...) { ... }

export async function getClientRoleByEmail(email: string): Promise<"ADMIN" | "USER" | null> {
	try {
		// O Role agora está no modelo User, não no Client.
		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				role: true,
				id: true,
				email: true,
			},
		});
		if (!user) {
			return null;
		}
		return user.role;
	} catch (error) {
		console.error("Erro ao buscar role do usuário:", JSON.stringify(error, null, 2));
		return null;
	}
}

export async function getAuthenticatedClient(): Promise<(client & { address: address[] }) | null> {
	const session = await auth();

	if (!session?.user?.id) {
		return null;
	}
	try {
		// A forma correta de buscar o cliente é pelo userId vinculado à sessão.
		const client = await prisma.client.findUnique({
			where: { userId: session.user.id },
			include: {
				address: true,
			},
		});
		return client;
	} catch (error) {
		console.error("Erro ao buscar cliente autenticado:", error);
		return null;
	}
}

export async function getClientByClientId(clientId: string): Promise<(client & { address: address[] }) | null> {
	try {
		if (!clientId || typeof clientId !== "string" || clientId.trim().length === 0) {
			return null;
		}

		const sanitizedClientId = clientId.trim();

		const client = await prisma.client.findUnique({
			where: { client_id: sanitizedClientId },
			include: {
				address: true,
			},
		});

		return client;
	} catch (error) {
		console.error("getClientByClientId: Erro ao buscar cliente:", error);
		return null;
	}
}

export async function getAllClients(): Promise<(client & { address: address[] })[]> {
	try {
		const clients = await prisma.client.findMany({
			include: {
				address: true,
			},
		});
		return clients;
	} catch (error) {
		console.error("Erro ao buscar todos os clientes:", error);
		return [];
	}
}

export async function updateClient(
	clientId: string,
	data: EditClientSchema & { address?: any; photoUrl?: string },
): Promise<client | null> {
	try {
		const updateData: any = {
			first_name: data.firstName,
			last_name: data.lastName,
			email: data.email,
			passport_number: data.passportNumber,
			passport_expiry: data.passportExpiry,
			nationality: data.nationality,
			place_of_birth: data.placeOfBirth,
			country_of_birth: data.countryOfBirth,
			passport_issue_date: data.passportIssueDate,
			date_of_birth: data.dateOfBirth,
			gender: data.gender,
			marital_status: data.maritalStatus,
			filiation: {
				father: data.fatherName || "",
				mother: data.motherName || "",
			},
			phone: data.phone,
		};

		if (data.photoUrl !== undefined) {
			updateData.photo_url = data.photoUrl;
		}

		const client = await prisma.client.update({
			where: { client_id: clientId },
			data: updateData,
		});

		if (data.address) {
			const clientDb = await prisma.client.findUnique({
				where: { client_id: clientId },
				include: { address: true },
			});
			if (clientDb) {
				const addressExists = clientDb.address && clientDb.address.length > 0;
				if (addressExists) {
					await prisma.address.update({
						where: { id: clientDb.address[0].id },
						data: {
							street: data.address.street,
							number: data.address.number,
							complement: data.address.complement,
							neighborhood: data.address.neighborhood,
							city: data.address.city,
							state: data.address.state,
							zip_code: data.address.zipCode,
							country: data.address.country,
						},
					});
				} else {
					await prisma.address.create({
						data: {
							street: data.address.street,
							number: data.address.number,
							complement: data.address.complement,
							neighborhood: data.address.neighborhood,
							city: data.address.city,
							state: data.address.state,
							zip_code: data.address.zipCode,
							country: data.address.country,
							client_id: clientDb.id,
							updated_at: new Date(),
						},
					});
				}
			}
		}
		return client;
	} catch (error) {
		console.error("Erro ao atualizar cliente:", JSON.stringify(error, null, 2));
		revalidatePath("/client/dashboard", "page");
		return null;
	}
}

export async function getClientServices(clientId: string) {
	const clientServices = await getServicesByClient(clientId);
	return clientServices;
}

export async function createClientServiceAction(clientId: string, serviceId: string) {
	await createClientService({
		client_id: clientId,
		service_id: serviceId,
		status: "PENDING",
		priority: "MEDIUM",
	});
}

export async function getClientIdByClientId(clientId: string): Promise<string | null> {
	if (!clientId) return null;
	const client = await prisma.client.findUnique({ where: { client_id: clientId } });
	return client?.id || null;
}

export async function createClient(data: {
	firstName: string;
	lastName: string;
	passportNumber: string;
	clientId?: string;
	email?: string;
	phone?: string;
	nationality?: string;
	dateOfBirth?: Date;
	gender?: string;
}): Promise<client | null> {
	try {
		let generatedClientId = data.clientId;
		if (!generatedClientId) {
			const prefix = "CL";
			const randomNumber = Math.floor(100000 + Math.random() * 900000);
			generatedClientId = `${prefix}${randomNumber}`;
		}

		const existingClientId = await prisma.client.findUnique({
			where: { client_id: generatedClientId },
		});

		if (existingClientId) {
			throw new Error(`Client ID ${generatedClientId} já existe. Use um ID diferente.`);
		}

		const existingPassport = await prisma.client.findUnique({
			where: { passport_number: data.passportNumber },
		});

		if (existingPassport) {
			throw new Error(`Número de passaporte ${data.passportNumber} já está cadastrado.`);
		}

		if (data.email) {
			const existingEmail = await prisma.client.findUnique({
				where: { email: data.email },
			});

			if (existingEmail) {
				throw new Error(`Email ${data.email} já está cadastrado.`);
			}
		}

		const newClient = await prisma.client.create({
			data: {
				client_id: generatedClientId,
				first_name: data.firstName,
				last_name: data.lastName,
				passport_number: data.passportNumber,
				email: data.email || null,
				phone: data.phone || null,
				nationality: data.nationality || null,
				date_of_birth: data.dateOfBirth || null,
				gender: data.gender || null,
				updated_at: new Date(),
			},
		});

		console.log(`Cliente criado com sucesso: ${newClient.client_id}`);
		revalidatePath("/[locale]/(authenticated)/admin/clients", "page");
		return newClient;
	} catch (error) {
		console.error("Erro ao criar cliente:", JSON.stringify(error, null, 2));
		throw error;
	}
}
