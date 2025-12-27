import type { NextApiRequest, NextApiResponse } from 'next'
import { AI_MODELS, getFreeModels } from '../../lib/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const availableModels = []
    
    // 檢查各個API密鑰是否配置
    const hasOpenAI = !!process.env.OPENAI_API_KEY
    const hasReplicate = !!process.env.REPLICATE_API_TOKEN
    const hasHuggingFace = !!process.env.HUGGINGFACE_API_KEY
    const hasStability = !!process.env.STABILITY_API_KEY

    for (const model of AI_MODELS) {
      let isAvailable = false

      switch (model.provider) {
        case 'openai':
          isAvailable = hasOpenAI
          break
        case 'replicate':
          isAvailable = hasReplicate
          break
        case 'huggingface':
          isAvailable = hasHuggingFace
          break
        case 'stability':
          isAvailable = hasStability
          break
        case 'local':
          isAvailable = true // 本地模型總是可用
          break
        default:
          isAvailable = false
      }

      if (isAvailable) {
        availableModels.push(model)
      }
    }

    // 如果沒有配置任何API密鑰，至少返回免費模型
    if (availableModels.length === 0) {
      availableModels.push(...getFreeModels())
    }

    res.status(200).json({
      availableModels,
      apiStatus: {
        openai: hasOpenAI,
        replicate: hasReplicate,
        huggingface: hasHuggingFace,
        stability: hasStability
      }
    })
  } catch (error) {
    console.error('Check models error:', error)
    res.status(500).json({ 
      error: '檢查模型失敗',
      availableModels: getFreeModels()
    })
  }
}