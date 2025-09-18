import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { auth } from './lib/auth';

// Criar o middleware de internacionalização
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma rota protegida (authenticated)
  // Rotas protegidas são aquelas que contêm /(authenticated) na estrutura
  const isProtectedRoute = pathname.match(/^\/[a-z]{2}\/(client|admin)/) || 
                           pathname.includes('/(authenticated)');
  
  if (isProtectedRoute) {
    // Verificar autenticação
    const session = await auth();
    
    if (!session?.user) {
      // Extrair o locale da URL para redirecionar corretamente
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
      
      // Redirecionar para a página de login
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Aplicar middleware de internacionalização
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};