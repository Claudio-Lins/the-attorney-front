import { AboutSection } from '@/components/sections/about-section';
import { HeroSection } from '@/components/sections/hero-section';
import { Services } from '@/components/sections/services';
import { Suspense } from 'react';

export default async function Home() {
  
  return (
    <main className="min-h-dvh">
			<Suspense fallback={<div className=" w-full flex items-center justify-center">Loading...</div>}>
				<HeroSection />
      </Suspense>
      <Suspense fallback={<div className="w-full flex items-center justify-center">Loading...</div>}>
				<AboutSection />
      </Suspense>
      <Suspense fallback={<div className=" w-full flex items-center justify-center">Loading...</div>}>
				<Services />
			</Suspense>
    </main>
  );
}
