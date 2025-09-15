"use client"

import { sendVerificationEmail } from "@/actions/email-verification-actions"
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

export function RequestVerificationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const result = await sendVerificationEmail(email)
    
    if (result.success) {
      setMessage("✅ " + result.message)
      // Redirecionar para página de verificação após 2 segundos
      setTimeout(() => {
        router.push(`/en/verify-code?email=${encodeURIComponent(email)}`)
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
          <CardTitle className="text-xl">Verificação de Email</CardTitle>
          <CardDescription>
            Digite seu email para receber um código de verificação
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                {isLoading ? "Enviando..." : "Enviar Código de Verificação"}
              </Button>
            </div>
            
            <div className="text-center text-sm mt-4">
              Já tem uma conta?{" "}
              <a
                href="/en/sign-in"
                className="underline underline-offset-4 hover:text-blue-600"
              >
                Fazer login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="text-muted text-center text-xs text-balance">
        Enviaremos um código de 6 dígitos para verificar seu email.
      </div>
    </div>
  )
} 