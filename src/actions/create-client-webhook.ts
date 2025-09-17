"use server";

interface CreateClientWebhookProps {
	passportNumber: string;
	email?: string;
	phone?: string;
}

// ✅ Função para validar e limpar dados antes do envio
function validateAndCleanData(data: CreateClientWebhookProps) {
	// Limpar e validar passportNumber
	const passportNumber = data.passportNumber?.trim();
	if (!passportNumber || passportNumber.length < 3) {
		throw new Error("Número do passaporte inválido ou muito curto");
	}

	// Limpar e validar email se fornecido
	let email = data.email?.trim();
	if (email && email.length > 0) {
		// Validação básica de email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			console.warn("⚠️ Email inválido fornecido, será omitido:", email);
			email = undefined;
		}
	}

	// Limpar e validar phone se fornecido
	let phone = data.phone?.trim();
	if (phone && phone.length > 0) {
		// Remover caracteres não numéricos para validação
		const cleanPhone = phone.replace(/[^\d+]/g, "");

		// Validação básica de telefone (aceita +351, +55, etc.)
		const phoneRegex = /^(\+\d{1,3})?\d{8,15}$/;
		if (!phoneRegex.test(cleanPhone)) {
			console.warn("⚠️ Telefone inválido fornecido, será omitido:", phone);
			phone = undefined;
		} else {
			phone = cleanPhone; // Usar versão limpa
		}
	}

	return {
		passportNumber,
		email: email || undefined,
		phone: phone || undefined,
	};
}

// ✅ Função auxiliar para fazer o envio com retry
async function sendWithRetry(webhookUrl: string, payload: any, maxRetries = 2): Promise<string | null> {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		console.log(`Tentativa ${attempt}/${maxRetries}`);

		try {
			// ✅ Timeout progressivo: primeiro 10s, depois 15s, depois 20s
			const timeout = 8000 + attempt * 2000;
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			const response = await fetch(webhookUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": "Attorney-App/1.0",
					Accept: "application/json",
					"Cache-Control": "no-cache",
					"Content-Length": JSON.stringify(payload).length.toString(),
				},
				body: JSON.stringify(payload),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);
			console.log(`Tentativa ${attempt} - Status:`, response.status);

			if (response.ok) {
				const responseText = await response.text();
				const limitedResponse = responseText.length > 200 ? `${responseText.substring(0, 200)}...` : responseText;
				console.log("✅ Sucesso na tentativa", attempt, ":", limitedResponse);
				return "ok";
			}

			// Se não é erro de servidor (5xx), não retry
			if (response.status < 500) {
				console.error("❌ Erro cliente (4xx):", response.status);
				return null;
			}

			console.warn(`⚠️ Tentativa ${attempt} falhou com status ${response.status}`);
		} catch (error) {
			console.error(`❌ Erro na tentativa ${attempt}:`, error instanceof Error ? error.message : String(error));

			// Se é o último retry, falha definitivamente
			if (attempt === maxRetries) {
				if (error instanceof Error && (error.name === "AbortError" || error.message.includes("timeout"))) {
					console.error("❌ Timeout final - n8n pode estar com problemas de memória");
				}
				return null;
			}
		}

		// ✅ Backoff exponencial entre tentativas
		if (attempt < maxRetries) {
			const delay = 1000 * 2 ** (attempt - 1); // 1s, 2s, 4s...
			console.log(`⏳ Aguardando ${delay}ms antes da próxima tentativa...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	return null;
}

export async function sendCreateClientWebhook(data: CreateClientWebhookProps): Promise<string | null> {
	const webhookUrl = process.env.CREATE_CLIENT_WEBHOOK;

	console.log("=== DEBUG CREATE CLIENT WEBHOOK ===");
	console.log("Webhook URL:", webhookUrl);
	console.log("Dados originais:", JSON.stringify(data, null, 2));
	console.log("Timestamp:", new Date().toISOString());

	if (!webhookUrl) {
		console.error("❌ CREATE_CLIENT_WEBHOOK não está definida no .env.local");
		console.error("❌ Certifique-se de que a variável está configurada no arquivo .env.local");
		console.error("❌ URL esperada: https://n8n.claudiolins.eu/webhook/create-client");
		return null;
	}

	try {
		// ✅ Validar e limpar dados antes do envio
		const cleanData = validateAndCleanData(data);
		console.log("Dados limpos:", JSON.stringify(cleanData, null, 2));

		// ✅ Payload minimalista e otimizado
		const payload = {
			passport: cleanData.passportNumber, // Nome mais curto
			email: cleanData.email || null,
			phone: cleanData.phone || null,
			ts: Date.now(), // Timestamp mais eficiente
		};

		console.log("Payload otimizado:", JSON.stringify(payload, null, 2));

		// ✅ Usar função de retry com backoff
		return await sendWithRetry(webhookUrl, payload, 3); // Máximo 3 tentativas
	} catch (error) {
		// ✅ Log de erro mais eficiente
		console.error("❌ Erro geral webhook:", error instanceof Error ? error.message : String(error));
		return null;
	}
}
