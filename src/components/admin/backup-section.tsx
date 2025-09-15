'use client';

import {
    createSupabaseBackup,
    listSupabaseBackups,
    testSupabaseConnection
} from '@/actions/backup-actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    AlertTriangle,
    CheckCircle,
    Cloud,
    Database,
    Download,
    FileText,
    HardDrive,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BackupItem {
  name: string;
  size: string;
  created_at: string;
  updated_at: string;
  downloadUrl: string;
}

export function BackupSection() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean;
    message: string;
    tables?: string[];
  } | null>(null);
  const [lastBackupResult, setLastBackupResult] = useState<any>(null);

  // Carregar lista de backups ao montar o componente
  useEffect(() => {
    loadBackups();
    testConnection();
  }, []);

  async function loadBackups() {
    setIsLoadingBackups(true);
    try {
      const result = await listSupabaseBackups();
      if (result.success) {
        setBackups(result.backups);
      } else {
        toast.error(`Erro ao carregar backups: ${result.message}`);
      }
    } catch (error) {
      toast.error('Erro ao carregar lista de backups');
    } finally {
      setIsLoadingBackups(false);
    }
  }

  async function testConnection() {
    setIsTestingConnection(true);
    try {
      const result = await testSupabaseConnection();
      setConnectionStatus(result);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: 'Erro ao testar conexão'
      });
      toast.error('Erro ao testar conexão com Supabase');
    } finally {
      setIsTestingConnection(false);
    }
  }

  async function handleCreateBackup() {
    setIsCreatingBackup(true);
    
    try {
      toast.info('Iniciando backup do banco de dados...');
      
      const result = await createSupabaseBackup();
      
      if (result.success) {
        setLastBackupResult(result.data);
        toast.success(result.message);
        
        // Recarregar lista de backups
        await loadBackups();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erro inesperado ao criar backup');
    } finally {
      setIsCreatingBackup(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Conexão Supabase</CardTitle>
          <CardDescription>Verificação da conectividade com o banco de dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isTestingConnection ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : connectionStatus?.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
              <span className="font-medium">
                {isTestingConnection ? 'Testando...' : connectionStatus?.message || 'Aguardando teste'}
              </span>
              {connectionStatus?.success && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {connectionStatus.tables?.length || 0} tabelas encontradas
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              disabled={isTestingConnection}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Testar Novamente
            </Button>
          </div>
          
          {connectionStatus?.tables && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium mb-2">Tabelas detectadas:</p>
              <div className="flex flex-wrap gap-1">
                {connectionStatus.tables.map((table) => (
                  <Badge key={table} variant="secondary" className="text-xs">
                    {table}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Criar Backup */}
      <Card>
        <CardHeader>
          <CardTitle>Backup do Banco de Dados</CardTitle>
          <CardDescription>
            Crie um backup completo de todas as tabelas do banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastBackupResult && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p><strong>Último backup criado com sucesso!</strong></p>
                  <p className="text-sm text-muted-foreground">
                    📁 {lastBackupResult.filename} ({lastBackupResult.size})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📊 {lastBackupResult.tablesCount} tabelas, {lastBackupResult.recordsCount} registros
                  </p>
                  <p className="text-sm text-muted-foreground">
                    🕒 {new Date(lastBackupResult.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Backup Completo</h4>
              <p className="text-sm text-muted-foreground">
                Inclui todas as tabelas, dados e metadados
              </p>
            </div>
            <Button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup || !connectionStatus?.success}
            >
              {isCreatingBackup ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando Backup...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Executar Backup Agora
                </>
              )}
            </Button>
          </div>

          {isCreatingBackup && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processando backup...</span>
              </div>
              <Progress value={undefined} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Este processo pode levar alguns minutos dependendo do tamanho do banco
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Backups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Backups Disponíveis</span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadBackups}
              disabled={isLoadingBackups}
            >
              {isLoadingBackups ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Histórico de backups armazenados no Supabase Storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingBackups ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando backups...</span>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum backup encontrado</p>
              <p className="text-sm">Crie seu primeiro backup usando o botão acima</p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{backup.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>📦 {backup.size}</span>
                        <span>🕒 {new Date(backup.created_at).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      <Cloud className="h-3 w-3 mr-1" />
                      Storage
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Aqui você pode implementar o download
                        toast.info('Download será implementado em breve');
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Importantes */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Informações importantes sobre backup:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Os backups são armazenados no Supabase Storage (bucket: backups)</li>
            <li>• O backup inclui apenas dados das tabelas, não inclui funções ou triggers</li>
            <li>• Senhas são armazenadas criptografadas (hash)</li>
            <li>• Para restauração, entre em contato com o suporte técnico</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
} 