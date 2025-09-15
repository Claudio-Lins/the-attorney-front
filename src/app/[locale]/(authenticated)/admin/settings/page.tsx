import { BackupSection } from '@/components/admin/backup-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Database,
    Globe,
    HardDrive,
    Key,
    Mail,
    Save,
    Server,
    Settings,
    Shield,
    Users
} from 'lucide-react';

// Dados simulados de configurações
const systemConfig = {
  general: {
    siteName: 'My Boilerplate App',
    siteDescription: 'Sistema de autenticação completo com Next.js',
    maintenanceMode: false,
    allowRegistrations: true,
    defaultUserRole: 'USER',
    sessionTimeout: 30,
    maxLoginAttempts: 5
  },
  security: {
    forceHttps: true,
    enableRateLimit: true,
    enable2FA: false,
    enableAuditLogs: true,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    sessionEncryption: true
  },
  email: {
    emailService: 'resend',
    fromEmail: 'noreply@myapp.com',
    fromName: 'My App',
    enableEmailVerification: true,
    enablePasswordReset: true,
    emailTemplateStyle: 'modern'
  },
  database: {
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    enableOptimization: true,
    connectionPoolSize: 10
  }
};

const systemStats = {
  uptime: '15 dias, 4 horas',
  lastBackup: '2024-01-15 03:00:00',
  databaseSize: '142 MB',
  logSize: '23 MB',
  activeConnections: 8,
  memoryUsage: 68,
  cpuUsage: 23,
  diskUsage: 45
};

export default function AdminSettingsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Configurações do Sistema</h1>
        <p className="text-muted-foreground mt-2">
          Configurações globais, segurança e manutenção do sistema
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="database">Banco</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configurações básicas da aplicação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input 
                    id="siteName" 
                    defaultValue={systemConfig.general.siteName}
                    placeholder="Nome da aplicação"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultRole">Role Padrão</Label>
                  <Select defaultValue={systemConfig.general.defaultUserRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Usuário</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrição do Site</Label>
                <Textarea 
                  id="siteDescription" 
                  defaultValue={systemConfig.general.siteDescription}
                  placeholder="Descrição da aplicação"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number"
                    defaultValue={systemConfig.general.sessionTimeout}
                    min={5}
                    max={1440}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Máx. Tentativas de Login</Label>
                  <Input 
                    id="maxLoginAttempts" 
                    type="number"
                    defaultValue={systemConfig.general.maxLoginAttempts}
                    min={3}
                    max={10}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">
                      Bloqueia acesso de novos usuários
                    </p>
                  </div>
                  <Switch defaultChecked={systemConfig.general.maintenanceMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Registros</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite novos cadastros de usuários
                    </p>
                  </div>
                  <Switch defaultChecked={systemConfig.general.allowRegistrations} />
                </div>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Configurações de proteção e autenticação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Comprimento Mínimo da Senha</Label>
                  <Input 
                    id="passwordMinLength" 
                    type="number"
                    defaultValue={systemConfig.security.passwordMinLength}
                    min={6}
                    max={32}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Forçar HTTPS</Label>
                    <p className="text-sm text-muted-foreground">
                      Redireciona automaticamente para HTTPS
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked={systemConfig.security.forceHttps} />
                    <Badge variant="default" className="bg-green-100 text-green-800">Recomendado</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">
                      Protege contra ataques de força bruta
                    </p>
                  </div>
                  <Switch defaultChecked={systemConfig.security.enableRateLimit} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação 2FA</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilita autenticação de dois fatores
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked={systemConfig.security.enable2FA} />
                    <Badge variant="default" className="bg-yellow-100 text-yellow-800">Em Breve</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Logs de Auditoria</Label>
                    <p className="text-sm text-muted-foreground">
                      Registra todas as ações administrativas
                    </p>
                  </div>
                  <Switch defaultChecked={systemConfig.security.enableAuditLogs} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Caracteres Especiais na Senha</Label>
                    <p className="text-sm text-muted-foreground">
                      Exige símbolos especiais nas senhas
                    </p>
                  </div>
                  <Switch defaultChecked={systemConfig.security.passwordRequireSpecial} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Criptografia de Sessão</Label>
                    <p className="text-sm text-muted-foreground">
                      Criptografa dados de sessão
                    </p>
                  </div>
                  <Switch defaultChecked={systemConfig.security.sessionEncryption} />
                </div>
              </div>

              <Button>
                <Shield className="h-4 w-4 mr-2" />
                Salvar Configurações de Segurança
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
              <CardDescription>Configurações do serviço de email e templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emailService">Serviço de Email</Label>
                  <Select defaultValue={systemConfig.email.emailService}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resend">Resend</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="ses">Amazon SES</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateStyle">Estilo do Template</Label>
                  <Select defaultValue={systemConfig.email.emailTemplateStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Moderno</SelectItem>
                      <SelectItem value="classic">Clássico</SelectItem>
                      <SelectItem value="minimal">Minimalista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">Email Remetente</Label>
                  <Input 
                    id="fromEmail" 
                    type="email"
                    defaultValue={systemConfig.email.fromEmail}
                    placeholder="noreply@seudominio.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">Nome Remetente</Label>
                  <Input 
                    id="fromName" 
                    defaultValue={systemConfig.email.fromName}
                    placeholder="Nome da Empresa"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Verificação de Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Envia email de confirmação no cadastro
                    </p>
                  </div>
                  <Switch defaultChecked={systemConfig.email.enableEmailVerification} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reset de Senha</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite reset de senha por email
                    </p>
                  </div>
                  <Switch defaultChecked={systemConfig.email.enablePasswordReset} />
                </div>
              </div>

              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Salvar Configurações de Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <BackupSection />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          {/* Status do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
              <CardDescription>Monitoramento em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Uptime</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-2">{systemStats.uptime}</p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Uso de Disco</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{systemStats.diskUsage}%</p>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Server className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium">CPU</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">{systemStats.cpuUsage}%</p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Conexões</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mt-2">{systemStats.activeConnections}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Último Backup</span>
                  <span className="text-sm text-muted-foreground">{systemStats.lastBackup}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tamanho do Banco</span>
                  <span className="text-sm text-muted-foreground">{systemStats.databaseSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tamanho dos Logs</span>
                  <span className="text-sm text-muted-foreground">{systemStats.logSize}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações de Manutenção */}
          <Card>
            <CardHeader>
              <CardTitle>Manutenção do Sistema</CardTitle>
              <CardDescription>Ações de limpeza e otimização</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Limpar Logs Antigos
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Otimizar Performance
                </Button>
                <Button variant="outline">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Verificar Integridade
                </Button>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Reiniciar Sistema
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 