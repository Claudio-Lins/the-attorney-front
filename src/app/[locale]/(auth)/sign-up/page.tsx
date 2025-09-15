import { SignUpForm } from '@/components/sign-up-form';
import { auth } from '@/lib/auth';
import ImageBackground from '@/public/img-unsplash/img-01.jpg';
import { redirect } from 'next/navigation';

export default async function SignUpPage() {
  const session = await auth();
  if (session) {
    redirect('/');
  }
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <SignUpForm />
      </div>
    </div>
  )
} 