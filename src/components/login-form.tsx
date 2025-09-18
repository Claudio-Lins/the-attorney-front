
'use client'

import { signInWithCredentials } from "@/actions/auth-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import logo from "@assets/the-attorney-logo.svg";
import { AlertCircle, Clock, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from 'next-intl';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "./ui/separator";

export function LoginForm({
  className,  
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations('auth.signIn');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState<{ blocked: boolean; duration?: number } | null>(null);

  const locale = useLocale();
  
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setRateLimited(null);

    try {
      const result = await signInWithCredentials(formData);
      
      if (result.success) {
        // Aguardar um pouco para garantir que a sessão foi criada
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Obter a sessão atualizada
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        
        if (session?.user?.role) {
          // Redirecionar baseado no papel do usuário
          if (session.user.role === 'ADMIN') {
            window.location.href = `/${locale}/admin/dashboard`;
          } else if (session.user.role === 'USER') {
            window.location.href = `/${locale}/client/dashboard`;
          } else {
            // Fallback para role desconhecido
            window.location.href = `/${locale}/client/dashboard`;
          }
        } else {
          // Fallback se não conseguir obter o role
          window.location.href = `/${locale}/client/dashboard`;
        }
        return; // Stop execution to allow the redirect to happen
      }

      // Handle failure cases
      setIsLoading(false);
      if ('rateLimited' in result && result.rateLimited) {
        const duration = (result as any).blockDuration || 30;
        setRateLimited({ blocked: true, duration });
      } else {
        setError(result.message || "Erro no login");
      }

    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Erro no login");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white/40 backdrop-blur-sm rounded-lg">
        <CardHeader className="text-center">
          <Link href={`/${locale}`}>
						<Image
							className="h-auto w-60 cursor-pointer object-contain md:w-40 mb-4 mx-auto"
							src={logo}
							alt="The Attorney Logo"
							width={300}
							height={50}
							priority
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					</Link>
					<Separator className="my-4" />
          <CardTitle className="text-xl">{t('title')}</CardTitle>
          <CardDescription className="text-center text-balance text-sm text-foreground">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          {/* <GoogleSignIn /> */}
          
          {/* Mensagens de erro */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Mensagens de rate limiting */}
          {rateLimited?.blocked && (
            <Alert variant="destructive" className="mt-4">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Muitas tentativas de login. Tente novamente em {rateLimited.duration} minutos.
              </AlertDescription>
            </Alert>
          )}
          
          <form action={handleSubmit}>
            <div className="grid gap-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center ">
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">{t('labelEmail')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="text-foreground placeholder:text-muted/50"
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t('labelPassword')}</Label>
                    <a
                      href={`/${locale}/forgot-password`}
                      className="ml-auto text-sm underline-offset-4 hover:underline text-foreground"
                    >
                      {t('forgotPassword')}
                    </a>
                  </div>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || rateLimited?.blocked}>
                  {isLoading ? 
                    <Loader2 className="h-4 w-4 animate-spin" />
                  : t('buttonSignIn')} 
                </Button>
              </div>
              <div className="text-center text-sm">
                {t('dontHaveAccount')}
                <a href={`/${locale}/sign-up`} className="underline underline-offset-4 text-foreground hover:text-primary ml-2">
                  {t('linkSignUp')}
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t('termsOfService')} <a href="#">{t('linkTermsOfService')}</a>{" "}
        {t('and')} <a href="#">{t('linkPrivacyPolicy')}</a>.
      </div>
    </div>
  )
}
