"use server";

import { prisma } from "@/lib/prisma";
import { newPasswordSchema } from "@/zod-schemas/password-schema";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function createPasswordForClient(
    data: z.infer<typeof newPasswordSchema> & { clientId: string; email: string }
) {
    const { password, clientId, email } = data;

    // 1. Validate client
    const client = await prisma.client.findFirst({
        where: {
            id: clientId,
            email: email,
        },
    });

    if (!client) {
        throw new Error("Cliente não encontrado ou email inválido.");
    }

    if (client.userId) {
        throw new Error("Este cliente já possui uma conta de usuário.");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User
    const user = await prisma.user.create({
        data: {
            email: client.email!,
            password: hashedPassword,
            name: `${client.first_name} ${client.last_name}`,
            role: "USER",
        },
    });

    // 4. Link client to user
    await prisma.client.update({
        where: {
            id: client.id,
        },
        data: {
            userId: user.id,
        },
    });

    // 5. Return user (or some success message)
    return { success: true, userId: user.id };
}
