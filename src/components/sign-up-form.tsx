import { signUp } from "@/actions/sign-up-actions";
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
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import logo from "@assets/the-attorney-logo.svg";
import { Loader2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Separator } from "./ui/separator";

interface SignUpFormProps extends React.ComponentProps<"div"> {
  passportNumber?: string | undefined;
  email?: string;
}

export async function SignUpForm({
  className,
  passportNumber,
  email,
  ...props
}: SignUpFormProps) {
  const session = await auth()
  if (session) {
    redirect("/")
  }
  const locale = await getLocale();
  

  const t = await getTranslations('auth.signUp');
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
          <form action={async (formData: FormData) => {
            "use server"
            const res = await signUp(formData)
            console.log("Resultado da criação:", res)
            if (res.success && res.email) {
              redirect(`/en/verify-code?email=${encodeURIComponent(res.email)}`)
            } else {
              console.log("Erro ao criar usuário:", res.message)
              // Aqui você pode mostrar o erro na UI se necessário
            }
          }}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">{t('labelFullName')}</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder={t('placeholderFullName')}
                    required
                    className="text-foreground placeholder:text-muted/50"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">{t('labelEmail')}</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    defaultValue={email}
                    readOnly={!!email}
                    className="text-foreground placeholder:text-muted/50"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">{t('labelPassword')}</Label>
                  <Input id="password" type="password" name="password" required />
                </div>
                {passportNumber && (
                  <input type="hidden" name="passportNumber" value={passportNumber} />
                )}
                <Button type="submit" className="w-full" >
                  
                   {t('buttonSignUp')}
                </Button>
              </div>
              <div className="text-center text-sm">
                {t('alreadyHaveAccount')}
                <a href={`/${locale}/sign-in`} className="underline underline-offset-4 text-foreground hover:text-primary ml-2">
                  {t('linkSignIn')}
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t('termsOfService')} <a href="/terms-of-service" className="underline underline-offset-4">{t('linkTermsOfService')}</a>{" "}
        {t('and')} <a href="/privacy-policy" className="underline underline-offset-4">{t('linkPrivacyPolicy')}</a>.
      </div>
    </div>
  )
}