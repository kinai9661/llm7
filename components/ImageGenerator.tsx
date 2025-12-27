import { useState, useEffect } from 'react'
import Image from 'next/image'
import { AI_MODELS, AIModel, getFreeModels, getPaidModels } from '../lib/models'

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState<string>('canvas-generator')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationMetadata, setGenerationMetadata] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [steps, setSteps] = useState(20)
  const [guidance, setGuidance] = useState(7.5)
  const [availableModels, setAvailableModels] = useState<AIModel[]>([])

  useEffect(() => {
    // 檢查可用的模型
    checkAvailableModels()
  }, [])

  const checkAvailableModels = async () => {
    try {
      const response = await fetch('/api/check-models')
      const data = await response.json()
      setAvailableModels(data.availableModels || getFreeModels())
    } catch (error) {
      // 如果檢查失敗，只顯示免費模型
      setAvailableModels(getFreeModels())
    }
  }

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('請輸入圖像描述')
      return
    }

    setLoading(true)
    setError(null)
    setGenerationMetadata(null)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          model: selectedModel,
          width,
          height,
          steps,
          guidance
        }),
      })

      if (!response.ok) {
        throw new Error('圖像生成失敗')
      }

      const data = await response.json()
      setGeneratedImage(data.imageUrl)
      setGenerationMetadata(data.metadata)
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成圖像時發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  const getSelectedModelInfo = (): AIModel | undefined => {
    return availableModels.find(model => model.id === selectedModel)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">AI 圖像生成</h2>
        <p className="text-gray-600 mb-6">
          輸入您想要生成的圖像描述，AI將為您創建獨特的圖像
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
            選擇AI模型
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <optgroup label="免費模型">
              {getFreeModels().filter(model => availableModels.some(am => am.id === model.id)).map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </optgroup>
            <optgroup label="付費模型">
              {getPaidModels().filter(model => availableModels.some(am => am.id === model.id)).map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </optgroup>
          </select>
          {getSelectedModelInfo() && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <p><strong>提供商:</strong> {getSelectedModelInfo()?.provider}</p>
                <p><strong>最大解析度:</strong> {getSelectedModelInfo()?.maxResolution}</p>
                <p><strong>預估時間:</strong> {getSelectedModelInfo()?.estimatedTime}</p>
                <p><strong>費用:</strong> {getSelectedModelInfo()?.free ? '免費' : '付費'}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            圖像描述
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：一隻可愛的貓咪坐在彩虹橋上，卡通風格，高品質"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAdvanced ? '隱藏' : '顯示'}高級設置
          </button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                寬度
              </label>
              <input
                type="number"
                id="width"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                min="256"
                max="1024"
                step="64"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                高度
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                min="256"
                max="1024"
                step="64"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">
                生成步數: {steps}
              </label>
              <input
                type="range"
                id="steps"
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value))}
                min="1"
                max="50"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="guidance" className="block text-sm font-medium text-gray-700 mb-1">
                引導強度: {guidance}
              </label>
              <input
                type="range"
                id="guidance"
                value={guidance}
                onChange={(e) => setGuidance(parseFloat(e.target.value))}
                min="1"
                max="20"
                step="0.5"
                className="w-full"
              />
            </div>
          </div>
        )}

        <button
          onClick={generateImage}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading && <div className="loading-spinner"></div>}
          {loading ? '生成中...' : '生成圖像'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {generatedImage && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">生成結果</h3>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={generatedImage}
              alt="Generated image"
              width={width}
              height={height}
              className="w-full h-auto"
            />
          </div>
          {generationMetadata && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p><strong>模型:</strong> {generationMetadata.model}</p>
              <p><strong>生成時間:</strong> {(generationMetadata.generationTime / 1000).toFixed(2)}秒</p>
              <p><strong>提示詞:</strong> {generationMetadata.prompt}</p>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <a
              href={generatedImage}
              download="generated-image.png"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              下載圖像
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedImage)
                alert('圖像URL已複製到剪貼板')
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              複製URL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}