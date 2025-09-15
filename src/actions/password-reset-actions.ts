"use server"

import { prisma } from "@/lib/prisma"
import { withRateLimit } from "@/lib/with-rate-limit"
import { hash } from "bcryptjs"
import crypto from "crypto"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

async function sendPasswordResetEmailInternal(email: string) {
  // Verificar se o usuário existe
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  })

  if (!user) {
    // Por segurança, não revelamos se o email existe ou não
    return { success: true, message: "Se o email existir, você receberá as instruções de reset." }
  }

  // Limpar tokens expirados e não utilizados para este email
  await prisma.passwordResetToken.deleteMany({
    where: {
      email: email.toLowerCase(),
      OR: [
        { used: true },
        { expires: { lt: new Date() } },
      ],
    },
  })

  // Gerar token de reset
  const token = generateResetToken()
  const expires = new Date(Date.now() + 30 * 60 * 1000) // 30 minutos

  // Salvar no banco
  await prisma.passwordResetToken.create({
    data: {
      email: email.toLowerCase(),
      token,
      expires,
    },
  })

  // Criar link de reset
  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/en/reset-password?token=${token}`

  // Enviar email
  await resend.emails.send({
    from: "noreply@claudiolins.dev",
    to: email,
    subject: "Redefinir Senha - Boilerplate",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Redefinir Senha</h2>
        <p style="color: #666; font-size: 16px;">
          Olá! Recebemos uma solicitação para redefinir sua senha.
        </p>
        <p style="color: #666; font-size: 16px;">
          Clique no botão abaixo para criar uma nova senha:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Redefinir Senha
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Este link expira em 30 minutos por motivos de segurança.
        </p>
        <p style="color: #666; font-size: 14px;">
          Se você não solicitou esta redefinição, ignore este email. Sua senha permanecerá inalterada.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Link alternativo: ${resetLink}
        </p>
      </div>
    `,
  })

  return { success: true, message: "Se o email existir, você receberá as instruções de reset." }
}

export async function sendPasswordResetEmail(email: string) {
  return withRateLimit(
    'passwordReset',
    () => sendPasswordResetEmailInternal(email),
    email
  );
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    // Verificar se o token é válido
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expires: {
          gt: new Date(),
        },
      },
    })

    if (!resetToken) {
      return { success: false, message: "Token inválido ou expirado" }
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    })

    if (!user) {
      return { success: false, message: "Usuário não encontrado" }
    }

    // Criptografar nova senha
    const hashedPassword = await hash(newPassword, 10)

    // Atualizar senha e marcar token como usado em uma transação
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ])

    return { success: true, message: "Senha redefinida com sucesso!" }
  } catch (error) {
    console.log("Erro ao redefinir senha:", error)
    return { success: false, message: "Erro ao redefinir senha" }
  }
}

export async function validateResetToken(token: string) {
  try {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expires: {
          gt: new Date(),
        },
      },
    })

    return { valid: !!resetToken }
  } catch (error) {
    console.log("Erro ao validar token:", error)
    return { valid: false }
  }
}

export async function cleanupExpiredResetTokens() {
  try {
    await prisma.passwordResetToken.deleteMany({
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