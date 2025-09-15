import { getUserData } from "@/actions/user-actions"
import { SettingsForm } from "@/components/dashboard/settings-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Download, Globe, Info, Palette, Settings, Shield, Trash2 } from "lucide-react"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const user = await getUserData()
  
  if (!user) {
    redirect('/en/sign-in')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize sua experiência e gerencie preferências da conta.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Configurações de Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a interface do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Tema</p>
                  <p className="text-xs text-muted-foreground">
                    Escolha entre claro, escuro ou automático
                  </p>
                </div>
                <Badge variant="outline">Claro</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Idioma</p>
                  <p className="text-xs text-muted-foreground">
                    Idioma da interface
                  </p>
                </div>
                <Badge variant="outline">Português</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Animações</p>
                  <p className="text-xs text-muted-foreground">
                    Efeitos visuais e transições
                  </p>
                </div>
                <Badge variant="secondary">Ativado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Notificação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Gerencie como você recebe notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email de Segurança</p>
                  <p className="text-xs text-muted-foreground">
                    Alterações na conta e logins suspeitos
                  </p>
                </div>
                <Badge variant="secondary">Ativo</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Newsletter</p>
                  <p className="text-xs text-muted-foreground">
                    Novidades e atualizações do sistema
                  </p>
                </div>
                <Badge variant="outline">Inativo</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Resumo Semanal</p>
                  <p className="text-xs text-muted-foreground">
                    Atividade da conta nos últimos 7 dias
                  </p>
                </div>
                <Badge variant="outline">Inativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações Avançadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Avançadas
          </CardTitle>
          <CardDescription>
            Opções avançadas e personalização detalhada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm user={user} />
        </CardContent>
      </Card>

      {/* Privacidade e Dados */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacidade
            </CardTitle>
            <CardDescription>
              Controle sobre seus dados pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Perfil Público</p>
                  <p className="text-xs text-muted-foreground">
                    Permitir que outros usuários vejam seu perfil
                  </p>
                </div>
                <Badge variant="outline">Privado</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Coleta de Dados</p>
                  <p className="text-xs text-muted-foreground">
                    Analytics e melhorias de experiência
                  </p>
                </div>
                <Badge variant="secondary">Autorizado</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Cookies</p>
                  <p className="text-xs text-muted-foreground">
                    Apenas essenciais para funcionamento
                  </p>
                </div>
                <Badge variant="secondary">Ativo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Dados da Conta
            </CardTitle>
            <CardDescription>
              Exportar ou gerenciar seus dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Exportar Dados</p>
                  <p className="text-xs text-muted-foreground">
                    Baixar cópia de todos os seus dados
                  </p>
                </div>
                <Badge variant="outline">Disponível</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Backup Automático</p>
                  <p className="text-xs text-muted-foreground">
                    Backup mensal dos dados importantes
                  </p>
                </div>
                <Badge variant="secondary">Ativo</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Tempo de Retenção</p>
                  <p className="text-xs text-muted-foreground">
                    Dados mantidos por 2 anos após inatividade
                  </p>
                </div>
                <Badge variant="outline">2 anos</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zona de Perigo */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Trash2 className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription className="text-red-700">
            Ações irreversíveis que afetam permanentemente sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Atenção:</strong> As ações abaixo são permanentes e não podem ser desfeitas.
              Certifique-se de fazer backup dos seus dados antes de prosseguir.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-red-200">
              <div>
                <p className="font-medium text-sm text-red-800">Deletar Conta</p>
                <p className="text-xs text-red-600">
                  Remove permanentemente sua conta e todos os dados associados
                </p>
              </div>
              <Badge variant="destructive">Irreversível</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-red-200">
              <div>
                <p className="font-medium text-sm text-red-800">Limpar Histórico</p>
                <p className="text-xs text-red-600">
                  Remove todo o histórico de atividades e logins
                </p>
              </div>
              <Badge variant="destructive">Permanente</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">
            ℹ️ Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <label className="font-medium">Versão do Sistema</label>
              <p>v2.1.0</p>
            </div>
            <div>
              <label className="font-medium">Última Atualização</label>
              <p>15 de Dezembro, 2024</p>
            </div>
            <div>
              <label className="font-medium">Região do Servidor</label>
              <p>São Paulo, Brasil</p>
            </div>
            <div>
              <label className="font-medium">Uptime</label>
              <p>99.9% (últimos 30 dias)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 