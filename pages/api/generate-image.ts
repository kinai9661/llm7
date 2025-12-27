import type { NextApiRequest, NextApiResponse } from 'next'
import { generateCanvasImage } from '../../lib/canvas-generator'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, width = 512, height = 512 } = req.body

    if (!prompt) {
      return res.status(400).json({ error: '請提供圖像描述' })
    }

    const startTime = Date.now()
    const result = await generateCanvasImage(prompt, width, height)

    if (!result.success) {
      return res.status(500).json({ error: result.error })
    }

    res.status(200).json({ 
      imageUrl: result.imageUrl,
      metadata: {
        model: 'canvas-generator',
        prompt: prompt,
        generationTime: Date.now() - startTime,
        provider: 'local'
      }
    })
  } catch (error) {
    console.error('Image generation error:', error)
    res.status(500).json({ error: '圖像生成失敗' })
  }
}