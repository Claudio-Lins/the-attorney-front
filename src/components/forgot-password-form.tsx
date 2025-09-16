"use client"

import { sendPasswordResetEmail } from "@/actions/password-reset-actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations('auth.forgotPassword');
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const locale = useLocale();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const result = await sendPasswordResetEmail(email)
    
    if (result.success) {
      setMessage("✅ " + result.message)
      setIsSuccess(true)
    } else {
      setMessage("❌ " + result.message)
    }
    
    setIsLoading(false)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white/40 backdrop-blur-sm rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('title')}</CardTitle>
          <CardDescription className="text-center text-balance text-sm text-foreground">
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">{t('labelEmail')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('placeholderEmail')}
                    required
                  />
                </div>
                
                {message && (
                  <div className={cn(
                    "text-center text-sm p-3 rounded-lg",
                    message.startsWith("✅") 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  )}>
                    {message}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 
                    <Loader2 className="h-4 w-4 animate-spin" />
                  : t('buttonSendInstructions')}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="text-lg font-medium mb-2 text-center text-green-700">📧 {t('sentEmail')}</div>
                <p className="text-sm text-center text-foreground">
                  {t('descriptionSentEmail')}
                </p>
              </div>
              <p className="text-sm text-foreground">
                {t('description')}
              </p>
            </div>
          )}
          
          <div className="text-center text-sm mt-6">
            {t('alreadyHaveAccount')} {" "}
            <a
              href={`/${locale}/sign-in`}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {t('linkSignIn')}
            </a>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-muted text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t('description')}
      </div>
    </div>
  )
} 