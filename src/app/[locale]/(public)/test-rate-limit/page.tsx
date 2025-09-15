'use client'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, Shield } from "lucide-react"
import { useState } from "react"

interface RateLimitStatus {
  type: string
  success: boolean
  remaining: number
  blocked: boolean
  blockDuration?: number
  message?: string
}

export default function TestRateLimitPage() {
  const [results, setResults] = useState<RateLimitStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function testRateLimit(type: 'login' | 'signup' | 'passwordReset' | 'emailVerification') {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/test-rate-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
      
      const result = await response.json()
      
      setResults(prev => [{
        type,
        ...result,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 9)]) // Keep last 10 results
      
    } catch (error) {
      console.log('Erro ao testar rate limit:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function clearResults() {
    setResults([])
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Shield className="h-8 w-8 text-blue-600" />
          Teste de Rate Limiting
        </h1>
        <p className="text-muted-foreground">
          Teste os limites de tentativas configurados para diferentes ações do sistema.
        </p>
      </div>

      {/* Configurações atuais */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>⚙️ Configurações Atuais</CardTitle>
          <CardDescription>
            Limites configurados para cada tipo de ação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm">Login</h4>
              <p className="text-xs text-muted-foreground">5 tentativas / 15 min</p>
              <p className="text-xs text-muted-foreground">Bloqueio: 30 min</p>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm">Cadastro</h4>
              <p className="text-xs text-muted-foreground">3 tentativas / 1 hora</p>
              <p className="text-xs text-muted-foreground">Bloqueio: 1 hora</p>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm">Reset Senha</h4>
              <p className="text-xs text-muted-foreground">3 tentativas / 1 hora</p>
              <p className="text-xs text-muted-foreground">Bloqueio: 1 hora</p>
            </div>
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold text-sm">Verificação Email</h4>
              <p className="text-xs text-muted-foreground">10 tentativas / 1 hora</p>
              <p className="text-xs text-muted-foreground">Bloqueio: 30 min</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de teste */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🧪 Testes</CardTitle>
          <CardDescription>
            Clique nos botões para testar os limites de rate limiting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <Button 
              onClick={() => testRateLimit('login')}
              disabled={isLoading}
              variant="outline"
            >
              Testar Login
            </Button>
            <Button 
              onClick={() => testRateLimit('signup')}
              disabled={isLoading}
              variant="outline"
            >
              Testar Cadastro
            </Button>
            <Button 
              onClick={() => testRateLimit('passwordReset')}
              disabled={isLoading}
              variant="outline"
            >
              Testar Reset
            </Button>
            <Button 
              onClick={() => testRateLimit('emailVerification')}
              disabled={isLoading}
              variant="outline"
            >
              Testar Email
            </Button>
          </div>
          <Button onClick={clearResults} variant="secondary" size="sm">
            Limpar Resultados
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Resultados dos Testes</CardTitle>
            <CardDescription>
              Histórico das últimas 10 tentativas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`border rounded-lg p-4 ${
                    result.blocked ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {(result as any).timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.blocked ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium">
                        Restantes: {result.remaining}
                      </span>
                    </div>
                  </div>
                  
                  {result.message && (
                    <Alert variant={result.blocked ? "destructive" : "default"} className="mt-2">
                      <AlertDescription className="text-sm">
                        {result.message}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {result.blocked && result.blockDuration && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                      <Clock className="h-4 w-4" />
                      Bloqueado por {result.blockDuration} minutos
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📚 Como funciona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Cada IP tem limites separados para cada tipo de ação</p>
            <p>• Quando o limite é atingido, o IP é bloqueado temporariamente</p>
            <p>• Em produção, recomenda-se usar Redis para compartilhar estado entre servidores</p>
            <p>• Os contadores são resetados automaticamente após o período de janela</p>
            <p>• Sucessos resetam o contador para aquele identificador específico</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 