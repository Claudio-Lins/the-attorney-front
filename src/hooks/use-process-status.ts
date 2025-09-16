"use server";

interface ProcessStatusProps {
	name: string;
	phone: string;
	email: string;
	status: string;
	message: string;
	osNumber: string;
	url: string;
}

export async function processStatus(data: ProcessStatusProps): Promise<string | null> {
	const webhookUrl = process.env.PROCESS_STATUS_WEBHOOK;

	console.log("=== DEBUG WEBHOOK ===");
	console.log("Webhook URL:", webhookUrl);
	console.log("process.env.PROCESS_STATUS_WEBHOOK:", process.env.PROCESS_STATUS_WEBHOOK);
	console.log("Todas as env vars relacionadas a webhook:", {
		PROCESS_STATUS_WEBHOOK: process.env.PROCESS_STATUS_WEBHOOK,
		POWER_ATTORNEY_WEBHOOK: process.env.POWER_ATTORNEY_WEBHOOK,
		CREATE_CLIENT_WEBHOOK: process.env.CREATE_CLIENT_WEBHOOK,
	});
	console.log("Dados a serem enviados:", JSON.stringify(data, null, 2));
	console.log("Timestamp:", new Date().toISOString());

	if (!webhookUrl) {
		console.error("❌ PROCESS_STATUS_WEBHOOK não está definida no .env.local");
		console.error("❌ Certifique-se de que a variável está configurada no arquivo .env.local");
		return null;
	}

	try {
		// ✅ Configuração com timeout e headers mais robustos
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "The-Attorney-App/1.0",
				Accept: "application/json, text/plain, */*",
				"Cache-Control": "no-cache",
			},
			body: JSON.stringify(data),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		console.log("Status da resposta:", response.status);
		console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()));

		if (!response.ok) {
			const errorText = await response.text();
			console.error("❌ Erro na resposta HTTP:", response.status, response.statusText);
			console.error("❌ URL do webhook:", webhookUrl);
			console.error("❌ Corpo da resposta de erro:", errorText);
			console.error("❌ Headers da resposta de erro:", Object.fromEntries(response.headers.entries()));
			return null;
		}

		const responseText = await response.text();
		console.log("✅ Sucesso! Resposta:", responseText);

		// ✅ Validação mais flexível da resposta
		try {
			const jsonResponse = JSON.parse(responseText);

			// Aceita diferentes formatos de resposta de sucesso
			if (
				jsonResponse.message === "Workflow was started" ||
				jsonResponse.success === true ||
				jsonResponse.status === "ok" ||
				response.status === 200
			) {
				console.log("✅ Resposta válida detectada");
				return "ok";
			}

			console.warn("⚠️ Resposta inesperada mas status 200:", jsonResponse);
			return "ok"; // Se status 200, considera sucesso
		} catch (parseError) {
			// Se não conseguir fazer parse mas status é 200, considera sucesso
			console.warn("⚠️ Resposta não é JSON mas status 200:", responseText);
			return response.status === 200 ? "ok" : null;
		}
	} catch (error) {
		console.error("❌ Erro ao comunicar com webhook:", JSON.stringify(error, null, 2));
		console.error("❌ URL do webhook:", webhookUrl);
		console.error("❌ Tipo do erro:", error instanceof Error ? error.name : typeof error);
		if (error instanceof Error) {
			console.error("❌ Mensagem do erro:", error.message);
			console.error("❌ Stack do erro:", error.stack);
		}
		return null;
	}
}
