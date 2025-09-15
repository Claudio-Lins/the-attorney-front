import { getUserData } from "@/actions/user-actions"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, CheckCircle, Mail, User, X } from "lucide-react"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const user = await getUserData()
  
  if (!user) {
    redirect('/en/sign-in')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e configurações de conta.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Atuais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Atuais
            </CardTitle>
            <CardDescription>
              Suas informações cadastradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user.name || "Não informado"}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-900">{user.email}</p>
                  {user.emailVerified ? (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verificado
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      <X className="h-3 w-3 mr-1" />
                      Não verificado
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Função</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user.role || "Usuário"}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Membro desde</label>
                <div className="flex items-center gap-1 mt-1">
                  <CalendarDays className="h-3 w-3 text-gray-500" />
                  <p className="text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Edição */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Editar Informações
            </CardTitle>
            <CardDescription>
              Atualize seu nome e email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>
      </div>

      {/* Alertas importantes */}
      {!user.emailVerified && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 text-lg">
              Email não verificado
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Seu email ainda não foi verificado. Algumas funcionalidades podem estar limitadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700">
              Verifique sua caixa de entrada e spam para o email de verificação, ou solicite um novo código.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 