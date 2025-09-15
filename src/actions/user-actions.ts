"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { withRateLimit } from "@/lib/with-rate-limit"
import { compare, hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schemas de validação
const updateProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(50),
  email: z.string().email("Email inválido"),
})

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

// Atualizar informações do perfil
async function updateProfileInternal(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, message: "Usuário não autenticado" }
  }

  const name = formData.get("name")?.toString() || ""
  const email = formData.get("email")?.toString() || ""

  const validatedData = updateProfileSchema.parse({ name, email })

  // Verificar se email já existe (se diferente do atual)
  if (email !== session.user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (existingUser) {
      return { success: false, message: "Este email já está em uso" }
    }
  }

  // Atualizar usuário
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      // Se email mudou, marcar como não verificado
      emailVerified: email !== session.user.email ? null : undefined,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/profile")
  
  return { 
    success: true, 
    message: "Perfil atualizado com sucesso!",
    emailChanged: email !== session.user.email
  }
}

export async function updateProfile(formData: FormData) {
  const email = formData.get("email")?.toString() || ""
  
  return withRateLimit(
    'signup', // Usar mesmo rate limit do signup
    () => updateProfileInternal(formData),
    email
  )
}

// Atualizar senha
async function updatePasswordInternal(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, message: "Usuário não autenticado" }
  }

  const currentPassword = formData.get("currentPassword")?.toString() || ""
  const newPassword = formData.get("newPassword")?.toString() || ""
  const confirmPassword = formData.get("confirmPassword")?.toString() || ""

  const validatedData = updatePasswordSchema.parse({ 
    currentPassword, 
    newPassword, 
    confirmPassword 
  })

  // Buscar usuário atual
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user || !user.password) {
    return { success: false, message: "Usuário não encontrado" }
  }

  // Verificar senha atual
  const isCurrentPasswordValid = await compare(validatedData.currentPassword, user.password)
  
  if (!isCurrentPasswordValid) {
    return { success: false, message: "Senha atual incorreta" }
  }

  // Criptografar nova senha
  const hashedNewPassword = await hash(validatedData.newPassword, 10)

  // Atualizar senha
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedNewPassword },
  })

  return { success: true, message: "Senha atualizada com sucesso!" }
}

export async function updatePassword(formData: FormData) {
  const session = await auth()
  const email = session?.user?.email || ""
  
  return withRateLimit(
    'passwordReset', // Usar rate limit de reset de senha
    () => updatePasswordInternal(formData),
    email
  )
}

// Obter dados do usuário
export async function getUserData() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      image: true,
    },
  })

  return user
} 