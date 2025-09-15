'use client'

import { updateProfile } from "@/actions/user-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"

interface ProfileFormProps {
  user: {
    id: string
    name: string | null
    email: string
    role: string | null
    emailVerified: Date | null
    createdAt: Date
    updatedAt: Date
    image: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', content: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await updateProfile(formData)
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          content: result.emailChanged 
            ? "Perfil atualizado! Verifique seu novo email." 
            : result.message 
        })
      } else {
        setMessage({ type: 'error', content: result.message })
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        content: error.message || "Erro ao atualizar perfil" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Mensagens de feedback */}
      {message && (
        <Alert variant={message.type === 'error' ? "destructive" : "default"}>
          {message.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertDescription>{message.content}</AlertDescription>
        </Alert>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name || ""}
            placeholder="Seu nome completo"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            placeholder="seu@email.com"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Se alterar o email, você precisará verificá-lo novamente.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  )
} 