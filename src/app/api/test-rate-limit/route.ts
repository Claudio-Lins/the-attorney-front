import { checkRateLimit } from "@/lib/rate-limit"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json()
    
    if (!type || !['login', 'signup', 'passwordReset', 'emailVerification'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo inválido' },
        { status: 400 }
      )
    }

    // Simular um teste de rate limiting
    const result = await checkRateLimit(type, 'test@example.com')
    
    return NextResponse.json({
      success: result.success,
      remaining: result.remaining,
      blocked: result.blocked,
      blockDuration: result.blockDuration,
      message: result.message,
      type
    })
    
  } catch (error) {
    console.log('Erro na API de teste:', error)
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    )
  }
} 