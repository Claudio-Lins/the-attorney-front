'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import clsx from 'clsx';
import { Locale } from 'next-intl';
import { useParams } from 'next/navigation';
import { ChangeEvent, ReactNode, useEffect, useState, useTransition } from 'react';

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  return (
    <label
      className={clsx(
        'relative transition-colors duration-300 cursor-pointer',
        isScrolled ? 'text-foreground/60' : 'text-foreground/80',
        isPending && 'transition-opacity [&:disabled]:opacity-30',
        pathname.includes('dashboard') && 'text-black',
        pathname.includes('admin') && 'text-black',
        pathname.includes('profile') && 'text-black',
        pathname.includes('power-attorney') && 'text-black',
        pathname.includes('documents') && 'text-black',
        pathname.includes('privacy-policy') && 'text-black',
      )}
    >
      <p className="sr-only">{label}</p>
      <select
        className={clsx(
          'inline-flex appearance-none bg-transparent py-2 pl-3 pr-8 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer',
          'hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ring',
          isScrolled 
            ? 'text-foreground/60 hover:text-foreground hover:bg-accent focus:bg-accent' 
            : 'text-background hover:text-foreground',
          pathname.includes('dashboard') && 'text-black',
          pathname.includes('admin') && 'text-black',
          pathname.includes('profile') && 'text-black',
          pathname.includes('power-attorney') && 'text-black',
          pathname.includes('documents') && 'text-black',
          pathname.includes('privacy-policy') && 'text-black',
        )}
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
      <span className={clsx(
        'pointer-events-none absolute right-2 top-[10px] transition-colors duration-300',
        isScrolled ? 'text-foreground/40' : 'text-white/60'
      )}>
        {/* <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg> */}
      </span>
    </label>
  );
}
