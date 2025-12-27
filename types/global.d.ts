// 全局類型定義
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      NEXT_TELEMETRY_DISABLED: string
      NEXT_PUBLIC_APP_URL?: string
      VERCEL_URL?: string
      
      // AI API Keys
      OPENAI_API_KEY?: string
      REPLICATE_API_TOKEN?: string
      HUGGINGFACE_API_KEY?: string
      STABILITY_API_KEY?: string
      
      // Feature Flags
      ENABLE_OPENAI?: string
      ENABLE_REPLICATE?: string
      ENABLE_HUGGINGFACE?: string
      ENABLE_STABILITY?: string
      ENABLE_WATERMARK_REMOVAL?: string
      
      // System Config
      MAX_FILE_SIZE?: string
      SUPPORTED_FORMATS?: string
      RATE_LIMIT_REQUESTS?: string
      RATE_LIMIT_WINDOW?: string
      CORS_ORIGINS?: string
    }
  }
}

// 模塊聲明
declare module 'canvas' {
  export function createCanvas(width: number, height: number): HTMLCanvasElement
  export function loadImage(src: string | Buffer): Promise<HTMLImageElement>
}

declare module 'openai' {
  export default class OpenAI {
    constructor(config: { apiKey: string })
    images: {
      generate(params: any): Promise<any>
    }
  }
}

declare module 'replicate' {
  export default class Replicate {
    constructor(config: { auth: string })
    run(model: string, options: any): Promise<any>
  }
}

export {}