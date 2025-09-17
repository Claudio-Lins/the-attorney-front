import { SignOut } from '@/components/auth/sign-out';
import { HeroSection } from '@/components/sections/hero-section';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animated-container';
import { auth } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

export default async function Home() {
   const session = await auth();
   
   console.log("Session no Home:", JSON.stringify(session, null, 2));
   
  const t = await getTranslations('HomePage');
  
  return (
    <main className="min-h-dvh">
			<Suspense fallback={<div className="min-h-dvh w-full flex items-center justify-center">Loading...</div>}>
				<HeroSection />
			</Suspense>
    </main>
  );
}
