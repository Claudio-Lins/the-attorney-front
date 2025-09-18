import { SignUpForm } from '@/components/sign-up-form';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface SignUpPageProps {
  searchParams: Promise<{
    clientId?: string;
    email?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  const { clientId, email } = await searchParams;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpForm clientId={clientId} email={email} />
      </div>
    </div>
  );
} 