import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animated-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { prisma } from '@/lib/prisma';
import {
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Shield,
    TrendingUp,
    UserPlus,
    Users
} from 'lucide-react';
import Link from 'next/link';

async function getAdminMetrics() {
  try {
    const [
      totalUsers,
      totalAdmins,
      recentUsers,
      todayUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: { role: 'ADMIN' }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
          }
        }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)) // Hoje
          }
        }
      }),
    ]);

    return {
      totalUsers,
      totalAdmins,
      recentUsers,
      todayUsers,
      regularUsers: totalUsers - totalAdmins,
    };
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    return {
      totalUsers: 0,
      totalAdmins: 0,
      recentUsers: 0,
      todayUsers: 0,
      regularUsers: 0,
    };
  }
}

export default async function AdminDashboard() {
  const metrics = await getAdminMetrics();

  const statCards = [
    {
      title: 'Total de Usuários',
      value: metrics.totalUsers,
      description: `${metrics.regularUsers} usuários regulares`,
      icon: Users,
      trend: '+12% este mês',
      trendPositive: true,
    },
    {
      title: 'Administradores',
      value: metrics.totalAdmins,
      description: 'Usuários com privilégios admin',
      icon: Shield,
      trend: 'Sem mudanças',
      trendPositive: null,
    },
    {
      title: 'Novos Usuários (7 dias)',
      value: metrics.recentUsers,
      description: `${metrics.todayUsers} hoje`,
      icon: UserPlus,
      trend: '+8% vs semana anterior',
      trendPositive: true,
    },
    {
      title: 'Sistema Status',
      value: 'Online',
      description: 'Todos os serviços funcionando',
      icon: CheckCircle,
      trend: '99.9% uptime',
      trendPositive: true,
    },
  ];

  const quickActions = [
    {
      title: 'Gerenciar Usuários',
      description: 'Ver, editar e gerenciar todos os usuários',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Ver Analytics',
      description: 'Relatórios detalhados e métricas',
      href: '/admin/analytics',
      icon: Activity,
    },
    {
      title: 'Logs do Sistema',
      description: 'Verificar logs e atividades',
      href: '/admin/logs',
      icon: Clock,
    },
    {
      title: 'Configurações',
      description: 'Configurações gerais do sistema',
      href: '/admin/settings',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="p-6">
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
            <p className="text-muted-foreground mt-2">
              Visão geral do sistema e métricas importantes
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sistema Online
          </Badge>
        </div>
      </FadeIn>

      {/* Cards de Métricas */}
      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((card, index) => (
          <StaggerItem key={card.title}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {card.description}
                </p>
                {card.trend && (
                  <div className="flex items-center text-xs">
                    <TrendingUp 
                      className={`h-3 w-3 mr-1 ${
                        card.trendPositive 
                          ? 'text-green-500' 
                          : card.trendPositive === false 
                            ? 'text-red-500' 
                            : 'text-muted-foreground'
                      }`} 
                    />
                    <span 
                      className={
                        card.trendPositive 
                          ? 'text-green-600 dark:text-green-400' 
                          : card.trendPositive === false 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-muted-foreground'
                      }
                    >
                      {card.trend}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ações Rápidas */}
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Acesso rápido às funcionalidades principais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <Link key={action.title} href={action.href}>
                  <div className="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                    <action.icon className="h-5 w-5 mr-3 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Atividades Recentes */}
        <FadeIn delay={0.4}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Últimas ações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sistema iniciado com sucesso</p>
                    <p className="text-xs text-muted-foreground">Há 2 horas</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {metrics.todayUsers > 0 
                        ? `${metrics.todayUsers} novo(s) usuário(s) registrado(s)` 
                        : 'Nenhum novo usuário hoje'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">Hoje</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-purple-500 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Dashboard admin atualizado</p>
                    <p className="text-xs text-muted-foreground">Há 1 dia</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/admin/logs">
                      Ver todos os logs
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
} 