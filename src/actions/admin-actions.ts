'use server';

import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema para criação de usuário
const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['USER', 'ADMIN']),
});

// Schema para atualização de usuário
const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['USER', 'ADMIN']),
});

export async function createUser(formData: FormData) {
  try {
    // Verificar se é admin
    await requireAdmin();

    const validatedFields = createUserSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
    });

    if (!validatedFields.success) {
      return { 
        success: false, 
        error: 'Dados inválidos: ' + validatedFields.error.issues[0].message 
      };
    }

    const { name, email, password, role } = validatedFields.data;

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { 
        success: false, 
        error: 'Este email já está sendo usado por outro usuário' 
      };
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: new Date(), // Admin criado já vem verificado
      },
    });

    revalidatePath('/admin/users');
    return { 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email } 
    };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

export async function updateUser(formData: FormData) {
  try {
    // Verificar se é admin
    await requireAdmin();

    const validatedFields = updateUserSchema.safeParse({
      id: formData.get('id'),
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
    });

    if (!validatedFields.success) {
      return { 
        success: false, 
        error: 'Dados inválidos: ' + validatedFields.error.issues[0].message 
      };
    }

    const { id, name, email, role } = validatedFields.data;

    // Se estiver atualizando email, verificar se não existe
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });

    if (existingUser) {
      return { 
        success: false, 
        error: 'Este email já está sendo usado por outro usuário' 
      };
    }

    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role },
    });

    revalidatePath('/admin/users');
    revalidatePath(`/admin/users/${id}`);
    return { 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email } 
    };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    // Verificar se é admin
    const session = await requireAdmin();

    if (!userId) {
      return { success: false, error: 'ID do usuário é obrigatório' };
    }

    // Não permitir auto-deleção
    if (session.user.id === userId) {
      return { 
        success: false, 
        error: 'Você não pode deletar sua própria conta' 
      };
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    // Verificar se não é o último admin
    if (user.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (adminCount <= 1) {
        return { 
          success: false, 
          error: 'Não é possível deletar o último administrador do sistema' 
        };
      }
    }

    // Deletar usuário (isso também deleta sessions, accounts, etc. por cascade)
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin/users');
    return { success: true, message: 'Usuário deletado com sucesso' };
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
}

export async function toggleUserRole(userId: string) {
  try {
    // Verificar se é admin
    const session = await requireAdmin();

    if (!userId) {
      return { success: false, error: 'ID do usuário é obrigatório' };
    }

    // Não permitir alterar própria role
    if (session.user.id === userId) {
      return { 
        success: false, 
        error: 'Você não pode alterar sua própria role' 
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    // Se estiver removendo admin, verificar se não é o último
    if (user.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (adminCount <= 1) {
        return { 
          success: false, 
          error: 'Não é possível remover o último administrador do sistema' 
        };
      }
    }

    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath('/admin/users');
    return { 
      success: true, 
      message: `Usuário ${newRole === 'ADMIN' ? 'promovido a' : 'removido de'} administrador` 
    };
  } catch (error) {
    console.error('Erro ao alterar role:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
} 