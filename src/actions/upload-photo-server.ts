"use server";

import { createClient } from "@supabase/supabase-js";

// Cliente Supabase com Service Role (bypassa RLS)
const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL || "",
	process.env.SUPABASE_SERVICE_ROLE_KEY || "",
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	},
);

export async function uploadClientPhotoServer(
	fileBuffer: ArrayBuffer,
	fileName: string,
	fileType: string,
	clientId: string,
): Promise<{ success: boolean; message: string; photoUrl?: string }> {
	try {
		console.log("=== UPLOAD PHOTO SERVER ===");
		console.log("Client ID:", clientId);
		console.log("File name:", fileName);
		console.log("File type:", fileType);
		console.log("Buffer size:", fileBuffer.byteLength);

		// Verificar configuração
		if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
			console.error("❌ SUPABASE_SERVICE_ROLE_KEY não está configurado");
			return {
				success: false,
				message: "Configuração de upload não encontrada. Contate o administrador.",
			};
		}

		// Validar entrada
		if (!fileBuffer || fileBuffer.byteLength === 0) {
			return {
				success: false,
				message: "Arquivo inválido ou vazio.",
			};
		}

		if (!clientId || clientId.trim().length === 0) {
			return {
				success: false,
				message: "ID do cliente é obrigatório.",
			};
		}

		// Limitar tamanho (5MB)
		const maxSize = 5 * 1024 * 1024;
		if (fileBuffer.byteLength > maxSize) {
			return {
				success: false,
				message: `Imagem muito grande (${(fileBuffer.byteLength / 1024 / 1024).toFixed(2)}MB). Máximo: 5MB`,
			};
		}

		// Verificar tipo de arquivo
		const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
		if (!allowedTypes.includes(fileType.toLowerCase())) {
			return {
				success: false,
				message: "Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WebP.",
			};
		}

		// Obter extensão
		const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
		const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
		if (!allowedExtensions.includes(extension)) {
			return {
				success: false,
				message: "Extensão de arquivo não suportada.",
			};
		}

		// Criar caminho único para a foto
		const filePath = `profiles/${clientId}/profile.${extension}`;

		console.log("Uploading to path:", filePath);

		// Fazer upload usando o cliente Supabase Admin
		const { data, error } = await supabaseAdmin.storage.from("client-assets").upload(filePath, fileBuffer, {
			contentType: fileType,
			upsert: true, // Sobrescrever se já existir
		});

		if (error) {
			console.error("❌ Erro no upload Supabase:", JSON.stringify(error, null, 2));

			// Mapear erros específicos
			let errorMessage = "Erro ao fazer upload da foto";

			if (error.message.includes("row-level security")) {
				errorMessage = "Erro de permissão. Verifique as políticas de segurança.";
			} else if (error.message.includes("413") || error.message.includes("too large")) {
				errorMessage = "Arquivo muito grande para upload";
			} else if (error.message.includes("unauthorized")) {
				errorMessage = "Não autorizado para fazer upload";
			} else if (error.message.includes("invalid")) {
				errorMessage = "Formato de arquivo inválido";
			}

			return {
				success: false,
				message: errorMessage,
			};
		}

		if (!data?.path) {
			console.error("❌ Upload bem-sucedido mas sem path retornado");
			return {
				success: false,
				message: "Upload realizado mas caminho não retornado",
			};
		}

		// Gerar URL pública
		const { data: publicUrlData } = supabaseAdmin.storage.from("client-assets").getPublicUrl(data.path);

		const photoUrl = publicUrlData.publicUrl;

		console.log("✅ Upload bem-sucedido!");
		console.log("Path:", data.path);
		console.log("Public URL:", photoUrl);

		return {
			success: true,
			message: "Foto de perfil atualizada com sucesso!",
			photoUrl: photoUrl,
		};
	} catch (error) {
		console.error("❌ Erro geral no upload:", JSON.stringify(error, null, 2));

		let errorMessage = "Erro desconhecido durante o upload";

		if (error instanceof Error) {
			if (error.message.includes("network")) {
				errorMessage = "Erro de conexão. Verifique sua internet.";
			} else if (error.message.includes("timeout")) {
				errorMessage = "Timeout durante upload. Tente novamente.";
			} else {
				errorMessage = `Erro: ${error.message}`;
			}
		}

		return {
			success: false,
			message: errorMessage,
		};
	}
}
