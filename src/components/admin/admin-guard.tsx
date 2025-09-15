'use client';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AdminGuard({ 
  children, 
  fallback = null, 
  redirectTo = '/dashboard' 
}: AdminGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Ainda carregando

    if (!session) {
      router.push('/sign-in');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push(redirectTo);
      return;
    }
  }, [session, status, router, redirectTo]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Verificando permissões..." />
      </div>
    );
  }

  if (!session) {
    return fallback;
  }

  if (session.user.role !== 'ADMIN') {
    return fallback;
  }

  return <>{children}</>;
}

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRole: 'USER' | 'ADMIN';
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export function PermissionGuard({ 
  children, 
  requiredRole, 
  fallback = null,
  showFallback = false 
}: PermissionGuardProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return showFallback ? <LoadingSpinner size="sm" /> : null;
  }

  if (!session) {
    return showFallback ? fallback : null;
  }

  const userRole = session.user.role;
  
  // Admin tem acesso a tudo
  if (userRole === 'ADMIN') {
    return <>{children}</>;
  }
  
  // Verificar se o usuário tem a role necessária
  if (requiredRole === 'USER' && userRole === 'USER') {
    return <>{children}</>;
  }

  return showFallback ? fallback : null;
} 