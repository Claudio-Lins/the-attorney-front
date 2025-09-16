"use server";

import { prisma } from "@/lib/prisma";

interface RegisterHistoryParams {
	client_service_id: string;
	field: string;
	oldValue?: string | null;
	newValue?: string | null;
	note?: string | null;
	changedBy?: string | null; // id do usuário responsável
}

export async function registerClientServiceHistory({
	client_service_id,
	field,
	oldValue,
	newValue,
	note,
	changedBy,
}: RegisterHistoryParams) {
	return prisma.client_service_history.create({
		data: {
			client_service_id: client_service_id,
			field,
			old_value: oldValue,
			new_value: newValue,
			note,
			changed_by: changedBy,
		},
	});
}

export async function getClientServiceHistory(clientServiceId: string) {
	return prisma.client_service_history.findMany({
		where: { client_service_id: clientServiceId },
		orderBy: { changed_at: "desc" },
	});
}
