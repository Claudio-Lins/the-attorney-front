"use server";

import { processStatus } from "@/hooks/use-process-status";

export async function sendProcessStatus(data: {
	name: string;
	phone: string;
	email: string;
	status: string;
	message: string;
	url: string;
	osNumber: string;
}) {
	console.log("=== ENVIANDO DADOS PARA N8N ===");
	console.log("Dados recebidos na action:", JSON.stringify(data, null, 2));

	try {
		const result = await processStatus(data);

		if (result === "ok") {
			console.log("✅ Dados enviados com sucesso para o n8n");
			return { success: true, message: "Dados enviados com sucesso" };
		}

		// ✅ Diagnóstico mais específico quando result é null
		console.error("❌ Falha ao enviar dados para o n8n - resultado:", result);

		// Verificar se o webhook está configurado
		const webhookUrl = process.env.PROCESS_STATUS_WEBHOOK;
		if (!webhookUrl) {
			throw new Error(
				"Webhook não configurado: A variável PROCESS_STATUS_WEBHOOK não está definida no arquivo .env.local",
			);
		}

		throw new Error(
			`Falha na comunicação com o webhook. Verifique: 1) Se o webhook ${webhookUrl} está funcionando, 2) Se a resposta está no formato correto, 3) Se não há problemas de rede`,
		);
	} catch (error) {
		console.error("❌ Erro na action sendProcessStatus:", JSON.stringify(error, null, 2));

		// ✅ Fornecer informação mais específica do erro
		if (error instanceof Error) {
			if (error.name === "AbortError") {
				throw new Error("Timeout: A requisição para o n8n demorou mais de 30 segundos");
			}
			if (error.message.includes("fetch")) {
				throw new Error(`Erro de conexão com o n8n: ${error.message}`);
			}
			throw error;
		}

		throw new Error("Erro desconhecido ao comunicar com o n8n");
	}
}
