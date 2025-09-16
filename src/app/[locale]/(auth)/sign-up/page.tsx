import { SignUpForm } from '@/components/sign-up-form';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface SignUpPageProps {
  searchParams: {
    passportNumber?: string | undefined;
    email?: string | undefined;
  } & Promise<{
    passportNumber?: string | undefined;
    email?: string | undefined;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await auth();
  if (session) {
    redirect('/');
  }

  const { passportNumber, email } = searchParams;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpForm passportNumber={passportNumber} email={email} />
      </div>
    </div>
  );
} 