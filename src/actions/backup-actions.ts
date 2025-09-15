'use server';

import { requireAdmin } from '@/lib/admin-auth';
import { SupabaseBackupService } from '@/lib/backup/supabase-backup-service';
import { revalidatePath } from 'next/cache';

const backupService = new SupabaseBackupService();

export async function createSupabaseBackup() {
  await requireAdmin();
  
  try {
    console.log('🔄 Admin solicitou backup do Supabase...');
    
    const result = await backupService.createFullBackup();
    
    if (result.success) {
      console.log(`✅ Backup criado com sucesso:`, {
        tabelas: result.tablesCount,
        registros: result.recordsCount,
        tamanho: result.size,
        arquivo: result.filename
      });
      
      // Revalidar a página de settings para mostrar o novo backup
      revalidatePath('/admin/settings');
      
      return {
        success: true,
        message: `Backup criado com sucesso! ${result.tablesCount} tabelas, ${result.recordsCount} registros (${result.size})`,
        data: {
          storageUrl: result.storageUrl,
          timestamp: result.timestamp,
          filename: result.filename,
          size: result.size,
          tablesCount: result.tablesCount,
          recordsCount: result.recordsCount
        }
      };
    } else {
      console.error('❌ Erro no backup:', result.error);
      return {
        success: false,
        message: `Erro ao criar backup: ${result.error}`
      };
    }
  } catch (error: any) {
    console.error('❌ Erro crítico no backup:', error);
    return {
      success: false,
      message: 'Erro interno no servidor. Verifique os logs.'
    };
  }
}

export async function listSupabaseBackups() {
  await requireAdmin();
  
  try {
    const result = await backupService.listBackups();
    
    if (result.success) {
      return {
        success: true,
        backups: result.backups.map(backup => ({
          name: backup.name,
          size: formatFileSize(backup.size),
          created_at: backup.created_at,
          updated_at: backup.updated_at,
          downloadUrl: `/api/backup/download/${backup.name}`
        }))
      };
    } else {
      return {
        success: false,
        message: `Erro ao listar backups: ${result.error}`,
        backups: []
      };
    }
  } catch (error: any) {
    console.error('Erro ao listar backups:', error);
    return {
      success: false,
      message: 'Erro interno no servidor',
      backups: []
    };
  }
}

export async function downloadSupabaseBackup(filename: string) {
  await requireAdmin();
  
  try {
    const result = await backupService.downloadBackup(filename);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
        message: `Backup ${filename} baixado com sucesso`
      };
    } else {
      return {
        success: false,
        message: `Erro ao baixar backup: ${result.error}`
      };
    }
  } catch (error: any) {
    console.error('Erro ao baixar backup:', error);
    return {
      success: false,
      message: 'Erro interno no servidor'
    };
  }
}

// Função auxiliar para formatar tamanho de arquivo
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Action para testar conexão com Supabase
export async function testSupabaseConnection() {
  await requireAdmin();
  
  try {
    // Tentar uma query simples para testar conexão
    const testResult = await backupService.getPublicTables();
    
    return {
      success: true,
      message: `Conexão OK. Encontradas ${testResult.length} tabelas.`,
      tables: testResult.map(t => t.table_name)
    };
  } catch (error: any) {
    console.error('Erro na conexão com Supabase:', error);
    return {
      success: false,
      message: `Erro na conexão: ${error.message}`
    };
  }
} 