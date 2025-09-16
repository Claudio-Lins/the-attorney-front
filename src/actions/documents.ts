"use server";

import { getAuthenticatedClient } from "@/actions/client"; // CORRIGIDO
import { DocumentResponse, SupabaseFile } from "@/types/document-types";
import { revalidatePath } from "next/cache";

// Remover o @ do início da URL se existir
const SUPABASE_URL =
	process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^@/, "") || "https://rxqhuxndaspxtiqlxnbj.supabase.co";
const BUCKET_NAME = "client-assets";

const headers = {
	Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
	"Content-Type": "application/json",
};

// Headers para uploads (usa Service Role Key para bypass RLS)
const uploadHeaders = {
	Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
	"Content-Type": "application/json",
};

async function listFilesInPath(path = ""): Promise<SupabaseFile[]> {
	try {
		const url = `${SUPABASE_URL}/storage/v1/object/list/${BUCKET_NAME}`;

		const response = await fetch(url, {
			method: "POST",
			headers: uploadHeaders, // CORRIGIDO: Usar headers de admin para listar
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

export async function getDocuments(): Promise<DocumentResponse> {
	try {
		const client = await getAuthenticatedClient(); // CORRIGIDO
		if (!client) {
			return {
				error: {
					message: "Cliente não encontrado",
					statusCode: "404",
				},
			};
		}

		const clientFolder = `${client.client_id}/`;
		const filesInClientFolder = await listFilesInPath(clientFolder);

		const validFiles = filesInClientFolder.filter(
			(file) => file.name.includes(".") && file.metadata && file.metadata.size > 0,
		);

		const filesWithFullPath = validFiles.map((file) => ({
			...file,
			name: `${client.client_id}/${file.name}`,
		}));

		return {
			data: filesWithFullPath,
		};
	} catch (error) {
		console.error("Erro ao buscar documentos:", JSON.stringify(error, null, 2));
		return {
			error: {
				message: error instanceof Error ? error.message : "Erro desconhecido",
				statusCode: "500",
			},
		};
	}
}

export async function getFileUrl(fileName: string): Promise<string> { // CORRIGIDO (removido async)
	return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;
}

export async function formatFileSize(bytes: number): Promise<string> { // CORRIGIDO (removido async)
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export async function getFileExtension(fileName: string): Promise<string> { // CORRIGIDO (removido async)
	return fileName.split(".").pop()?.toLowerCase() || "";
}

export async function isImageFile(fileName: string): Promise<boolean> { // CORRIGIDO (removido async)
	const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
	const extension = await getFileExtension(fileName);
	return imageExtensions.includes(extension);
}

export async function isPdfFile(fileName: string): Promise<boolean> { // CORRIGIDO (removido async)
	const extension = await getFileExtension(fileName);
	return extension === "pdf";
}

export async function isDocFile(fileName: string): Promise<boolean> { // CORRIGIDO (removido async)
	const extension = await getFileExtension(fileName);
	return extension === "doc" || extension === "docx";
}

export async function isXlsxFile(fileName: string): Promise<boolean> { // CORRIGIDO (removido async)
	const extension = await getFileExtension(fileName);
	return extension === "xlsx";
}

export async function uploadDocument(
	file: File,
	customName?: string,
): Promise<{ success: boolean; message: string; fileName?: string }> {
	try {
		const client = await getAuthenticatedClient(); // CORRIGIDO
		if (!client) {
			return {
				success: false,
				message: "Cliente não encontrado. Por favor, faça login novamente.",
			};
		}

		if (!file || file.size === 0) {
			return {
				success: false,
				message: "Arquivo inválido ou vazio. Por favor, selecione um arquivo válido.",
			};
		}

		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			return {
				success: false,
				message: `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Tamanho máximo: 10MB`,
			};
		}

		const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

		const allowedExtensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "gif", "txt", "xlsx"];
		if (!allowedExtensions.includes(fileExtension)) {
			return {
				success: false,
				message: `Tipo de arquivo não suportado (.${fileExtension}). Formatos aceitos: PDF, DOC, DOCX, JPG, PNG, GIF, TXT, XLSX`,
			};
		}

		let finalFileName: string;
		if (customName && customName.trim()) {
			const trimmedName = customName.trim();

			const dangerousChars = ["<", ">", ":", "\"", "/", "\\", "|", "?", "*"];
			if (dangerousChars.some((char) => trimmedName.includes(char))) {
				return {
					success: false,
					message: 'Nome do arquivo contém caracteres inválidos. Evite símbolos especiais como < > : " / \ | ? *',
				};
			}

			if (trimmedName.length < 2) {
				return {
					success: false,
					message: "Nome do arquivo deve ter pelo menos 2 caracteres.",
				};
			}

			if (trimmedName.length > 50) {
				return {
					success: false,
					message: "Nome do arquivo deve ter no máximo 50 caracteres.",
				};
			}

			const sanitizedCustomName = trimmedName
				.normalize("NFD")
				.replace(/[àáâãäåçèéêëìíîïñòóôõöùúûüý]/gi, (match) => {
					const replacements: { [key: string]: string } = { à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a", ç: "c", è: "e", é: "e", ê: "e", ë: "e", ì: "i", í: "i", î: "i", ï: "i", ñ: "n", ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ù: "u", ú: "u",û: "u", ü: "u", ý: "y"};
					return replacements[match.toLowerCase()] || match;
				})
				.replace(/\s+/g, "_")
				.replace(/[^a-zA-Z0-9_-]/g, "")
				.toLowerCase();

			finalFileName = `${sanitizedCustomName}.${fileExtension}`;
		} else {
			return {
				success: false,
				message: "Por favor, digite um nome para o arquivo.",
			};
		}

			const fileName = `${client.client_id}/${client.client_id}_${finalFileName}`;

		const existingFiles = await listFilesInPath(`${client.client_id}/`);
		const fileExists = existingFiles.some((f) => f.name === `${client.client_id}_${finalFileName}`);

		if (fileExists) {
			return {
				success: false,
				message: "Já existe um arquivo com este nome. Por favor, escolha outro nome.",
			};
		}

		let arrayBuffer: ArrayBuffer;
		try {
			arrayBuffer = await file.arrayBuffer();
		} catch (error) {
			return {
				success: false,
				message: "Erro ao processar o arquivo. O arquivo pode estar corrompido.",
			};
		}

		const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`;

		console.log("Upload URL:", uploadUrl);

		const uploadResponse = await fetch(uploadUrl, {
			method: "POST",
			headers: {
				...uploadHeaders,
				"Content-Type": file.type || "application/octet-stream",
			},
			body: arrayBuffer,
		});

		if (!uploadResponse.ok) {
			const errorText = await uploadResponse.text();
			console.error(
				"Erro no upload:",
				JSON.stringify(
					{
						status: uploadResponse.status,
						statusText: uploadResponse.statusText,
						errorText: errorText,
						fileName: fileName,
					},
					null,
					2,
					),
			);

			let errorMessage = "Erro ao fazer upload do arquivo";

			if (uploadResponse.status === 413) {
				errorMessage = "Arquivo muito grande para upload";
			} else if (uploadResponse.status === 401) {
				errorMessage = "Não autorizado. Verifique suas credenciais";
			} else if (uploadResponse.status === 409) {
				errorMessage = "Arquivo já existe no servidor";
			} else if (uploadResponse.status === 422) {
				errorMessage = "Formato de arquivo inválido";
			} else if (uploadResponse.status >= 500) {
				errorMessage = "Erro interno do servidor. Tente novamente em alguns minutos";
			}

			return {
				success: false,
				message: errorMessage,
			};
		}

		revalidatePath("/[locale]/client/documents", "page"); // Revalidate the documents page

		return {
			success: true,
			message: `Arquivo "${customName}" enviado com sucesso!`,
			fileName: fileName,
		};
	} catch (error) {
		console.error("Erro ao fazer upload:", JSON.stringify(error, null, 2));

		let errorMessage = "Erro desconhecido durante o upload";

		if (error instanceof TypeError && error.message.includes("network")) {
			errorMessage = "Erro de conexão. Verifique sua internet e tente novamente";
		} else if (error instanceof Error) {
			errorMessage = `Erro: ${error.message}`;
		}

		return {
			success: false,
			message: errorMessage,
		};
	}
}

export async function uploadClientPhoto(
	file: File,
	clientId: string,
): Promise<{ success: boolean; message: string; photoUrl?: string }> {
	try {
		const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
		const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		console.log("=== DEBUG UPLOAD PHOTO ===");
		console.log("Has Service Role Key:", hasServiceKey);
		console.log("Has Anon Key:", hasAnonKey);
		console.log("Client ID:", clientId);
		console.log("File size:", file.size);
		console.log("File type:", file.type);
		if (!file || file.size === 0) {
			return {
				success: false,
				message: "Arquivo inválido ou vazio. Por favor, selecione uma imagem válida.",
			};
		}

		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			return {
				success: false,
				message: `Imagem muito grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Tamanho máximo: 5MB`,
			};
		}

		if (!file.type.startsWith("image/")) {
			return {
				success: false,
				message: "Arquivo deve ser uma imagem (JPG, PNG, GIF, WebP).",
			};
		}

		const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

		const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
		if (!allowedExtensions.includes(fileExtension)) {
			return {
				success: false,
				message: `Formato de imagem não suportado (.${fileExtension}). Formatos aceitos: JPG, PNG, GIF, WebP`,
			};
		}

		const fileName = `profiles/${clientId}/profile.${fileExtension}`;

		let arrayBuffer: ArrayBuffer;
		try {
			arrayBuffer = await file.arrayBuffer();
		} catch (error) {
			return {
				success: false,
				message: "Erro ao processar a imagem. O arquivo pode estar corrompido.",
			};
		}

		const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`;

		const uploadResponse = await fetch(uploadUrl, {
			method: "POST",
			headers: {
				...uploadHeaders,
				"Content-Type": file.type,
			},
			body: arrayBuffer,
		});

		if (!uploadResponse.ok) {
			const errorText = await uploadResponse.text();
			console.error(
				"Erro no upload da foto:",
				JSON.stringify(
					{
						status: uploadResponse.status,
						statusText: uploadResponse.statusText,
						errorText: errorText,
						fileName: fileName,
					},
					null,
					2,
					),
			);

			let errorMessage = "Erro ao fazer upload da foto";

			if (uploadResponse.status === 413) {
				errorMessage = "Imagem muito grande para upload";
			} else if (uploadResponse.status === 401) {
				errorMessage = "Não autorizado. Verifique suas credenciais";
			} else if (uploadResponse.status === 422) {
				errorMessage = "Formato de imagem inválido";
			} else if (uploadResponse.status >= 500) {
				errorMessage = "Erro interno do servidor. Tente novamente em alguns minutos";
			}

			return {
				success: false,
				message: errorMessage,
			};
		}

		const photoUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`;

		return {
			success: true,
			message: "Foto de perfil atualizada com sucesso!",
			photoUrl: photoUrl,
		};
	} catch (error) {
		console.error("Erro ao fazer upload da foto:", JSON.stringify(error, null, 2));

		let errorMessage = "Erro desconhecido durante o upload da foto";

		if (error instanceof TypeError && error.message.includes("network")) {
			errorMessage = "Erro de conexão. Verifique sua internet e tente novamente";
		} else if (error instanceof Error) {
			errorMessage = `Erro: ${error.message}`;
		}

		return {
			success: false,
			message: errorMessage,
		};
	}
}

// https://bbesxifppbyshptxhnjz.supabase.co/storage/v1/object/public/client-assets/claudiolins_351910344904/FT983063-file.jpg