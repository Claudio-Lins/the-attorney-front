import { FadeIn } from '@/components/ui/animated-container';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton-loader';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { prisma } from '@/lib/prisma';
import {
    Edit,
    Filter,
    Mail,
    MoreHorizontal,
    Search,
    Shield,
    Trash2,
    User,
    UserPlus,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

interface UsersPageProps {
  searchParams: Promise<{
    search?: string;
    role?: 'USER' | 'ADMIN' | 'ALL';
    page?: string;
  }>;
}

async function getUsers(
  search?: string, 
  role?: 'USER' | 'ADMIN' | 'ALL',
  page: number = 1
) {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const where = {
    AND: [
      search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ]
      } : {},
      role && role !== 'ALL' ? { role } : {},
    ]
  };

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              sessions: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      }
    };
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return {
      users: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        pages: 0,
      }
    };
  }
}

function UserRoleBadge({ role }: { role: 'USER' | 'ADMIN' }) {
  return (
    <Badge 
      variant={role === 'ADMIN' ? 'default' : 'secondary'}
      className={role === 'ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
    >
      {role === 'ADMIN' ? (
        <>
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </>
      ) : (
        <>
          <User className="h-3 w-3 mr-1" />
          Usuário
        </>
      )}
    </Badge>
  );
}

function UserStatusBadge({ emailVerified, sessionCount }: { 
  emailVerified: Date | null; 
  sessionCount: number;
}) {
  if (!emailVerified) {
    return (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
        Não Verificado
      </Badge>
    );
  }

  if (sessionCount > 0) {
    return (
      <Badge variant="outline" className="text-green-600 border-green-600">
        Ativo
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-gray-600 border-gray-600">
      Inativo
    </Badge>
  );
}

async function UsersTable({ 
  search, 
  role, 
  page 
}: { 
  search?: string; 
  role?: 'USER' | 'ADMIN' | 'ALL'; 
  page: number;
}) {
  const { users, pagination } = await getUsers(search, role, page);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.image || ''} 
                          alt={user.name || 'Usuário'} 
                        />
                        <AvatarFallback>
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name || 'Sem nome'}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {user.id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <UserRoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <UserStatusBadge 
                      emailVerified={user.emailVerified} 
                      sessionCount={user._count.sessions}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {Math.min((page - 1) * pagination.pageSize + 1, pagination.total)} a{' '}
            {Math.min(page * pagination.pageSize, pagination.total)} de {pagination.total} usuários
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              asChild
            >
              <Link 
                href={`/admin/users?${new URLSearchParams({
                  ...(search && { search }),
                  ...(role && role !== 'ALL' && { role }),
                  page: String(page - 1),
                }).toString()}`}
              >
                Anterior
              </Link>
            </Button>
            
            <span className="text-sm">
              Página {page} de {pagination.pages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.pages}
              asChild
            >
              <Link 
                href={`/admin/users?${new URLSearchParams({
                  ...(search && { search }),
                  ...(role && role !== 'ALL' && { role }),
                  page: String(page + 1),
                }).toString()}`}
              >
                Próxima
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;
  const search = params?.search;
  const role = params?.role || 'ALL';
  const page = parseInt(params?.page || '1');

  const { users: allUsers } = await getUsers();
  const totalUsers = allUsers.length;
  const adminCount = allUsers.filter(u => u.role === 'ADMIN').length;
  const userCount = allUsers.filter(u => u.role === 'USER').length;

  return (
    <div className="p-6">
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todos os usuários do sistema
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/users/create">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Estatísticas Rápidas */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{adminCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Regulares</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{userCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar usuários específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  defaultValue={search}
                  className="pl-10"
                  name="search"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={role === 'ALL' ? 'default' : 'outline'}
                size="sm"
                asChild
              >
                <Link href="/admin/users">Todos</Link>
              </Button>
              <Button
                variant={role === 'USER' ? 'default' : 'outline'}
                size="sm"
                asChild
              >
                <Link href="/admin/users?role=USER">Usuários</Link>
              </Button>
              <Button
                variant={role === 'ADMIN' ? 'default' : 'outline'}
                size="sm"
                asChild
              >
                <Link href="/admin/users?role=ADMIN">Admins</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {search 
              ? `Resultados para "${search}"${role !== 'ALL' ? ` (${role})` : ''}`
              : role !== 'ALL' 
                ? `Mostrando usuários com role ${role}`
                : 'Todos os usuários do sistema'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <UsersTable search={search} role={role} page={page} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
} 