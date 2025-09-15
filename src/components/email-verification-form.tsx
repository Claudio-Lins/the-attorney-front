"use client"

import { verifyEmailCode } from "@/actions/email-verification-actions"
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

interface EmailVerificationFormProps {
  email: string
  className?: string
}

export function EmailVerificationForm({ 
  email, 
  className, 
  ...props 
}: EmailVerificationFormProps & React.ComponentProps<"div">) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const result = await verifyEmailCode(email, code)
    
    if (result.success) {
      setMessage("✅ " + result.message + " Redirecionando para login...")
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push(`/en/sign-in?verified=true`)
      }, 2000)
    } else {
      setMessage("❌ " + result.message)
    }
    
    setIsLoading(false)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white/40 backdrop-blur-sm rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verificar Email</CardTitle>
          <CardDescription>
            Digite o código de verificação enviado para<br />
            <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="code">Código de Verificação</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                  required
                  className="text-center text-lg tracking-widest font-mono"
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
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? "Verificando..." : "Verificar Código"}
              </Button>
            </div>
            
            <div className="text-center text-sm mt-4">
              Não recebeu o código?{" "}
              <button
                type="button"
                onClick={() => router.push("/en/verify-email")}
                className="underline underline-offset-4 hover:text-blue-600"
              >
                Enviar novamente
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="text-muted text-center text-xs text-balance">
        Por favor, verifique também sua pasta de spam.
      </div>
    </div>
  )
} 