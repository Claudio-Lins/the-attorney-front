import { createClient } from '@supabase/supabase-js';
import archiver from 'archiver';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export class SupabaseBackupService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key
    {
      auth: { persistSession: false }
    }
  );
  
  async createFullBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData: any = {};
    
    try {
      console.log('🔄 Iniciando backup completo do Supabase...');
      
      // Garantir que o diretório temp existe
      const tempDir = join(process.cwd(), 'temp');
      if (!existsSync(tempDir)) {
        mkdirSync(tempDir, { recursive: true });
      }
      
      // 1. Listar e fazer backup de todas as tabelas públicas
      const tables = await this.getPublicTables();
      console.log(`📋 Encontradas ${tables.length} tabelas para backup:`, tables.map(t => t.table_name));
      
      let totalRecords = 0;
      
      for (const table of tables) {
        const tableName = table.table_name;
        console.log(`📥 Fazendo backup da tabela: ${tableName}`);
        
        try {
          const { data, error } = await this.supabase
            .from(tableName)
            .select('*');
            
          if (error) {
            console.error(`❌ Erro na tabela ${tableName}:`, error.message);
            backupData[tableName] = { error: error.message, records: 0 };
            continue;
          }
          
          backupData[tableName] = {
            records: data || [],
            count: data?.length || 0,
            backed_up_at: new Date().toISOString()
          };
          
          totalRecords += data?.length || 0;
          console.log(`✅ ${tableName}: ${data?.length || 0} registros`);
          
        } catch (tableError: any) {
          console.error(`❌ Erro ao acessar tabela ${tableName}:`, tableError.message);
          backupData[tableName] = { error: tableError.message, records: 0 };
        }
      }
      
      // 2. Adicionar metadados do backup
      backupData._metadata = {
        backup_timestamp: new Date().toISOString(),
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        total_tables: tables.length,
        total_records: totalRecords,
        backup_version: '1.0',
        created_by: 'Supabase Backup Service'
      };
      
      console.log(`📊 Total: ${tables.length} tabelas, ${totalRecords} registros`);
      
      // 3. Criar arquivo JSON
      const filename = `supabase_backup_${timestamp}.json`;
      const filepath = join(tempDir, filename);
      
      await writeFile(filepath, JSON.stringify(backupData, null, 2));
      console.log(`💾 Arquivo JSON criado: ${filename}`);
      
      // 4. Comprimir
      const compressedPath = await this.compressBackup(filepath, timestamp);
      console.log(`🗜️ Arquivo comprimido: ${compressedPath}`);
      
      // 5. Upload para Supabase Storage
      const storageResult = await this.uploadToSupabaseStorage(compressedPath, filename.replace('.json', '.zip'));
      
      if (!storageResult.success) {
        throw new Error(`Erro no upload: ${storageResult.error}`);
      }
      
      console.log(`☁️ Upload concluído: ${storageResult.url}`);
      
      return {
        success: true,
        filepath: compressedPath,
        storageUrl: storageResult.url,
        size: await this.getFileSize(compressedPath),
        timestamp,
        tablesCount: tables.length,
        recordsCount: totalRecords,
        filename: filename.replace('.json', '.zip')
      };
      
    } catch (error: any) {
      console.error('❌ Erro no backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async getPublicTables() {
    try {
      // Query para listar tabelas do schema public (excluindo tabelas do sistema)
      const { data, error } = await this.supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .not('table_name', 'like', '%_pkey')
        .not('table_name', 'like', '%_fkey')
        .not('table_name', 'in', '(spatial_ref_sys)'); // Excluir tabelas do PostGIS se existirem
        
      if (error) {
        console.warn('Não foi possível listar tabelas automaticamente, usando lista padrão');
        // Lista padrão baseada no Auth do Supabase + suas tabelas customizadas
        return [
          { table_name: 'users' },
          { table_name: 'accounts' },
          { table_name: 'sessions' },
          { table_name: 'verification_tokens' }
        ];
      }
      
      return data || [];
    } catch (error) {
      console.warn('Erro ao listar tabelas, usando lista padrão:', error);
      return [
        { table_name: 'users' },
        { table_name: 'accounts' },
        { table_name: 'sessions' },
        { table_name: 'verification_tokens' }
      ];
    }
  }
  
  async uploadToSupabaseStorage(filepath: string, filename: string) {
    try {
      console.log(`☁️ Fazendo upload para Supabase Storage: ${filename}`);
      
      const fileBuffer = require('fs').readFileSync(filepath);
      
      const { data, error } = await this.supabase.storage
        .from('backups')
        .upload(`database/${filename}`, fileBuffer, {
          cacheControl: '3600',
          upsert: true // Permitir sobrescrever se existir
        });
        
      if (error) {
        console.error('Erro no upload:', error);
        throw error;
      }
      
      console.log('✅ Upload realizado com sucesso:', data.path);
      
      // Obter URL pública (mesmo sendo privado, útil para logs)
      const { data: urlData } = this.supabase.storage
        .from('backups')
        .getPublicUrl(`database/${filename}`);
      
      return {
        success: true,
        url: urlData.publicUrl,
        path: data.path
      };
    } catch (error: any) {
      console.error('❌ Erro no upload para storage:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async compressBackup(filepath: string, timestamp: string): Promise<string> {
    const compressedPath = join(process.cwd(), 'temp', `supabase_backup_${timestamp}.zip`);
    
    return new Promise((resolve, reject) => {
      const output = require('fs').createWriteStream(compressedPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => {
        console.log(`📦 Arquivo comprimido: ${archive.pointer()} bytes`);
        resolve(compressedPath);
      });
      
      archive.on('error', (err) => {
        console.error('Erro na compressão:', err);
        reject(err);
      });
      
      archive.pipe(output);
      archive.file(filepath, { name: 'backup.json' });
      archive.finalize();
    });
  }
  
  async getFileSize(filepath: string): Promise<string> {
    const stats = require('fs').statSync(filepath);
    const bytes = stats.size;
    
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  async listBackups() {
    try {
      const { data, error } = await this.supabase.storage
        .from('backups')
        .list('database/', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });
        
      if (error) throw error;
      
      return {
        success: true,
        backups: data?.map(file => ({
          name: file.name,
          size: file.metadata?.size || 0,
          created_at: file.created_at,
          updated_at: file.updated_at
        })) || []
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        backups: []
      };
    }
  }
  
  async downloadBackup(filename: string) {
    try {
      const { data, error } = await this.supabase.storage
        .from('backups')
        .download(`database/${filename}`);
        
      if (error) throw error;
      
      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
} 