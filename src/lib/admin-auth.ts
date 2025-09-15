import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/sign-in');
  }
  
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard'); // Redireciona usuários normais para dashboard
  }
  
  return session;
}

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

export function hasPermission(userRole: string | undefined, requiredRole: 'USER' | 'ADMIN') {
  if (!userRole) return false;
  
  // Admin tem acesso a tudo
  if (userRole === 'ADMIN') return true;
  
  // USER só tem acesso a funcionalidades USER
  return requiredRole === 'USER' && userRole === 'USER';
} 