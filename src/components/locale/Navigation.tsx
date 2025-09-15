'use client';

import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '../ui/theme-toggle';
import LocaleSwitcher from './LocaleSwitcher';
import NavigationLink from './NavigationLink';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  // Esconder navegação apenas em páginas de auth
  const hideNavigation = pathname.includes('/sign-in') || 
                         pathname.includes('/sign-up') ||
                         pathname.includes('/forgot-password') ||
                         pathname.includes('/reset-password') ||
                         pathname.includes('/verify-email') ||
                         pathname.includes('/verify-code');

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (hideNavigation) {
    return null;
  }

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border' 
        : 'bg-transparent backdrop-blur-none'
    )}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Links principais */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className={cn(
                'text-xl font-bold transition-colors duration-300',
                isScrolled 
                  ? 'text-foreground hover:text-primary' 
                  : 'text-white hover:text-white/80'
              )}
            >
              Logo
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <NavigationLink 
                href="/" 
                className={cn(
                  'font-medium transition-colors duration-300',
                  isScrolled 
                    ? 'text-foreground/80 hover:text-foreground' 
                    : 'text-white/90 hover:text-white'
                )}
              >
                {t('home')}
              </NavigationLink>
              
              <NavigationLink 
                href="/pathnames" 
                className={cn(
                  'font-medium transition-colors duration-300',
                  isScrolled 
                    ? 'text-foreground/80 hover:text-foreground' 
                    : 'text-white/90 hover:text-white'
                )}
              >
                {t('pathnames')}
              </NavigationLink>
              
              {session?.user && (
                <>
                  <Link 
                    href="/dashboard" 
                    className={cn(
                      'font-medium transition-colors duration-300',
                      isScrolled 
                        ? 'text-primary hover:text-primary/80' 
                        : 'text-blue-200 hover:text-white'
                    )}
                  >
                    {t('dashboard')}
                  </Link>
                  {session.user.role === 'ADMIN' && (
                    <Link 
                      href="/admin" 
                      className={cn(
                        'font-medium transition-colors duration-300',
                        isScrolled 
                          ? 'text-destructive hover:text-destructive/80' 
                          : 'text-red-200 hover:text-white'
                      )}
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Área de autenticação e idioma */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <span className={cn(
                  'hidden sm:inline-block text-sm font-medium transition-colors duration-300',
                  isScrolled 
                    ? 'text-foreground/60' 
                    : 'text-white/80'
                )}>
                  {t('hello')}, {session.user.name || session.user.email}
                </span>
                <Link 
                  href="/dashboard" 
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                    'shadow-md hover:shadow-lg transform hover:scale-105',
                    isScrolled 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                  )}
                >
                  {t('myAccount')}
                </Link>
              </div>
            ) : (
              <Link 
                href="/sign-in" 
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                  'shadow-md hover:shadow-lg transform hover:scale-105',
                  isScrolled 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                )}
              >
                {t('signIn')}
              </Link>
            )}
            
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>

        {/* Menu mobile */}
        <div className="md:hidden border-t border-border/20 pt-4 pb-3">
          <div className="flex flex-col space-y-2">
            <NavigationLink 
              href="/" 
              className={cn(
                'font-medium transition-colors duration-300',
                isScrolled 
                  ? 'text-foreground/80 hover:text-foreground' 
                  : 'text-white/90 hover:text-white'
              )}
            >
              {t('home')}
            </NavigationLink>
            
            <NavigationLink 
              href="/pathnames" 
              className={cn(
                'font-medium transition-colors duration-300',
                isScrolled 
                  ? 'text-foreground/80 hover:text-foreground' 
                  : 'text-white/90 hover:text-white'
              )}
            >
              {t('pathnames')}
            </NavigationLink>
            
            {session?.user && (
              <>
                <Link 
                  href="/dashboard" 
                  className={cn(
                    'font-medium transition-colors duration-300',
                    isScrolled 
                      ? 'text-primary hover:text-primary/80' 
                      : 'text-blue-200 hover:text-white'
                  )}
                >
                  {t('dashboard')}
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    className={cn(
                      'font-medium transition-colors duration-300',
                      isScrolled 
                        ? 'text-destructive hover:text-destructive/80' 
                        : 'text-red-200 hover:text-white'
                    )}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
