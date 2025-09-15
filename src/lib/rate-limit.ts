import { headers } from 'next/headers'

// Configurações de rate limiting por tipo de ação
const RATE_LIMITS = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDurationMs: 30 * 60 * 1000, // 30 minutos de bloqueio
  },
  signup: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    blockDurationMs: 60 * 60 * 1000, // 1 hora de bloqueio
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hora
    blockDurationMs: 60 * 60 * 1000, // 1 hora de bloqueio
  },
  emailVerification: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hora
    blockDurationMs: 30 * 60 * 1000, // 30 minutos de bloqueio
  },
} as const

type RateLimitType = keyof typeof RATE_LIMITS

interface RateLimitEntry {
  attempts: number
  firstAttempt: number
  blockedUntil?: number
}

// Storage em memória (em produção usar Redis)
const store = new Map<string, RateLimitEntry>()

async function getClientIP(): Promise<string> {
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

async function getKey(type: RateLimitType, identifier?: string): Promise<string> {
  const ip = await getClientIP()
  return identifier ? `${type}:${ip}:${identifier}` : `${type}:${ip}`
}

function cleanExpiredEntries(): void {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    // Remove entries que passaram da janela de tempo e não estão bloqueadas
    const config = RATE_LIMITS[key.split(':')[0] as RateLimitType]
    if (!config) continue
    
    const isExpired = now - entry.firstAttempt > config.windowMs
    const isNotBlocked = !entry.blockedUntil || now > entry.blockedUntil
    
    if (isExpired && isNotBlocked) {
      store.delete(key)
    }
  }
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
  blocked: boolean
  blockDuration?: number
  message?: string
}

export async function checkRateLimit(
  type: RateLimitType,
  identifier?: string // email para casos específicos
): Promise<RateLimitResult> {
  cleanExpiredEntries()
  
  const key = await getKey(type, identifier)
  const config = RATE_LIMITS[type]
  const now = Date.now()
  
  let entry = store.get(key)
  
  if (!entry) {
    entry = {
      attempts: 0,
      firstAttempt: now,
    }
  }
  
  // Verificar se está bloqueado
  if (entry.blockedUntil && now < entry.blockedUntil) {
    const blockDuration = Math.ceil((entry.blockedUntil - now) / 1000 / 60) // em minutos
    return {
      success: false,
      remaining: 0,
      reset: entry.blockedUntil,
      blocked: true,
      blockDuration,
      message: `Muitas tentativas. Tente novamente em ${blockDuration} minutos.`
    }
  }
  
  // Reset da janela se passou do tempo
  if (now - entry.firstAttempt > config.windowMs) {
    entry = {
      attempts: 0,
      firstAttempt: now,
    }
  }
  
  // Incrementar tentativas
  entry.attempts += 1
  
  // Verificar se excedeu o limite
  if (entry.attempts > config.maxAttempts) {
    entry.blockedUntil = now + config.blockDurationMs
    store.set(key, entry)
    
    const blockDuration = Math.ceil(config.blockDurationMs / 1000 / 60) // em minutos
    return {
      success: false,
      remaining: 0,
      reset: entry.blockedUntil,
      blocked: true,
      blockDuration,
      message: `Muitas tentativas. Bloqueado por ${blockDuration} minutos.`
    }
  }
  
  store.set(key, entry)
  
  return {
    success: true,
    remaining: config.maxAttempts - entry.attempts,
    reset: entry.firstAttempt + config.windowMs,
    blocked: false,
  }
}

export async function resetRateLimit(
  type: RateLimitType,
  identifier?: string
): Promise<void> {
  const key = await getKey(type, identifier)
  store.delete(key)
}

export function getRateLimitInfo(type: RateLimitType) {
  return RATE_LIMITS[type]
}

// Helper para criar response headers
export function addRateLimitHeaders(
  result: RateLimitResult,
  headers: Record<string, string> = {}
): Record<string, string> {
  return {
    ...headers,
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.reset).toISOString(),
    'X-RateLimit-Blocked': result.blocked.toString(),
  }
} 