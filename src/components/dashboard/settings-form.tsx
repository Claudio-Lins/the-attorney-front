'use client'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Check, Download, Globe, Moon, Save, Sun, Trash2, Zap } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

interface SettingsFormProps {
  user: {
    id: string
    name: string | null
    email: string
    role: string | null
    emailVerified: Date | null
    createdAt: Date
    updatedAt: Date
    image: string | null
  }
}

interface SettingsState {
  theme: 'light' | 'dark' | 'system'
  language: 'pt' | 'en'
  animations: boolean
  emailNotifications: boolean
  newsletter: boolean
  weeklyDigest: boolean
  publicProfile: boolean
  dataCollection: boolean
  autoBackup: boolean
}

const defaultSettings: SettingsState = {
  theme: 'light',
  language: 'pt',
  animations: true,
  emailNotifications: true,
  newsletter: false,
  weeklyDigest: false,
  publicProfile: false,
  dataCollection: true,
  autoBackup: true,
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', content: string } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  async function handleSave() {
    setIsLoading(true)
    setMessage(null)

    // Simular salvamento (aqui você faria a chamada real para a API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', content: 'Configurações salvas com sucesso!' })
      setHasChanges(false)
    } catch (error) {
      setMessage({ type: 'error', content: 'Erro ao salvar configurações' })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExportData() {
    setIsLoading(true)
    try {
      // Simular exportação de dados
      await new Promise(resolve => setTimeout(resolve, 2000))
      setMessage({ type: 'success', content: 'Dados exportados com sucesso! Verifique seus downloads.' })
    } catch (error) {
      setMessage({ type: 'error', content: 'Erro ao exportar dados' })
    } finally {
      setIsLoading(false)
    }
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Mensagens de feedback */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant={message.type === 'error' ? "destructive" : "default"}>
              {message.type === 'error' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              <AlertDescription>{message.content}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configurações de Aparência */}
      <motion.div variants={fadeIn}>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          {settings.theme === 'dark' ? <Moon className="h-4 w-4" /> : 
           settings.theme === 'light' ? <Sun className="h-4 w-4" /> : 
           <Globe className="h-4 w-4" />}
          Configurações de Interface
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Tema da Interface</Label>
              <p className="text-sm text-muted-foreground">
                Escolha a aparência da interface
              </p>
            </div>
            <Select 
              value={settings.theme} 
              onValueChange={(value: 'light' | 'dark' | 'system') => updateSetting('theme', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">☀️ Claro</SelectItem>
                <SelectItem value="dark">🌙 Escuro</SelectItem>
                <SelectItem value="system">🔄 Automático</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Idioma</Label>
              <p className="text-sm text-muted-foreground">
                Idioma da interface do sistema
              </p>
            </div>
            <Select 
              value={settings.language} 
              onValueChange={(value: 'pt' | 'en') => updateSetting('language', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">🇧🇷 Português</SelectItem>
                <SelectItem value="en">🇺🇸 English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Animações
              </Label>
              <p className="text-sm text-muted-foreground">
                Efeitos visuais e transições suaves
              </p>
            </div>
            <Switch
              checked={settings.animations}
              onCheckedChange={(checked) => updateSetting('animations', checked)}
            />
          </div>
        </div>
      </motion.div>

      <Separator />

      {/* Configurações de Notificação */}
      <motion.div variants={fadeIn}>
        <h3 className="text-lg font-medium mb-4">Notificações</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notificações de Segurança</Label>
              <p className="text-sm text-muted-foreground">
                Emails sobre alterações na conta e atividades suspeitas
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Newsletter</Label>
              <p className="text-sm text-muted-foreground">
                Receber novidades e atualizações do sistema
              </p>
            </div>
            <Switch
              checked={settings.newsletter}
              onCheckedChange={(checked) => updateSetting('newsletter', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Resumo Semanal</Label>
              <p className="text-sm text-muted-foreground">
                Relatório com atividades da sua conta
              </p>
            </div>
            <Switch
              checked={settings.weeklyDigest}
              onCheckedChange={(checked) => updateSetting('weeklyDigest', checked)}
            />
          </div>
        </div>
      </motion.div>

      <Separator />

      {/* Configurações de Privacidade */}
      <motion.div variants={fadeIn}>
        <h3 className="text-lg font-medium mb-4">Privacidade</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Perfil Público</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que outros usuários vejam seu perfil
              </p>
            </div>
            <Switch
              checked={settings.publicProfile}
              onCheckedChange={(checked) => updateSetting('publicProfile', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Coleta de Dados Analíticos</Label>
              <p className="text-sm text-muted-foreground">
                Ajudar a melhorar o sistema compartilhando dados de uso
              </p>
            </div>
            <Switch
              checked={settings.dataCollection}
              onCheckedChange={(checked) => updateSetting('dataCollection', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Backup Automático</Label>
              <p className="text-sm text-muted-foreground">
                Criar backup mensal dos seus dados importantes
              </p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => updateSetting('autoBackup', checked)}
            />
          </div>
        </div>
      </motion.div>

      <Separator />

      {/* Ações */}
      <motion.div variants={fadeIn} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Ações da Conta</h3>
            <p className="text-sm text-muted-foreground">
              Gerenciar dados e configurações avançadas
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleExportData}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                className="relative"
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Salvando...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="save"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </motion.div>
                  )}
                </AnimatePresence>
                {hasChanges && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 h-3 w-3 bg-red-500 rounded-full"
                  />
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Você tem alterações não salvas. Clique em "Salvar Alterações" para aplicar.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
} 