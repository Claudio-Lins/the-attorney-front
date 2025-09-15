"use server"

import { prisma } from "@/lib/prisma"
import { withRateLimit } from "@/lib/with-rate-limit"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

async function sendVerificationEmailInternal(email: string) {
  // Limpar tokens expirados e não utilizados para este email
  await prisma.emailVerificationToken.deleteMany({
    where: {
      email: email.toLowerCase(),
      OR: [
        { used: true },
        { expires: { lt: new Date() } },
      ],
    },
  })

  // Gerar código de verificação
  const code = generateVerificationCode()
  const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos

  // Salvar no banco
  await prisma.emailVerificationToken.create({
    data: {
      email: email.toLowerCase(),
      token: code,
      expires,
    },
  })

  // Enviar email
  await resend.emails.send({
    from: "noreply@claudiolins.dev",
    to: email,
    subject: "Código de Verificação - Boilerplate",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Código de Verificação</h2>
        <p style="color: #666; font-size: 16px;">
          Olá! Use o código abaixo para verificar seu email:
        </p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #333; font-size: 32px; margin: 0; letter-spacing: 4px;">
            ${code}
          </h1>
        </div>
        <p style="color: #666; font-size: 14px;">
          Este código expira em 10 minutos.
        </p>
        <p style="color: #666; font-size: 14px;">
          Se você não solicitou este código, ignore este email.
        </p>
      </div>
    `,
  })

  return { success: true, message: "Código enviado com sucesso!" }
}

export async function sendVerificationEmail(email: string) {
  return withRateLimit(
    'emailVerification',
    () => sendVerificationEmailInternal(email),
    email
  );
}

async function verifyEmailCodeInternal(email: string, code: string) {
  const verificationToken = await prisma.emailVerificationToken.findFirst({
    where: {
      email: email.toLowerCase(),
      token: code.toUpperCase(),
      used: false,
      expires: {
        gt: new Date(),
      },
    },
  })

  if (!verificationToken) {
    return { success: false, message: "Código inválido ou expirado" }
  }

  // Marcar token como usado e marcar email como verificado no usuário
  await prisma.$transaction([
    prisma.emailVerificationToken.update({
      where: {
        id: verificationToken.id,
      },
      data: {
        used: true,
      },
    }),
    prisma.user.update({
      where: {
        email: email.toLowerCase(),
      },
      data: {
        emailVerified: new Date(),
      },
    }),
  ])

  return { success: true, message: "Email verificado com sucesso!" }
}

export async function verifyEmailCode(email: string, code: string) {
  return withRateLimit(
    'emailVerification',
    () => verifyEmailCodeInternal(email, code),
    email
  );
}

export async function cleanupExpiredTokens() {
  try {
    await prisma.emailVerificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    })
  } catch (error) {
    console.log("Erro ao limpar tokens expirados:", error)
  }
} 