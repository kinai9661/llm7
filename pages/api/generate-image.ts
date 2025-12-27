import type { NextApiRequest, NextApiResponse } from 'next'
import { aiProviders } from '../../lib/ai-providers'
import { getModelById } from '../../lib/models'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, model = 'canvas-generator', width = 512, height = 512, steps = 20, guidance = 7.5 } = req.body

    if (!prompt) {
      return res.status(400).json({ error: '請提供圖像描述' })
    }

    const modelInfo = getModelById(model)
    if (!modelInfo) {
      return res.status(400).json({ error: '不支持的模型' })
    }

    const params = {
      prompt,
      model,
      width,
      height,
      steps,
      guidance
    }

    let result

    switch (modelInfo.provider) {
      case 'openai':
        result = await aiProviders.generateWithOpenAI(params)
        break
      case 'replicate':
        result = await aiProviders.generateWithReplicate(params)
        break
      case 'huggingface':
        result = await aiProviders.generateWithHuggingFace(params)
        break
      case 'stability':
        result = await aiProviders.generateWithStability(params)
        break
      case 'local':
      default:
        result = await aiProviders.generateWithCanvas(params)
        break
    }

    if (!result.success) {
      return res.status(500).json({ error: result.error })
    }

    res.status(200).json({ 
      imageUrl: result.imageUrl,
      metadata: result.metadata
    })
  } catch (error) {
    console.error('Image generation error:', error)
    res.status(500).json({ error: '圖像生成失敗' })
  }
}