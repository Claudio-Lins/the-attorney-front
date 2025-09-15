import { getUserData } from "@/actions/user-actions"
import { PasswordForm } from "@/components/dashboard/password-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, Key, Lock, Shield } from "lucide-react"
import { redirect } from "next/navigation"

export default async function SecurityPage() {
  const user = await getUserData()
  
  if (!user) {
    redirect('/en/sign-in')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Segurança da Conta</h1>
        <p className="text-muted-foreground">
          Gerencie a segurança da sua conta e configurações de autenticação.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Status de Segurança
            </CardTitle>
            <CardDescription>
              Verificação das medidas de segurança ativas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Email Verificado */}
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  {user.emailVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                  )}
                  <div>
                    <p className="font-medium text-sm">Email Verificado</p>
                    <p className="text-xs text-muted-foreground">
                      {user.emailVerified 
                        ? `Verificado em ${new Date(user.emailVerified).toLocaleDateString('pt-BR')}`
                        : "Email ainda não verificado"
                      }
                    </p>
                  </div>
                </div>
                <Badge variant={user.emailVerified ? "secondary" : "destructive"}>
                  {user.emailVerified ? "Ativo" : "Pendente"}
                </Badge>
              </div>

              {/* Senha */}
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Senha</p>
                    <p className="text-xs text-muted-foreground">
                      Senha forte configurada
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Ativo</Badge>
              </div>

              {/* Última Atualização */}
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Última Atualização</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Info</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Mantenha sua conta segura com uma senha forte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Segurança */}
      <div className="space-y-4">
        {!user.emailVerified && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              Seu email não está verificado. Isso pode comprometer a segurança da sua conta.
            </AlertDescription>
          </Alert>
        )}
        
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Dicas de Segurança:</strong>
            <ul className="mt-2 list-disc list-inside text-sm space-y-1">
              <li>Use uma senha única e forte para esta conta</li>
              <li>Não compartilhe suas credenciais com ninguém</li>
              <li>Sempre faça logout em computadores públicos</li>
              <li>Verifique regularmente a atividade da sua conta</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>
            Detalhes importantes sobre sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-700">ID da Conta</label>
              <p className="text-gray-600 font-mono text-xs">{user.id}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Tipo de Conta</label>
              <p className="text-gray-600">{user.role || "Usuário Padrão"}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Criada em</label>
              <p className="text-gray-600">
                {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <label className="font-medium text-gray-700">Última Modificação</label>
              <p className="text-gray-600">
                {new Date(user.updatedAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 