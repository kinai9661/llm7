import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'
import sharp from 'sharp'
import { createCanvas, loadImage } from 'canvas'

// 配置multer用於文件上傳
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
})

// 禁用Next.js默認的body parser
export const config = {
  api: {
    bodyParser: false,
  },
}

// 包裝multer為Promise
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 處理文件上傳
    await runMiddleware(req, res, upload.single('image'))

    const file = (req as any).file
    if (!file) {
      return res.status(400).json({ error: '請上傳圖像文件' })
    }

    // 使用sharp處理圖像
    const imageBuffer = file.buffer
    const image = sharp(imageBuffer)
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height) {
      return res.status(400).json({ error: '無效的圖像文件' })
    }

    // 模擬去水印處理 - 應用一些圖像處理技術
    let processedBuffer = await image
      .modulate({
        brightness: 1.1,
        saturation: 1.05,
      })
      .sharpen()
      .toBuffer()

    // 使用canvas進行更高級的處理
    const canvas = createCanvas(metadata.width, metadata.height)
    const ctx = canvas.getContext('2d')

    // 載入處理後的圖像
    const processedImage = await loadImage(processedBuffer)
    ctx.drawImage(processedImage, 0, 0)

    // 應用去水印算法 - 這裡使用簡單的模糊和銳化組合
    const imageData = ctx.getImageData(0, 0, metadata.width, metadata.height)
    const data = imageData.data

    // 簡單的去水印處理：檢測並修復可能的水印區域
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const alpha = data[i + 3]

      // 檢測半透明像素（可能是水印）
      if (alpha < 255 && alpha > 0) {
        // 使用周圍像素的平均值來填充
        const x = Math.floor((i / 4) % metadata.width)
        const y = Math.floor((i / 4) / metadata.width)
        
        // 簡單的修復：增加不透明度並調整顏色
        data[i + 3] = 255 // 設為完全不透明
        
        // 輕微調整顏色以減少水印痕跡
        data[i] = Math.min(255, r * 1.1)
        data[i + 1] = Math.min(255, g * 1.1)
        data[i + 2] = Math.min(255, b * 1.1)
      }
    }

    ctx.putImageData(imageData, 0, 0)

    // 轉換回buffer
    const finalBuffer = canvas.toBuffer('image/png')

    // 設置響應頭
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Disposition', 'attachment; filename="watermark-removed.png"')
    
    // 發送處理後的圖像
    res.send(finalBuffer)
  } catch (error) {
    console.error('Watermark removal error:', error)
    res.status(500).json({ error: '去水印處理失敗' })
  }
}