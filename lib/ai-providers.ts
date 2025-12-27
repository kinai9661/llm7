import OpenAI from 'openai'
import Replicate from 'replicate'
import { createCanvas } from 'canvas'

export interface GenerateImageParams {
  prompt: string
  model: string
  width?: number
  height?: number
  steps?: number
  guidance?: number
}

export interface GenerateImageResponse {
  success: boolean
  imageUrl?: string
  error?: string
  metadata?: {
    model: string
    prompt: string
    generationTime: number
  }
}

class AIProviders {
  private openai: OpenAI | null = null
  private replicate: Replicate | null = null

  constructor() {
    // 初始化OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
    }

    // 初始化Replicate
    if (process.env.REPLICATE_API_TOKEN) {
      this.replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN
      })
    }
  }

  async generateWithOpenAI(params: GenerateImageParams): Promise<GenerateImageResponse> {
    if (!this.openai) {
      return { success: false, error: 'OpenAI API密鑰未配置' }
    }

    const startTime = Date.now()

    try {
      const response = await this.openai.images.generate({
        model: params.model,
        prompt: params.prompt,
        n: 1,
        size: `${params.width || 1024}x${params.height || 1024}` as any,
        quality: 'standard',
        response_format: 'url'
      })

      const imageUrl = response.data[0]?.url
      if (!imageUrl) {
        return { success: false, error: '未能生成圖像' }
      }

      return {
        success: true,
        imageUrl,
        metadata: {
          model: params.model,
          prompt: params.prompt,
          generationTime: Date.now() - startTime
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '圖像生成失敗'
      }
    }
  }

  async generateWithReplicate(params: GenerateImageParams): Promise<GenerateImageResponse> {
    if (!this.replicate) {
      return { success: false, error: 'Replicate API密鑰未配置' }
    }

    const startTime = Date.now()

    try {
      const modelId = this.getReplicateModelId(params.model)
      if (!modelId) {
        return { success: false, error: '不支持的Replicate模型' }
      }

      const output = await this.replicate.run(modelId, {
        input: {
          prompt: params.prompt,
          width: params.width || 1024,
          height: params.height || 1024,
          num_inference_steps: params.steps || 4,
          guidance_scale: params.guidance || 7.5
        }
      }) as string[]

      const imageUrl = Array.isArray(output) ? output[0] : output
      if (!imageUrl) {
        return { success: false, error: '未能生成圖像' }
      }

      return {
        success: true,
        imageUrl,
        metadata: {
          model: params.model,
          prompt: params.prompt,
          generationTime: Date.now() - startTime
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '圖像生成失敗'
      }
    }
  }

  async generateWithHuggingFace(params: GenerateImageParams): Promise<GenerateImageResponse> {
    const startTime = Date.now()

    try {
      const modelId = this.getHuggingFaceModelId(params.model)
      if (!modelId) {
        return { success: false, error: '不支持的HuggingFace模型' }
      }

      const response = await fetch(
        `https://api-inference.huggingface.co/models/${modelId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: params.prompt,
            parameters: {
              width: params.width || 512,
              height: params.height || 512,
              num_inference_steps: params.steps || 20,
              guidance_scale: params.guidance || 7.5
            }
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const buffer = await blob.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const imageUrl = `data:image/png;base64,${base64}`

      return {
        success: true,
        imageUrl,
        metadata: {
          model: params.model,
          prompt: params.prompt,
          generationTime: Date.now() - startTime
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'HuggingFace圖像生成失敗'
      }
    }
  }

  async generateWithStability(params: GenerateImageParams): Promise<GenerateImageResponse> {
    const startTime = Date.now()

    try {
      const engineId = this.getStabilityEngineId(params.model)
      if (!engineId) {
        return { success: false, error: '不支持的Stability AI模型' }
      }

      const response = await fetch(
        `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: params.prompt,
                weight: 1
              }
            ],
            cfg_scale: params.guidance || 7,
            height: params.height || 512,
            width: params.width || 512,
            steps: params.steps || 30,
            samples: 1,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseJSON = await response.json()
      const image = responseJSON.artifacts[0]
      const imageUrl = `data:image/png;base64,${image.base64}`

      return {
        success: true,
        imageUrl,
        metadata: {
          model: params.model,
          prompt: params.prompt,
          generationTime: Date.now() - startTime
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Stability AI圖像生成失敗'
      }
    }
  }

  async generateWithCanvas(params: GenerateImageParams): Promise<GenerateImageResponse> {
    const startTime = Date.now()

    try {
      const canvas = createCanvas(params.width || 512, params.height || 512)
      const ctx = canvas.getContext('2d')

      // 創建基於提示詞的動態背景
      const colors = this.getColorsFromPrompt(params.prompt)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, colors.primary)
      gradient.addColorStop(0.5, colors.secondary)
      gradient.addColorStop(1, colors.tertiary)
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 添加動態圖案
      this.addDynamicPatterns(ctx, canvas.width, canvas.height, params.prompt)

      // 添加文字
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('AI Generated', canvas.width / 2, canvas.height / 2 - 40)
      
      // 添加提示詞摘要
      ctx.font = '16px Arial'
      const words = params.prompt.split(' ').slice(0, 5).join(' ')
      ctx.fillText(words, canvas.width / 2, canvas.height / 2 + 20)

      const buffer = canvas.toBuffer('image/png')
      const base64Image = `data:image/png;base64,${buffer.toString('base64')}`

      return {
        success: true,
        imageUrl: base64Image,
        metadata: {
          model: params.model,
          prompt: params.prompt,
          generationTime: Date.now() - startTime
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Canvas圖像生成失敗'
      }
    }
  }

  private getColorsFromPrompt(prompt: string): { primary: string; secondary: string; tertiary: string } {
    const colorKeywords = {
      red: ['red', 'crimson', 'scarlet', '紅', '紅色'],
      blue: ['blue', 'azure', 'navy', '藍', '藍色'],
      green: ['green', 'emerald', 'forest', '綠', '綠色'],
      purple: ['purple', 'violet', 'lavender', '紫', '紫色'],
      orange: ['orange', 'amber', 'sunset', '橙', '橙色'],
      pink: ['pink', 'rose', 'magenta', '粉', '粉色'],
      yellow: ['yellow', 'gold', 'sunshine', '黃', '黃色']
    }

    const lowerPrompt = prompt.toLowerCase()
    
    for (const [color, keywords] of Object.entries(colorKeywords)) {
      if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
        return this.getColorPalette(color)
      }
    }

    // 默認漸變
    return {
      primary: '#667eea',
      secondary: '#764ba2',
      tertiary: '#f093fb'
    }
  }

  private getColorPalette(baseColor: string): { primary: string; secondary: string; tertiary: string } {
    const palettes = {
      red: { primary: '#ff6b6b', secondary: '#ee5a52', tertiary: '#ff8a80' },
      blue: { primary: '#4ecdc4', secondary: '#45b7aa', tertiary: '#80deea' },
      green: { primary: '#95e1d3', secondary: '#81c784', tertiary: '#a5d6a7' },
      purple: { primary: '#d63384', secondary: '#9c27b0', tertiary: '#ce93d8' },
      orange: { primary: '#ffa726', secondary: '#ff9800', tertiary: '#ffcc02' },
      pink: { primary: '#f8bbd9', secondary: '#e91e63', tertiary: '#f48fb1' },
      yellow: { primary: '#fff176', secondary: '#ffeb3b', tertiary: '#fff59d' }
    }

    return palettes[baseColor as keyof typeof palettes] || palettes.blue
  }

  private addDynamicPatterns(ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string) {
    const lowerPrompt = prompt.toLowerCase()
    
    // 根據提示詞添加不同圖案
    if (lowerPrompt.includes('star') || lowerPrompt.includes('星')) {
      this.drawStars(ctx, width, height)
    } else if (lowerPrompt.includes('circle') || lowerPrompt.includes('圓')) {
      this.drawCircles(ctx, width, height)
    } else if (lowerPrompt.includes('wave') || lowerPrompt.includes('波')) {
      this.drawWaves(ctx, width, height)
    } else {
      this.drawRandomShapes(ctx, width, height)
    }
  }

  private drawStars(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 8 + 4
      this.drawStar(ctx, x, y, size)
    }
  }

  private drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5
      const px = x + Math.cos(angle) * size
      const py = y + Math.sin(angle) * size
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }

  private drawCircles(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = Math.random() * 30 + 10
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  private drawWaves(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 3
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      const y = (height / 6) * (i + 1)
      ctx.moveTo(0, y)
      for (let x = 0; x <= width; x += 20) {
        const waveY = y + Math.sin((x / width) * Math.PI * 4) * 20
        ctx.lineTo(x, waveY)
      }
      ctx.stroke()
    }
  }

  private drawRandomShapes(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 40 + 20
      
      if (Math.random() > 0.5) {
        // 圓形
        ctx.beginPath()
        ctx.arc(x, y, size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // 矩形
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
      }
    }
  }

  private getReplicateModelId(model: string): string | null {
    const modelMap: { [key: string]: string } = {
      'sdxl-lightning': 'bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f',
      'flux-schnell': 'black-forest-labs/flux-schnell:bf2f2b4c8e6b4b6b8b6b4b6b8b6b4b6b8b6b4b6b'
    }
    return modelMap[model] || null
  }

  private getHuggingFaceModelId(model: string): string | null {
    const modelMap: { [key: string]: string } = {
      'stable-diffusion-2-1': 'stabilityai/stable-diffusion-2-1',
      'dreamlike-anime': 'dreamlike-art/dreamlike-anime-1.0'
    }
    return modelMap[model] || null
  }

  private getStabilityEngineId(model: string): string | null {
    const engineMap: { [key: string]: string } = {
      'stable-diffusion-xl': 'stable-diffusion-xl-1024-v1-0',
      'stable-diffusion-v1-6': 'stable-diffusion-v1-6'
    }
    return engineMap[model] || null
  }
}

export const aiProviders = new AIProviders()