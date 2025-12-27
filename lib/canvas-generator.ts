// 簡單的Canvas圖像生成器
export async function generateCanvasImage(prompt: string, width = 512, height = 512) {
  try {
    // 動態導入canvas
    const { createCanvas } = require('canvas')
    
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // 創建漸變背景
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(0.5, '#764ba2')
    gradient.addColorStop(1, '#f093fb')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // 添加裝飾圖案
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = Math.random() * 30 + 10
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // 添加文字
    ctx.fillStyle = 'white'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('AI Generated Image', width / 2, height / 2 - 40)
    
    ctx.font = '16px Arial'
    const words = prompt.split(' ').slice(0, 5).join(' ')
    ctx.fillText(words, width / 2, height / 2 + 20)

    // 轉換為base64
    const buffer = canvas.toBuffer('image/png')
    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`

    return {
      success: true,
      imageUrl: base64Image
    }
  } catch (error) {
    return {
      success: false,
      error: '圖像生成失敗: ' + (error as Error).message
    }
  }
}