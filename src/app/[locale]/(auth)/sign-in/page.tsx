import { LoginForm } from '@/components/login-form';
import { auth } from '@/lib/auth';
import ImageBackground from '@/public/img-unsplash/img-01.jpg';
import { redirect } from 'next/navigation';

interface LoginPageProps {
  searchParams: Promise<{
    reset?: string;
    verified?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  const params = await searchParams;
  const showResetSuccess = params.reset === 'success';
  const showVerifiedSuccess = params.verified === 'true';

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {showResetSuccess && (
          <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg text-center">
            <div className="font-medium">🔒 Senha redefinida com sucesso!</div>
            <div className="text-sm mt-1">Agora você pode fazer login com sua nova senha.</div>
          </div>
        )}
        {showVerifiedSuccess && (
          <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg text-center">
            <div className="font-medium">✅ Email verificado com sucesso!</div>
            <div className="text-sm mt-1">Agora você pode fazer login normalmente.</div>
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  )
}
