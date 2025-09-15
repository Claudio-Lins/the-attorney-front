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
import { useState } from "react"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

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
          <CardTitle className="text-xl">Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Digite seu email para receber as instruções de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
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
                  {isLoading ? "Enviando..." : "Enviar Instruções"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg">
                <div className="text-lg font-medium mb-2">📧 Email Enviado!</div>
                <p className="text-sm">
                  Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Não esquece de verificar sua pasta de spam também!
              </p>
            </div>
          )}
          
          <div className="text-center text-sm mt-6">
            Lembrou da senha?{" "}
            <a
              href="/en/sign-in"
              className="underline underline-offset-4 hover:text-blue-600"
            >
              Voltar ao login
            </a>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-muted text-center text-xs text-balance">
        Enviaremos um link seguro para redefinir sua senha.
      </div>
    </div>
  )
} 