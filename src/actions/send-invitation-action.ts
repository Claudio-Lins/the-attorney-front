"use server";

import { sendCreateClientWebhook } from "./create-client-webhook";

interface SendInvitationData {
    passportNumber: string;
    email?: string | null;
    phone?: string | null;
}

export async function sendInvitationAction(data: SendInvitationData): Promise<string | null> {
    if (!data.passportNumber) {
        throw new Error("Passport number is required.");
    }

    return await sendCreateClientWebhook({
        passportNumber: data.passportNumber,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
    });
}
