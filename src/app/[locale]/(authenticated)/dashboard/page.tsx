import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { CalendarDays, CheckCircle, Clock, Mail, Shield, User } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }

  const user = session.user

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle. Gerencie sua conta e configurações.
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Informações da Conta */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Informações da Conta
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{user.name || "Usuário"}</div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {user.email}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {user.role || "USER"}
                </Badge>
                {user.emailVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status da Conta */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Status da Conta
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">Ativa</div>
              <div className="text-sm text-muted-foreground">
                Conta criada em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <div className="text-sm text-muted-foreground">
                Último update: {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ações Rápidas
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/profile">
                Editar Perfil
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/security">
                Segurança
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/history">
                Ver Histórico
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seções Detalhadas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Detalhadas */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Conta</CardTitle>
            <CardDescription>
              Informações completas do seu perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-700">Nome</label>
                <p className="text-gray-600">{user.name || "Não informado"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Email</label>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Função</label>
                <p className="text-gray-600">{user.role || "Usuário"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Status</label>
                <p className="text-gray-600">
                  {user.emailVerified ? "Verificado" : "Não verificado"}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button asChild className="w-full">
                <Link href="/dashboard/profile">
                  Editar Informações
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle>Segurança da Conta</CardTitle>
            <CardDescription>
              Mantenha sua conta segura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Senha</span>
                </div>
                <Badge variant="secondary">Configurada</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Email Verificado</span>
                </div>
                <Badge variant={user.emailVerified ? "secondary" : "destructive"}>
                  {user.emailVerified ? "Sim" : "Não"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Último Login</span>
                </div>
                <Badge variant="outline">Agora</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/security">
                  Gerenciar Segurança
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 