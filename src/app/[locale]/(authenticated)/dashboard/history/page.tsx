import { getUserData } from "@/actions/user-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Globe, History, MapPin, Monitor, RefreshCw, Smartphone } from "lucide-react"
import { redirect } from "next/navigation"

// Simulação de dados de histórico (em uma implementação real, viria do banco de dados)
const mockHistory = [
  {
    id: 1,
    action: "Login",
    timestamp: new Date(),
    ip: "192.168.1.1",
    device: "Chrome - Windows",
    location: "São Paulo, SP",
    status: "success"
  },
  {
    id: 2,
    action: "Atualização de perfil",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    ip: "192.168.1.1",
    device: "Safari - iPhone",
    location: "São Paulo, SP",
    status: "success"
  },
  {
    id: 3,
    action: "Login",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    ip: "192.168.1.15",
    device: "Firefox - macOS",
    location: "Rio de Janeiro, RJ",
    status: "success"
  },
  {
    id: 4,
    action: "Login falhado",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    ip: "10.0.0.1",
    device: "Chrome - Android",
    location: "Belo Horizonte, MG",
    status: "failed"
  },
  {
    id: 5,
    action: "Alteração de senha",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ip: "192.168.1.1",
    device: "Edge - Windows",
    location: "São Paulo, SP",
    status: "success"
  }
]

function getDeviceIcon(device: string) {
  if (device.includes('iPhone') || device.includes('Android')) {
    return <Smartphone className="h-4 w-4" />
  }
  return <Monitor className="h-4 w-4" />
}

function getActionColor(action: string, status: string) {
  if (status === 'failed') return 'destructive'
  if (action.includes('Login')) return 'default'
  if (action.includes('senha')) return 'secondary'
  return 'outline'
}

export default async function HistoryPage() {
  const user = await getUserData()
  
  if (!user) {
    redirect('/en/sign-in')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Histórico de Atividades</h1>
        <p className="text-muted-foreground">
          Visualize o histórico de logins e atividades da sua conta.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Estatísticas Rápidas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Logins
            </CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockHistory.filter(h => h.action.includes('Login') && h.status === 'success').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tentativas Falhadas
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockHistory.filter(h => h.status === 'failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Último Acesso
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Agora</div>
            <p className="text-xs text-muted-foreground">
              São Paulo, SP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Atividades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Histórico detalhado das suas últimas atividades
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHistory.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getDeviceIcon(activity.device)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <Badge variant={getActionColor(activity.action, activity.status) as any}>
                        {activity.status === 'success' ? 'Sucesso' : 'Falhado'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {activity.timestamp.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3" />
                        <span>{activity.ip}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-xs text-gray-500">{activity.device}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ações */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando as últimas 5 atividades
              </p>
              <Button variant="outline" size="sm">
                Ver Histórico Completo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Segurança */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">
            🔒 Dicas de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Monitore regularmente o histórico de atividades da sua conta</p>
            <p>• Reporte imediatamente qualquer atividade suspeita</p>
            <p>• Use sempre computadores e redes confiáveis para acessar sua conta</p>
            <p>• Se você não reconhece alguma atividade, altere sua senha imediatamente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 