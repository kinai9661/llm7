import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 基本的本地模型
    const availableModels = [
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

    // 檢查API密鑰
    const apiStatus = {
      openai: !!process.env.OPENAI_API_KEY,
      replicate: !!process.env.REPLICATE_API_TOKEN,
      huggingface: !!process.env.HUGGINGFACE_API_KEY,
      stability: !!process.env.STABILITY_API_KEY
    }

    // 如果有API密鑰，添加對應模型
    if (apiStatus.openai) {
      availableModels.push({
        id: 'dall-e-3',
        name: 'DALL-E 3',
        provider: 'openai',
        type: 'text-to-image',
        description: '最新的OpenAI圖像生成模型',
        maxResolution: '1024x1024',
        estimatedTime: '10-30秒',
        free: false
      })
    }

    if (apiStatus.huggingface) {
      availableModels.push({
        id: 'stable-diffusion-2-1',
        name: 'Stable Diffusion 2.1',
        provider: 'huggingface',
        type: 'text-to-image',
        description: '免費的Stable Diffusion模型',
        maxResolution: '768x768',
        estimatedTime: '30-60秒',
        free: true
      })
    }

    res.status(200).json({
      availableModels,
      apiStatus,
      config: {
        maxFileSize: 10485760,
        supportedFormats: ['png', 'jpg', 'jpeg', 'webp'],
        rateLimit: {
          requests: 10,
          window: 60000
        }
      },
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    console.error('Check models error:', error)
    res.status(500).json({ 
      error: '檢查模型失敗',
      availableModels: [{
        id: 'canvas-generator',
        name: 'Canvas生成器',
        provider: 'local',
        type: 'text-to-image',
        description: '本地Canvas API生成',
        maxResolution: '512x512',
        estimatedTime: '1-3秒',
        free: true
      }]
    })
  }
}