'use server';

import type { address, client } from "@/generated/prisma/client";

// Mapeamento dos tipos de procuração para as variáveis de ambiente e nomes
const webhooks = {
    NACIONALIDADE: {
        url: process.env.POWER_ATTORNEY_NACIONALIDADE_WEBHOOK,
        name: "Procuração para Nacionalidade Portuguesa",
    },
    RESIDENCIA: {
        url: process.env.POWER_ATTORNEY_RESIDENCIA_WEBHOOK,
        name: "Procuração para Autorização de Residência",
    },
    REAGRUPAMENTO: {
        url: process.env.POWER_ATTORNEY_REAGRUPAMENTO_WEBHOOK,
        name: "Procuração para Reagrupamento Familiar",
    },
    TRABALHO: {
        url: process.env.POWER_ATTORNEY_TRABALHO_WEBHOOK,
        name: "Procuração para Trabalho",
    },
    ESTUDANTE: {
        url: process.env.POWER_ATTORNEY_ESTUDANTE_WEBHOOK,
        name: "Procuração para Estudante",
    },
};

export type WebhookType = keyof typeof webhooks;

// --- Funções Auxiliares de Formatação ---

const formatDate = (date: Date | null | undefined): string | null => {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

const formatMaritalStatus = (status: string | null | undefined): string | null => {
    if (!status) return null;
    const map = {
        SINGLE: "Solteiro(a)",
        MARRIED: "Casado(a)",
        DIVORCED: "Divorciado(a)",
        WIDOWED: "Viúvo(a)",
        SEPARATED: "Separado(a)",
    };
    return map[status as keyof typeof map] || status;
};

// --- Ação Principal ---

async function sendPowerAttorneyWebhook(
    webhookUrl: string,
    payload: any
): Promise<string | null> {
    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error(`Erro ao enviar webhook para ${webhookUrl}:`, response.statusText, await response.text());
            return null;
        }

        return "ok";
    } catch (error) {
        console.error(`Falha na comunicação com o webhook ${webhookUrl}:`, error);
        return null;
    }
}

export async function triggerPowerAttorneyWebhook(
    clientData: client & { address?: address[] },
    type: WebhookType
): Promise<string | null> {
    const webhookConfig = webhooks[type];

    if (!webhookConfig?.url) {
        console.error(`Webhook URL para o tipo "${type}" não foi definida.`);
        return null;
    }

    // Estrutura o payload com todos os campos necessários
    const payload = {
        client_id: clientData.client_id,
        power_attorney_name: webhookConfig.name,
        first_name: clientData.first_name,
        last_name: clientData.last_name,
        email: clientData.email,
        marital_status: formatMaritalStatus(clientData.marital_status),
        passport_number: clientData.passport_number,
        passport_expiry: formatDate(clientData.passport_expiry),
        passport_issue_date: formatDate(clientData.passport_issue_date),
        nationality: clientData.nationality,
        phone: clientData.phone,
        whatsapp: clientData.whatsapp,
        photo_url: clientData.photo_url,
        country_of_birth: clientData.country_of_birth,
        date_of_birth: formatDate(clientData.date_of_birth),
        gender: clientData.gender,
        place_of_birth: clientData.place_of_birth,
        filiation: clientData.filiation ? {
            father_name: (clientData.filiation as any)?.father || null,
            mother_name: (clientData.filiation as any)?.mother || null,
        } : null,
        address: clientData.address && clientData.address.length > 0 ? {
            street: clientData.address[0].street,
            number: clientData.address[0].number,
            complement: clientData.address[0].complement,
            neighborhood: clientData.address[0].neighborhood,
            city: clientData.address[0].city,
            state: clientData.address[0].state,
            zip_code: clientData.address[0].zip_code,
        } : null,
    };

    return await sendPowerAttorneyWebhook(webhookConfig.url, payload);
}
