import { useState, useEffect } from 'react'
import { AI_MODELS, AIModel } from '../lib/models'

interface ModelStatus {
  availableModels: AIModel[]
  apiStatus: {
    openai: boolean
    replicate: boolean
    huggingface: boolean
    stability: boolean
  }
}

export default function ModelManager() {
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApiKeys, setShowApiKeys] = useState(false)

  useEffect(() => {
    checkModelStatus()
  }, [])

  const checkModelStatus = async () => {
    try {
      const response = await fetch('/api/check-models')
      const data = await response.json()
      setModelStatus(data)
    } catch (error) {
      console.error('Failed to check model status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProviderStatus = (provider: string): 'available' | 'unavailable' | 'partial' => {
    if (!modelStatus) return 'unavailable'
    
    const providerModels = AI_MODELS.filter(model => model.provider === provider)
    const availableProviderModels = modelStatus.availableModels.filter(model => model.provider === provider)
    
    if (availableProviderModels.length === 0) return 'unavailable'
    if (availableProviderModels.length === providerModels.length) return 'available'
    return 'partial'
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50'
      case 'partial': return 'text-yellow-600 bg-yellow-50'
      case 'unavailable': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'available': return '可用'
      case 'partial': return '部分可用'
      case 'unavailable': return '不可用'
      default: return '未知'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading-spinner"></div>
        <span className="ml-2">檢查模型狀態中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">模型管理</h2>
        <p className="text-gray-600 mb-6">
          管理和配置AI圖像生成模型
        </p>
      </div>

      {/* API狀態概覽 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">API提供商狀態</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'openai', name: 'OpenAI', provider: 'openai' },
            { key: 'replicate', name: 'Replicate', provider: 'replicate' },
            { key: 'huggingface', name: 'Hugging Face', provider: 'huggingface' },
            { key: 'stability', name: 'Stability AI', provider: 'stability' }
          ].map(({ key, name, provider }) => {
            const status = getProviderStatus(provider)
            return (
              <div key={key} className={`p-3 rounded-lg border ${getStatusColor(status)}`}>
                <div className="font-medium">{name}</div>
                <div className="text-sm">{getStatusText(status)}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 可用模型列表 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">可用模型 ({modelStatus?.availableModels.length || 0})</h3>
        <div className="space-y-3">
          {modelStatus?.availableModels.map(model => (
            <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{model.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    model.free ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {model.free ? '免費' : '付費'}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {model.provider}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{model.description}</p>
                <div className="flex gap-4 text-xs text-gray-500 mt-2">
                  <span>最大解析度: {model.maxResolution}</span>
                  <span>預估時間: {model.estimatedTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API密鑰配置說明 */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-blue-900">API密鑰配置</h3>
          <button
            onClick={() => setShowApiKeys(!showApiKeys)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showApiKeys ? '隱藏' : '顯示'}配置說明
          </button>
        </div>
        
        {showApiKeys && (
          <div className="space-y-4 text-sm text-blue-800">
            <p>要使用付費模型，請在環境變量中配置相應的API密鑰：</p>
            <div className="bg-blue-100 p-4 rounded-lg font-mono text-xs space-y-1">
              <div>OPENAI_API_KEY=your_openai_api_key</div>
              <div>REPLICATE_API_TOKEN=your_replicate_token</div>
              <div>HUGGINGFACE_API_KEY=your_huggingface_key</div>
              <div>STABILITY_API_KEY=your_stability_key</div>
            </div>
            <div className="space-y-2">
              <p><strong>獲取API密鑰：</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI API Keys</a></li>
                <li><a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Replicate API Tokens</a></li>
                <li><a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Hugging Face Tokens</a></li>
                <li><a href="https://platform.stability.ai/account/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stability AI Keys</a></li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 刷新按鈕 */}
      <div className="flex justify-center">
        <button
          onClick={checkModelStatus}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          刷新模型狀態
        </button>
      </div>
    </div>
  )
}