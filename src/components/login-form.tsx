
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
import { AlertCircle, Clock } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useState } from "react";
import { GoogleSignIn } from "./auth/google-sign-in";

export function LoginForm({
  className,  
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations('auth.signIn');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState<{ blocked: boolean; duration?: number } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setRateLimited(null);

    try {
      const result = await signInWithCredentials(formData);
      
      if (!result.success) {
        setIsLoading(false);
        
        // Verificar se é erro de rate limiting
        if ('rateLimited' in result && result.rateLimited) {
          const duration = (result as any).blockDuration || 30;
          setRateLimited({ blocked: true, duration });
        } else {
          setError(result.message || "Erro no login");
        }
      }
      // Se sucesso, o NextAuth vai redirecionar automaticamente
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Erro no login");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white/40 backdrop-blur-sm rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <GoogleSignIn />
          
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
          
          <form className='mt-4' action={handleSubmit}>
            <div className="grid gap-6">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-white/80 backdrop-blur-sm rounded-lg text-muted-foreground relative z-10 px-2">
                  {t('or')}
                </span>
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
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t('labelPassword')}</Label>
                    <a
                      href="/en/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline text-blue-600"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || rateLimited?.blocked}>
                  {isLoading ? "Entrando..." : t('buttonSignIn')}
                </Button>
              </div>
              <div className="text-center text-sm">
                {t('dontHaveAccount')}
                <a href="/en/sign-up" className="underline underline-offset-4">
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
