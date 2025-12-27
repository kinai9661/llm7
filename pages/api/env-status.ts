import type { NextApiRequest, NextApiResponse } from 'next'
import { withMiddleware } from '../../lib/middleware'
import { getStatusReport, env } from '../../lib/env'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const statusReport = getStatusReport()
    const config = env.getConfig()

    // 安全地返回環境狀態（不包含敏感信息）
    const safeStatus = {
      environment: statusReport.environment,
      timestamp: new Date().toISOString(),
      
      // API提供商狀態
      providers: {
        openai: {
          available: statusReport.apiKeys.openai,
          enabled: statusReport.features.openai,
          models: statusReport.apiKeys.openai ? ['dall-e-2', 'dall-e-3'] : []
        },
        replicate: {
          available: statusReport.apiKeys.replicate,
          enabled: statusReport.features.replicate,
          models: statusReport.apiKeys.replicate ? ['sdxl-lightning', 'flux-schnell'] : []
        },
        huggingface: {
          available: statusReport.apiKeys.huggingface,
          enabled: statusReport.features.huggingface,
          models: statusReport.apiKeys.huggingface ? ['stable-diffusion-2-1', 'dreamlike-anime'] : []
        },
        stability: {
          available: statusReport.apiKeys.stability,
          enabled: statusReport.features.stability,
          models: statusReport.apiKeys.stability ? ['stable-diffusion-xl', 'stable-diffusion-v1-6'] : []
        },
        local: {
          available: true,
          enabled: true,
          models: ['canvas-generator']
        }
      },

      // 功能狀態
      features: {
        imageGeneration: true,
        watermarkRemoval: statusReport.features.watermarkRemoval,
        multiModel: Object.values(statusReport.apiKeys).some(Boolean),
        rateLimit: true
      },

      // 系統限制
      limits: statusReport.limits,

      // 健康檢查
      health: {
        status: 'healthy',
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
      },

      // 配置建議
      recommendations: generateRecommendations(statusReport)
    }

    res.status(200).json(safeStatus)
  } catch (error) {
    console.error('Environment status error:', error)
    res.status(500).json({ 
      error: '無法獲取環境狀態',
      timestamp: new Date().toISOString()
    })
  }
}

function generateRecommendations(statusReport: any): string[] {
  const recommendations: string[] = []

  // 檢查API密鑰配置
  const availableProviders = Object.entries(statusReport.apiKeys)
    .filter(([_, available]) => available)
    .length

  if (availableProviders === 0) {
    recommendations.push('建議配置至少一個AI模型API密鑰以獲得更好的圖像生成效果')
  } else if (availableProviders < 2) {
    recommendations.push('配置多個API提供商可以提供更多模型選擇和備用方案')
  }

  // 檢查功能配置
  if (!statusReport.features.watermarkRemoval) {
    recommendations.push('啟用去水印功能可以提供完整的圖像處理體驗')
  }

  // 生產環境建議
  if (statusReport.environment === 'production') {
    recommendations.push('生產環境建議監控API使用量和設置適當的速率限制')
    
    if (availableProviders > 0) {
      recommendations.push('建議設置API密鑰的使用量警報以避免意外費用')
    }
  }

  return recommendations
}

export default withMiddleware(handler, {
  enableRateLimit: true
})