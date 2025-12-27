import { useState, useEffect } from 'react'

interface EnvironmentStatus {
  environment: string
  timestamp: string
  providers: Record<string, {
    available: boolean
    enabled: boolean
    models: string[]
  }>
  features: Record<string, boolean>
  limits: {
    maxFileSize: string
    supportedFormats: string[]
    rateLimit: string
  }
  health: {
    status: string
    uptime: number
    memory: {
      used: number
      total: number
    }
  }
  recommendations: string[]
}

export default function EnvironmentStatus() {
  const [status, setStatus] = useState<EnvironmentStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchEnvironmentStatus()
  }, [])

  const fetchEnvironmentStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/env-status')
      if (!response.ok) {
        throw new Error('Failed to fetch environment status')
      }
      const data = await response.json()
      setStatus(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '獲取環境狀態失敗')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (available: boolean, enabled: boolean): string => {
    if (available && enabled) return 'text-green-600 bg-green-50 border-green-200'
    if (available && !enabled) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getStatusText = (available: boolean, enabled: boolean): string => {
    if (available && enabled) return '可用'
    if (available && !enabled) return '已禁用'
    return '不可用'
  }

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}小時 ${minutes}分鐘`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading-spinner"></div>
        <span className="ml-2">載入環境狀態中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-red-800">環境狀態載入失敗</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchEnvironmentStatus}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            重試
          </button>
        </div>
      </div>
    )
  }

  if (!status) return null

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">環境狀態</h2>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.health.status === 'healthy' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {status.health.status === 'healthy' ? '健康' : '異常'}
            </span>
            <button
              onClick={fetchEnvironmentStatus}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
            >
              刷新
            </button>
          </div>
        </div>
        <p className="text-gray-600">
          環境: {status.environment} | 更新時間: {new Date(status.timestamp).toLocaleString()}
        </p>
      </div>

      {/* 系統健康狀態 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">系統健康狀態</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">運行時間</div>
            <div className="text-lg font-semibold">{formatUptime(status.health.uptime)}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">內存使用</div>
            <div className="text-lg font-semibold">
              {status.health.memory.used}MB / {status.health.memory.total}MB
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">狀態</div>
            <div className="text-lg font-semibold text-green-600">正常運行</div>
          </div>
        </div>
      </div>

      {/* API提供商狀態 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">API提供商狀態</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(status.providers).map(([provider, info]) => (
            <div
              key={provider}
              className={`p-4 rounded-lg border ${getStatusColor(info.available, info.enabled)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium capitalize">{provider}</h4>
                <span className="text-sm">
                  {getStatusText(info.available, info.enabled)}
                </span>
              </div>
              <div className="text-sm opacity-75">
                模型數量: {info.models.length}
              </div>
              {info.models.length > 0 && (
                <div className="text-xs mt-2 opacity-60">
                  {info.models.slice(0, 2).join(', ')}
                  {info.models.length > 2 && ` +${info.models.length - 2}`}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 功能狀態 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">功能狀態</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(status.features).map(([feature, enabled]) => (
            <div
              key={feature}
              className={`p-3 rounded-lg border text-center ${
                enabled 
                  ? 'bg-green-50 text-green-800 border-green-200' 
                  : 'bg-gray-50 text-gray-600 border-gray-200'
              }`}
            >
              <div className="font-medium capitalize">
                {feature.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-sm mt-1">
                {enabled ? '已啟用' : '已禁用'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 系統限制 */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">系統限制</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showDetails ? '隱藏詳情' : '顯示詳情'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">最大文件大小</div>
            <div className="font-semibold">{status.limits.maxFileSize}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">支持格式</div>
            <div className="font-semibold">{status.limits.supportedFormats.length} 種</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">速率限制</div>
            <div className="font-semibold">{status.limits.rateLimit}</div>
          </div>
        </div>
        {showDetails && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm">
              <p><strong>支持的圖像格式:</strong></p>
              <p className="mt-1 text-blue-800">
                {status.limits.supportedFormats.join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 建議 */}
      {status.recommendations.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-4">配置建議</h3>
          <ul className="space-y-2">
            {status.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-yellow-700">
                <span className="text-yellow-500 mt-1">•</span>
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}