"use client"

import { resetPassword } from "@/actions/password-reset-actions"
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
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ResetPasswordFormProps {
  token: string
  className?: string
}

export function ResetPasswordForm({ 
  token, 
  className, 
  ...props 
}: ResetPasswordFormProps & React.ComponentProps<"div">) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    // Validações básicas
    if (password.length < 6) {
      setMessage("❌ A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage("❌ As senhas não coincidem")
      setIsLoading(false)
      return
    }

    const result = await resetPassword(token, password)
    
    if (result.success) {
      setMessage("✅ " + result.message + " Redirecionando para login...")
      setIsSuccess(true)
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        router.push("/en/sign-in?reset=success")
      }, 3000)
    } else {
      setMessage("❌ " + result.message)
    }
    
    setIsLoading(false)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white/40 backdrop-blur-sm rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Redefinir Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="password">Nova Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
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
                  disabled={isLoading || password.length < 6}
                >
                  {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg">
                <div className="text-lg font-medium mb-2">🔒 Senha Redefinida!</div>
                <p className="text-sm">
                  Sua senha foi redefinida com sucesso. Você será redirecionado para o login.
                </p>
              </div>
            </div>
          )}
          
          {!isSuccess && (
            <div className="text-center text-sm mt-6">
              Lembrou da senha?{" "}
              <a
                href="/en/sign-in"
                className="underline underline-offset-4 hover:text-blue-600"
              >
                Voltar ao login
              </a>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-muted text-center text-xs text-balance">
        Sua nova senha deve ter pelo menos 6 caracteres.
      </div>
    </div>
  )
} 