import { checkRateLimit, resetRateLimit, type RateLimitResult } from './rate-limit'

type RateLimitType = 'login' | 'signup' | 'passwordReset' | 'emailVerification'

interface ActionResult {
  success: boolean
  message: string
  [key: string]: any
}

export async function withRateLimit<T extends ActionResult>(
  type: RateLimitType,
  action: () => Promise<T>,
  identifier?: string
): Promise<T> {
  // Verificar rate limit antes da ação
  const rateLimitResult = await checkRateLimit(type, identifier)
  
  if (!rateLimitResult.success) {
    return {
      success: false,
      message: rateLimitResult.message || 'Muitas tentativas. Tente novamente mais tarde.',
      rateLimited: true,
      blockDuration: rateLimitResult.blockDuration,
    } as unknown as T
  }
  
  try {
    // Executar a ação
    const result = await action()
    
    // Se a ação foi bem-sucedida, reset o rate limit para este identificador
    if (result.success && identifier) {
      await resetRateLimit(type, identifier)
    }
    
    return {
      ...result,
      rateLimitRemaining: rateLimitResult.remaining,
    }
  } catch (error) {
    // If the error is a Next.js redirect, it means the action was successful.
    // We swallow the error and return a success result.
    if (typeof error === 'object' && error !== null && 'digest' in error && typeof (error as any).digest === 'string' && (error as any).digest.startsWith('NEXT_REDIRECT')) {
      // The action was successful, reset the rate limit.
      if (identifier) {
        await resetRateLimit(type, identifier)
      }
      return { success: true, message: "Ação bem-sucedida." } as T;
    }

    // For all other errors, handle them as before.
    console.log(`Erro na ação ${type}:`, error)
    return {
      success: false,
      message: 'Erro interno. Tente novamente.',
      rateLimitRemaining: rateLimitResult.remaining,
    } as unknown as T
  }
}

export function isRateLimited(result: ActionResult): boolean {
  return 'rateLimited' in result && result.rateLimited === true
} 