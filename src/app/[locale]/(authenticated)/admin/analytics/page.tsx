import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  BarChart3,
  Clock,
  Globe,
  Smartphone,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users
} from 'lucide-react';

// Dados simulados para demonstração
const analyticsData = {
  userGrowth: [
    { month: 'Jan', users: 12, newUsers: 8 },
    { month: 'Fev', users: 19, newUsers: 15 },
    { month: 'Mar', users: 27, newUsers: 12 },
    { month: 'Abr', users: 35, newUsers: 18 },
    { month: 'Mai', users: 47, newUsers: 22 },
    { month: 'Jun', users: 58, newUsers: 25 },
  ],
  loginMethods: [
    { method: 'Email/Senha', count: 42, percentage: 72 },
    { method: 'Google', count: 12, percentage: 21 },
    { method: 'Apple', count: 4, percentage: 7 },
  ],
  deviceStats: [
    { device: 'Desktop', count: 35, percentage: 60 },
    { device: 'Mobile', count: 18, percentage: 31 },
    { device: 'Tablet', count: 5, percentage: 9 },
  ],
  timeRanges: [
    { range: '0-6h', users: 8, percentage: 14 },
    { range: '6-12h', users: 15, percentage: 26 },
    { range: '12-18h', users: 22, percentage: 38 },
    { range: '18-24h', users: 13, percentage: 22 },
  ],
  conversionRates: {
    signupToActive: 78,
    emailVerification: 92,
    profileCompletion: 65,
    retentionRate: 84,
  }
};

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics & Métricas</h1>
        <p className="text-muted-foreground mt-2">
          Análise detalhada do uso do sistema e comportamento dos usuários
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="conversion">Conversão</TabsTrigger>
          <TabsTrigger value="behavior">Comportamento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">58</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +23% desde o mês passado
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Novos Usuários</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% desde o mês passado
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -5% desde o mês passado
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">84%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% desde o mês passado
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Crescimento */}
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Usuários</CardTitle>
              <CardDescription>Evolução mensal de usuários nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <div className="grid grid-cols-6 gap-4 h-full items-end">
                  {analyticsData.userGrowth.map((data, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-primary/20 rounded-t-lg mb-2 relative" style={{ height: `${(data.users / 60) * 100}%` }}>
                        <div className="absolute top-0 left-0 w-full bg-primary rounded-t-lg" style={{ height: `${(data.newUsers / data.users) * 100}%` }}></div>
                        <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">{data.users}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {/* Métodos de Login */}
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Login</CardTitle>
              <CardDescription>Preferências de autenticação dos usuários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.loginMethods.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="font-medium">{method.method}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={method.percentage} className="w-24" />
                    <span className="text-sm text-muted-foreground">{method.count} ({method.percentage}%)</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dispositivos */}
          <Card>
            <CardHeader>
              <CardTitle>Dispositivos Utilizados</CardTitle>
              <CardDescription>Distribuição por tipo de dispositivo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.deviceStats.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {device.device === 'Desktop' && <Globe className="h-4 w-4 text-muted-foreground" />}
                    {device.device === 'Mobile' && <Smartphone className="h-4 w-4 text-muted-foreground" />}
                    {device.device === 'Tablet' && <Smartphone className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-medium">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress value={device.percentage} className="w-24" />
                    <span className="text-sm text-muted-foreground">{device.count} ({device.percentage}%)</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          {/* Taxas de Conversão */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão</CardTitle>
                <CardDescription>Cadastro para usuário ativo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analyticsData.conversionRates.signupToActive}%
                </div>
                <Progress value={analyticsData.conversionRates.signupToActive} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  Taxa considerada excelente (meta: 70%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verificação de Email</CardTitle>
                <CardDescription>Usuários que confirmaram email</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analyticsData.conversionRates.emailVerification}%
                </div>
                <Progress value={analyticsData.conversionRates.emailVerification} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  Excelente taxa de verificação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Perfil Completo</CardTitle>
                <CardDescription>Usuários com perfil 100% preenchido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {analyticsData.conversionRates.profileCompletion}%
                </div>
                <Progress value={analyticsData.conversionRates.profileCompletion} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  Pode ser melhorado (meta: 80%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retenção 30 dias</CardTitle>
                <CardDescription>Usuários ativos após 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analyticsData.conversionRates.retentionRate}%
                </div>
                <Progress value={analyticsData.conversionRates.retentionRate} className="mb-2" />
                <p className="text-xs text-muted-foreground">
                  Excelente retenção de usuários
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          {/* Horários de Uso */}
          <Card>
            <CardHeader>
              <CardTitle>Horários de Maior Uso</CardTitle>
              <CardDescription>Distribuição de logins por horário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.timeRanges.map((range, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{range.range}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={range.percentage} className="w-32" />
                      <span className="text-sm text-muted-foreground">{range.users} usuários ({range.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights Importantes</CardTitle>
              <CardDescription>Análises automáticas do comportamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">Insight</Badge>
                  <span className="font-medium">Pico de Atividade</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  O horário de maior atividade é entre 12h-18h (38% dos usuários). 
                  Considere agendar manutenções fora deste período.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">Oportunidade</Badge>
                  <span className="font-medium">Perfil Incompleto</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  35% dos usuários não completaram o perfil. Implementar lembretes 
                  pode aumentar a taxa de conversão.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">Alerta</Badge>
                  <span className="font-medium">Redução de Usuários Ativos</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Houve uma redução de 5% nos usuários ativos. Investigar possíveis 
                  causas e implementar estratégias de re-engajamento.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 