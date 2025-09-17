"use server";

import { getAuthenticatedClient } from "@/actions/client";
import { DocumentResponse, SupabaseFile } from "@/types/document-types";
import { revalidatePath } from "next/cache";

const SUPABASE_URL =
	process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^@/, "") || "https://rxqhuxndaspxtiqlxnbj.supabase.co";
const BUCKET_NAME = "client-assets";

const uploadHeaders = {
	Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
	"Content-Type": "application/json",
};

async function listFilesInPath(path = ""): Promise<SupabaseFile[]> {
	try {
		const url = `${SUPABASE_URL}/storage/v1/object/list/${BUCKET_NAME}`;

		const response = await fetch(url, {
			method: "POST",
			headers: uploadHeaders,
			body: JSON.stringify({
				prefix: path,
				limit: 100,
				offset: 0,
				sortBy: { column: "created_at", order: "desc" },
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				"Erro na resposta:",
				JSON.stringify(
					{
						status: response.status,
						statusText: response.statusText,
						errorText: errorText,
						path: path,
					},
				null,
				2,
				),
			);
			return [];
		}

		const data = await response.json();
		return data || [];
	} catch (error) {
		console.error("Erro ao listar arquivos no path:", path, JSON.stringify(error, null, 2));
		return [];
	}
}

export async function getPowerAttorneyDocuments(): Promise<DocumentResponse> {
	try {
		const client = await getAuthenticatedClient();
		if (!client) {
			return {
				error: {
					message: "Cliente não encontrado",
					statusCode: "404",
				},
			};
		}

		const clientFolder = `${client.client_id}/power-attorney/`;
		const filesInClientFolder = await listFilesInPath(clientFolder);

		const validFiles = filesInClientFolder.filter(
			(file) => file.name.includes(".") && file.metadata && file.metadata.size > 0,
		);

		const filesWithFullPath = validFiles.map((file) => ({
			...file,
			name: `${client.client_id}/power-attorney/${file.name}`,
		}));

		return {
			data: filesWithFullPath,
		};
	} catch (error) {
		console.error("Erro ao buscar documentos de procuração:", JSON.stringify(error, null, 2));
		return {
			error: {
				message: error instanceof Error ? error.message : "Erro desconhecido",
				statusCode: "500",
			},
		};
	}
}
