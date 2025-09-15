import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    FileText,
    Filter,
    Key,
    Mail,
    Search,
    Shield,
    User,
    XCircle
} from 'lucide-react';

// Dados simulados de logs
const logsData = {
  security: [
    {
      id: 1,
      timestamp: '2024-01-15 14:30:25',
      level: 'warning',
      event: 'Login Failed',
      user: 'user@example.com',
      ip: '192.168.1.100',
      details: 'Senha incorreta - 3ª tentativa',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:25:10',
      level: 'success',
      event: 'Login Success',
      user: 'admin@example.com',
      ip: '192.168.1.50',
      details: 'Login bem-sucedido',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:20:15',
      level: 'info',
      event: 'Password Reset',
      user: 'user2@example.com',
      ip: '192.168.1.75',
      details: 'Solicitação de reset de senha',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:15:30',
      level: 'error',
      event: 'Account Locked',
      user: 'suspicious@example.com',
      ip: '10.0.0.1',
      details: 'Conta bloqueada após 5 tentativas de login',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    }
  ],
  system: [
    {
      id: 1,
      timestamp: '2024-01-15 15:00:00',
      level: 'info',
      event: 'Database Backup',
      service: 'Database',
      details: 'Backup automático executado com sucesso',
      duration: '2.3s'
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:55:12',
      level: 'warning',
      event: 'High Memory Usage',
      service: 'Server',
      details: 'Uso de memória acima de 80%',
      duration: '-'
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:30:45',
      level: 'success',
      event: 'Email Sent',
      service: 'Email Service',
      details: 'Email de verificação enviado',
      duration: '1.1s'
    }
  ],
  audit: [
    {
      id: 1,
      timestamp: '2024-01-15 15:30:00',
      level: 'info',
      event: 'User Created',
      admin: 'admin@example.com',
      target: 'newuser@example.com',
      action: 'CREATE_USER',
      details: 'Novo usuário criado pelo admin'
    },
    {
      id: 2,
      timestamp: '2024-01-15 15:25:15',
      level: 'warning',
      event: 'User Role Changed',
      admin: 'admin@example.com',
      target: 'user@example.com',
      action: 'CHANGE_ROLE',
      details: 'Role alterado de USER para ADMIN'
    },
    {
      id: 3,
      timestamp: '2024-01-15 15:20:30',
      level: 'error',
      event: 'User Deleted',
      admin: 'admin@example.com',
      target: 'olduser@example.com',
      action: 'DELETE_USER',
      details: 'Usuário removido do sistema'
    }
  ]
};

function getLevelIcon(level: string) {
  switch (level) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Activity className="h-4 w-4 text-blue-600" />;
  }
}

function getLevelBadge(level: string) {
  switch (level) {
    case 'success':
      return <Badge variant="default" className="bg-green-100 text-green-800">Sucesso</Badge>;
    case 'warning':
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Aviso</Badge>;
    case 'error':
      return <Badge variant="default" className="bg-red-100 text-red-800">Erro</Badge>;
    default:
      return <Badge variant="default" className="bg-blue-100 text-blue-800">Info</Badge>;
  }
}

export default function AdminLogsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Logs do Sistema</h1>
        <p className="text-muted-foreground mt-2">
          Monitoramento de atividades, segurança e auditoria
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar logs..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="today">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Segurança</CardTitle>
              <CardDescription>Tentativas de login, autenticação e eventos de segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logsData.security.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getLevelIcon(log.level)}
                        <span className="font-medium">{log.event}</span>
                        {getLevelBadge(log.level)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>{log.user}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span>{log.ip}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-3 w-3 text-muted-foreground" />
                        <span>{log.details}</span>
                      </div>
                    </div>
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer">User Agent</summary>
                      <p className="mt-1 pl-4">{log.userAgent}</p>
                    </details>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs do Sistema</CardTitle>
              <CardDescription>Eventos do servidor, banco de dados e serviços</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logsData.system.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getLevelIcon(log.level)}
                        <span className="font-medium">{log.event}</span>
                        {getLevelBadge(log.level)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span>{log.service}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-3 w-3 text-muted-foreground" />
                        <span>{log.details}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>Duração: {log.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
              <CardDescription>Ações administrativas e alterações no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logsData.audit.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getLevelIcon(log.level)}
                        <span className="font-medium">{log.event}</span>
                        {getLevelBadge(log.level)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {log.timestamp}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span>Admin: {log.admin}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span>Alvo: {log.target}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Key className="h-3 w-3 text-muted-foreground" />
                        <span>Ação: {log.action}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Activity className="h-3 w-3 inline mr-1" />
                      {log.details}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 