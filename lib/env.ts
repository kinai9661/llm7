// 環境變量配置和驗證
export interface EnvConfig {
  // Next.js 配置
  NODE_ENV: string
  NEXT_TELEMETRY_DISABLED: string
  NEXT_PUBLIC_APP_URL?: string
  VERCEL_URL?: string

  // AI 模型 API 密鑰
  OPENAI_API_KEY?: string
  OPENAI_BASE_URL?: string
  REPLICATE_API_TOKEN?: string
  HUGGINGFACE_API_KEY?: string
  STABILITY_API_KEY?: string

  // 圖像處理配置
  MAX_FILE_SIZE: number
  SUPPORTED_FORMATS: string[]

  // 功能開關
  ENABLE_OPENAI: boolean
  ENABLE_REPLICATE: boolean
  ENABLE_HUGGINGFACE: boolean
  ENABLE_STABILITY: boolean
  ENABLE_WATERMARK_REMOVAL: boolean

  // 安全配置
  RATE_LIMIT_REQUESTS: number
  RATE_LIMIT_WINDOW: number
  CORS_ORIGINS: string[]
}

class EnvironmentManager {
  private config: EnvConfig

  constructor() {
    this.config = this.loadConfig()
    this.validateConfig()
  }

  private loadConfig(): EnvConfig {
    return {
      // Next.js 配置
      NODE_ENV: process.env.NODE_ENV || 'development',
      NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED || '1',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      VERCEL_URL: process.env.VERCEL_URL,

      // AI 模型 API 密鑰
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
      REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
      HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
      STABILITY_API_KEY: process.env.STABILITY_API_KEY,

      // 圖像處理配置
      MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
      SUPPORTED_FORMATS: (process.env.SUPPORTED_FORMATS || 'png,jpg,jpeg,webp').split(','),

      // 功能開關
      ENABLE_OPENAI: this.parseBool(process.env.ENABLE_OPENAI, true),
      ENABLE_REPLICATE: this.parseBool(process.env.ENABLE_REPLICATE, true),
      ENABLE_HUGGINGFACE: this.parseBool(process.env.ENABLE_HUGGINGFACE, true),
      ENABLE_STABILITY: this.parseBool(process.env.ENABLE_STABILITY, true),
      ENABLE_WATERMARK_REMOVAL: this.parseBool(process.env.ENABLE_WATERMARK_REMOVAL, true),

      // 安全配置
      RATE_LIMIT_REQUESTS: parseInt(process.env.RATE_LIMIT_REQUESTS || '10'),
      RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '60000'), // 1分鐘
      CORS_ORIGINS: (process.env.CORS_ORIGINS || '*').split(',')
    }
  }

  private parseBool(value: string | undefined, defaultValue: boolean): boolean {
    if (value === undefined) return defaultValue
    return value.toLowerCase() === 'true' || value === '1'
  }

  private validateConfig(): void {
    const errors: string[] = []

    // 驗證文件大小限制
    if (this.config.MAX_FILE_SIZE < 1024 * 1024) { // 最小1MB
      errors.push('MAX_FILE_SIZE must be at least 1MB (1048576 bytes)')
    }

    if (this.config.MAX_FILE_SIZE > 50 * 1024 * 1024) { // 最大50MB
      errors.push('MAX_FILE_SIZE cannot exceed 50MB (52428800 bytes)')
    }

    // 驗證速率限制
    if (this.config.RATE_LIMIT_REQUESTS < 1) {
      errors.push('RATE_LIMIT_REQUESTS must be at least 1')
    }

    if (this.config.RATE_LIMIT_WINDOW < 1000) { // 最小1秒
      errors.push('RATE_LIMIT_WINDOW must be at least 1000ms')
    }

    // 驗證支持的格式
    const validFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp']
    const invalidFormats = this.config.SUPPORTED_FORMATS.filter(
      format => !validFormats.includes(format.toLowerCase())
    )

    if (invalidFormats.length > 0) {
      errors.push(`Unsupported image formats: ${invalidFormats.join(', ')}`)
    }

    if (errors.length > 0) {
      console.warn('Environment configuration warnings:', errors)
    }
  }

  // 獲取配置
  getConfig(): EnvConfig {
    return { ...this.config }
  }

  // 檢查API密鑰是否可用
  hasApiKey(provider: 'openai' | 'replicate' | 'huggingface' | 'stability'): boolean {
    switch (provider) {
      case 'openai':
        return !!(this.config.OPENAI_API_KEY && this.config.ENABLE_OPENAI)
      case 'replicate':
        return !!(this.config.REPLICATE_API_TOKEN && this.config.ENABLE_REPLICATE)
      case 'huggingface':
        return !!(this.config.HUGGINGFACE_API_KEY && this.config.ENABLE_HUGGINGFACE)
      case 'stability':
        return !!(this.config.STABILITY_API_KEY && this.config.ENABLE_STABILITY)
      default:
        return false
    }
  }

  // 獲取應用URL
  getAppUrl(): string {
    if (this.config.NEXT_PUBLIC_APP_URL) {
      return this.config.NEXT_PUBLIC_APP_URL
    }
    if (this.config.VERCEL_URL) {
      return `https://${this.config.VERCEL_URL}`
    }
    return 'http://localhost:3000'
  }

  // 檢查是否為生產環境
  isProduction(): boolean {
    return this.config.NODE_ENV === 'production'
  }

  // 檢查是否為開發環境
  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development'
  }

  // 獲取CORS配置
  getCorsOrigins(): string[] {
    if (this.config.CORS_ORIGINS.includes('*')) {
      return ['*']
    }
    return this.config.CORS_ORIGINS
  }

  // 檢查文件格式是否支持
  isSupportedFormat(format: string): boolean {
    return this.config.SUPPORTED_FORMATS.includes(format.toLowerCase())
  }

  // 檢查文件大小是否在限制內
  isValidFileSize(size: number): boolean {
    return size <= this.config.MAX_FILE_SIZE
  }

  // 獲取環境變量狀態報告
  getStatusReport(): {
    environment: string
    apiKeys: Record<string, boolean>
    features: Record<string, boolean>
    limits: {
      maxFileSize: string
      supportedFormats: string[]
      rateLimit: string
    }
  } {
    return {
      environment: this.config.NODE_ENV,
      apiKeys: {
        openai: this.hasApiKey('openai'),
        replicate: this.hasApiKey('replicate'),
        huggingface: this.hasApiKey('huggingface'),
        stability: this.hasApiKey('stability')
      },
      features: {
        openai: this.config.ENABLE_OPENAI,
        replicate: this.config.ENABLE_REPLICATE,
        huggingface: this.config.ENABLE_HUGGINGFACE,
        stability: this.config.ENABLE_STABILITY,
        watermarkRemoval: this.config.ENABLE_WATERMARK_REMOVAL
      },
      limits: {
        maxFileSize: this.formatBytes(this.config.MAX_FILE_SIZE),
        supportedFormats: this.config.SUPPORTED_FORMATS,
        rateLimit: `${this.config.RATE_LIMIT_REQUESTS} requests per ${this.config.RATE_LIMIT_WINDOW / 1000}s`
      }
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// 單例實例
export const env = new EnvironmentManager()

// 便捷函數
export const getConfig = () => env.getConfig()
export const hasApiKey = (provider: 'openai' | 'replicate' | 'huggingface' | 'stability') => env.hasApiKey(provider)
export const getAppUrl = () => env.getAppUrl()
export const isProduction = () => env.isProduction()
export const isDevelopment = () => env.isDevelopment()
export const getStatusReport = () => env.getStatusReport()