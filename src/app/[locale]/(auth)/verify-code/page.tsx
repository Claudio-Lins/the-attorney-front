import { EmailVerificationForm } from '@/components/email-verification-form';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface VerifyCodePageProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

export default async function VerifyCodePage({ searchParams }: VerifyCodePageProps) {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  const params = await searchParams;
  const email = params.email;
  
  if (!email) {
    redirect('/en/verify-email');
  }
  
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <EmailVerificationForm email={decodeURIComponent(email)} />
      </div>
    </div>
  )
} 