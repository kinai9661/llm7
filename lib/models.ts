export interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'replicate' | 'huggingface' | 'stability' | 'local'
  type: 'text-to-image' | 'image-to-image' | 'inpainting'
  description: string
  maxResolution: string
  estimatedTime: string
  apiEndpoint?: string
  modelId?: string
  free: boolean
}

export const AI_MODELS: AIModel[] = [
  // OpenAI Models (支持自定義base_url)
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: 'openai',
    type: 'text-to-image',
    description: '最新的OpenAI圖像生成模型，支持自定義API端點',
    maxResolution: '1024x1024',
    estimatedTime: '10-30秒',
    free: false
  },
  {
    id: 'dall-e-2',
    name: 'DALL-E 2',
    provider: 'openai',
    type: 'text-to-image',
    description: 'OpenAI經典圖像生成模型，支持自定義API端點',
    maxResolution: '1024x1024',
    estimatedTime: '5-15秒',
    free: false
  },

  // Stability AI Models
  {
    id: 'stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    provider: 'stability',
    type: 'text-to-image',
    description: '高解析度圖像生成，支持多種風格',
    maxResolution: '1024x1024',
    estimatedTime: '15-45秒',
    free: false
  },
  {
    id: 'stable-diffusion-v1-6',
    name: 'Stable Diffusion v1.6',
    provider: 'stability',
    type: 'text-to-image',
    description: '穩定快速的圖像生成模型',
    maxResolution: '512x512',
    estimatedTime: '10-30秒',
    free: false
  },

  // Replicate Models
  {
    id: 'sdxl-lightning',
    name: 'SDXL Lightning',
    provider: 'replicate',
    type: 'text-to-image',
    description: '超快速圖像生成，4步生成',
    maxResolution: '1024x1024',
    estimatedTime: '2-8秒',
    modelId: 'bytedance/sdxl-lightning-4step',
    free: false
  },
  {
    id: 'flux-schnell',
    name: 'Flux Schnell',
    provider: 'replicate',
    type: 'text-to-image',
    description: '新一代快速圖像生成模型',
    maxResolution: '1024x1024',
    estimatedTime: '5-15秒',
    modelId: 'black-forest-labs/flux-schnell',
    free: false
  },

  // Hugging Face Models (Free)
  {
    id: 'stable-diffusion-2-1',
    name: 'Stable Diffusion 2.1',
    provider: 'huggingface',
    type: 'text-to-image',
    description: '免費的Stable Diffusion模型',
    maxResolution: '768x768',
    estimatedTime: '30-60秒',
    modelId: 'stabilityai/stable-diffusion-2-1',
    free: true
  },
  {
    id: 'dreamlike-anime',
    name: 'Dreamlike Anime',
    provider: 'huggingface',
    type: 'text-to-image',
    description: '專門生成動漫風格圖像',
    maxResolution: '512x512',
    estimatedTime: '20-40秒',
    modelId: 'dreamlike-art/dreamlike-anime-1.0',
    free: true
  },

  // Local Canvas Model (Always available)
  {
    id: 'canvas-generator',
    name: 'Canvas生成器',
    provider: 'local',
    type: 'text-to-image',
    description: '本地Canvas API生成，無需API密鑰',
    maxResolution: '512x512',
    estimatedTime: '1-3秒',
    free: true
  }
]

export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find(model => model.id === id)
}

export const getModelsByProvider = (provider: string): AIModel[] => {
  return AI_MODELS.filter(model => model.provider === provider)
}

export const getFreeModels = (): AIModel[] => {
  return AI_MODELS.filter(model => model.free)
}

export const getPaidModels = (): AIModel[] => {
  return AI_MODELS.filter(model => !model.free)
}