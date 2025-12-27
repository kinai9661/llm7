import { NextApiRequest, NextApiResponse } from 'next'
import { env } from './env'

// 速率限制存儲
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// 清理過期的速率限制記錄
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // 每分鐘清理一次

export interface MiddlewareOptions {
  requireApiKey?: 'openai' | 'replicate' | 'huggingface' | 'stability'
  checkFileSize?: boolean
  enableRateLimit?: boolean
  corsOrigins?: string[]
}

export function withMiddleware(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options: MiddlewareOptions = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // CORS 處理
      if (options.corsOrigins || env.getCorsOrigins()) {
        const origins = options.corsOrigins || env.getCorsOrigins()
        const origin = req.headers.origin

        if (origins.includes('*') || (origin && origins.includes(origin))) {
          res.setHeader('Access-Control-Allow-Origin', origin || '*')
        }

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        if (req.method === 'OPTIONS') {
          res.status(200).end()
          return
        }
      }

      // 速率限制
      if (options.enableRateLimit !== false) {
        const clientId = getClientId(req)
        const config = env.getConfig()
        
        if (!checkRateLimit(clientId, config.RATE_LIMIT_REQUESTS, config.RATE_LIMIT_WINDOW)) {
          res.status(429).json({
            error: '請求過於頻繁，請稍後再試',
            retryAfter: Math.ceil(config.RATE_LIMIT_WINDOW / 1000)
          })
          return
        }
      }

      // API密鑰檢查
      if (options.requireApiKey) {
        if (!env.hasApiKey(options.requireApiKey)) {
          res.status(503).json({
            error: `${options.requireApiKey.toUpperCase()} API密鑰未配置或已禁用`,
            provider: options.requireApiKey
          })
          return
        }
      }

      // 文件大小檢查（對於包含文件上傳的請求）
      if (options.checkFileSize && req.headers['content-length']) {
        const contentLength = parseInt(req.headers['content-length'])
        if (!env.isValidFileSize(contentLength)) {
          res.status(413).json({
            error: `文件大小超過限制 (${env.getConfig().MAX_FILE_SIZE} bytes)`,
            maxSize: env.getConfig().MAX_FILE_SIZE
          })
          return
        }
      }

      // 執行原始處理器
      await handler(req, res)
    } catch (error) {
      console.error('Middleware error:', error)
      res.status(500).json({
        error: '服務器內部錯誤',
        ...(env.isDevelopment() && { details: error instanceof Error ? error.message : String(error) })
      })
    }
  }
}

function getClientId(req: NextApiRequest): string {
  // 優先使用 X-Forwarded-For，然後是 X-Real-IP，最後是連接IP
  const forwarded = req.headers['x-forwarded-for']
  const realIp = req.headers['x-real-ip']
  const connectionIp = req.socket.remoteAddress

  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  if (typeof realIp === 'string') {
    return realIp
  }
  return connectionIp || 'unknown'
}

function checkRateLimit(clientId: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const windowStart = now - windowMs
  
  const clientData = rateLimitStore.get(clientId)
  
  if (!clientData || now > clientData.resetTime) {
    // 新的時間窗口
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }
  
  if (clientData.count >= maxRequests) {
    return false
  }
  
  // 增加計數
  clientData.count++
  rateLimitStore.set(clientId, clientData)
  return true
}

// 環境變量驗證中間件
export function validateEnvironment() {
  const config = env.getConfig()
  const warnings: string[] = []
  const errors: string[] = []

  // 檢查關鍵配置
  if (config.NODE_ENV === 'production') {
    if (!config.NEXT_PUBLIC_APP_URL && !config.VERCEL_URL) {
      warnings.push('生產環境建議設置 NEXT_PUBLIC_APP_URL 或 VERCEL_URL')
    }
  }

  // 檢查API密鑰
  const hasAnyApiKey = env.hasApiKey('openai') || 
                      env.hasApiKey('replicate') || 
                      env.hasApiKey('huggingface') || 
                      env.hasApiKey('stability')

  if (!hasAnyApiKey) {
    warnings.push('未配置任何AI模型API密鑰，只能使用本地Canvas生成器')
  }

  // 輸出警告和錯誤
  if (warnings.length > 0) {
    console.warn('環境配置警告:', warnings)
  }
  
  if (errors.length > 0) {
    console.error('環境配置錯誤:', errors)
    throw new Error(`環境配置錯誤: ${errors.join(', ')}`)
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors
  }
}