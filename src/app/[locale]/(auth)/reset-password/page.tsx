import { validateResetToken } from '@/actions/password-reset-actions';
import { ResetPasswordForm } from '@/components/reset-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  const params = await searchParams;
  const token = params.token;
  
  if (!token) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Card className="bg-white/40 backdrop-blur-sm rounded-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-red-600">Token Inválido</CardTitle>
              <CardDescription>
                O link de redefinição de senha não é válido.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                O token de redefinição não foi encontrado. Por favor, solicite um novo link.
              </p>
              <a
                href="/en/forgot-password"
                className="text-blue-600 underline underline-offset-4 hover:text-blue-800"
              >
                Solicitar novo link
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Validar o token
  const tokenValidation = await validateResetToken(token);
  
  if (!tokenValidation.valid) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Card className="bg-white/40 backdrop-blur-sm rounded-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-red-600">Token Expirado</CardTitle>
              <CardDescription>
                O link de redefinição de senha expirou ou já foi utilizado.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Por motivos de segurança, os links de redefinição expiram em 30 minutos.
              </p>
              <a
                href="/en/forgot-password"
                className="text-blue-600 underline underline-offset-4 hover:text-blue-800"
              >
                Solicitar novo link
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
} 