import { useState, useEffect } from 'react'
import Image from 'next/image'
import { AIModel, getFreeModels, getPaidModels } from '../lib/models'
import { IMAGE_STYLE_CATEGORIES, getStyleById, getStylesByCategory } from '../lib/image-styles'
import { SIZE_CATEGORIES, getSizeById, getSizesByCategory } from '../lib/size-presets'
import { PROMPT_TEMPLATES, applyTemplate } from '../lib/batch-generator'
import { generationHistory } from '../lib/generation-history'

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState<string>('canvas-generator')
  const [selectedStyle, setSelectedStyle] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('square-art')
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationMetadata, setGenerationMetadata] = useState<any>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showStyles, setShowStyles] = useState(false)
  const [showSizes, setShowSizes] = useState(false)
  const [showBatch, setShowBatch] = useState(false)
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)
  const [steps, setSteps] = useState(20)
  const [guidance, setGuidance] = useState(7.5)
  const [batchCount, setBatchCount] = useState(1)
  const [availableModels, setAvailableModels] = useState<AIModel[]>([])
  const [activeStyleCategory, setActiveStyleCategory] = useState<string>('artistic')
  const [activeSizeCategory, setActiveSizeCategory] = useState<string>('art')

  useEffect(() => {
    checkAvailableModels()
  }, [])

  useEffect(() => {
    // 當選擇尺寸預設時更新寬高
    const sizePreset = getSizeById(selectedSize)
    if (sizePreset) {
      setWidth(sizePreset.width)
      setHeight(sizePreset.height)
    }
  }, [selectedSize])

  const checkAvailableModels = async () => {
    try {
      const response = await fetch('/api/check-models')
      const data = await response.json()
      setAvailableModels(data.availableModels || getFreeModels())
    } catch (error) {
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
    setGeneratedImages([])

    try {
      // 構建完整提示詞
      let fullPrompt = prompt.trim()
      
      // 添加風格
      const style = getStyleById(selectedStyle)
      if (style) {
        fullPrompt = `${fullPrompt}, ${style.prompt}`
        if (style.negativePrompt) {
          fullPrompt = `${fullPrompt}, NOT: ${style.negativePrompt}`
        }
      }

      const results: string[] = []
      const startTime = Date.now()

      // 批量生成
      for (let i = 0; i < batchCount; i++) {
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            prompt: fullPrompt,
            model: selectedModel,
            width: Math.min(width, 1024),
            height: Math.min(height, 1024),
            steps,
            guidance
          }),
        })

        if (!response.ok) {
          throw new Error('圖像生成失敗')
        }

        const data = await response.json()
        if (data.imageUrl) {
          results.push(data.imageUrl)
          
          // 保存到歷史記錄
          generationHistory.addRecord({
            prompt: fullPrompt,
            model: selectedModel,
            style: selectedStyle,
            width,
            height,
            steps,
            guidance,
            imageUrl: data.imageUrl,
            generationTime: data.metadata?.generationTime || 0
          })
        }
      }

      setGeneratedImages(results)
      setGenerationMetadata({
        model: selectedModel,
        style: selectedStyle,
        prompt: fullPrompt,
        generationTime: Date.now() - startTime,
        count: results.length
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成圖像時發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  const getSelectedModelInfo = (): AIModel | undefined => {
    return availableModels.find(model => model.id === selectedModel)
  }

  const applyPromptTemplate = (template: string) => {
    const subject = prompt.trim()
    if (subject) {
      setPrompt(applyTemplate(template, subject))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">AI 圖像生成</h2>
        <p className="text-gray-600 mb-6">
          使用AI生成高品質圖像，支持35種風格預設、批量生成和多種尺寸
        </p>
      </div>

      <div className="space-y-6">
        {/* 模型選擇 */}
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

        {/* 風格選擇 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              圖像風格 (35種預設)
            </label>
            <button
              onClick={() => setShowStyles(!showStyles)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showStyles ? '隱藏風格' : '選擇風格'}
            </button>
          </div>
          
          {showStyles && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {/* 風格分類標籤 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(IMAGE_STYLE_CATEGORIES).map(([key, name]) => (
                  <button
                    key={key}
                    onClick={() => setActiveStyleCategory(key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeStyleCategory === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              
              {/* 風格選項 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => setSelectedStyle('')}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedStyle === ''
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">🎨</div>
                  <div className="font-medium text-sm">無風格</div>
                  <div className="text-xs text-gray-500">原始提示詞</div>
                </button>
                
                {getStylesByCategory(activeStyleCategory).map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedStyle === style.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{style.icon}</div>
                    <div className="font-medium text-sm">{style.name}</div>
                    <div className="text-xs text-gray-500">{style.description}</div>
                    {style.popular && (
                      <div className="text-xs text-orange-500 mt-1">🔥 熱門</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {selectedStyle && (
            <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-800">
              已選擇: {getStyleById(selectedStyle)?.name}
            </div>
          )}
        </div>

        {/* 尺寸選擇 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              圖像尺寸
            </label>
            <button
              onClick={() => setShowSizes(!showSizes)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showSizes ? '隱藏尺寸' : '選擇尺寸'}
            </button>
          </div>
          
          {showSizes && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {/* 尺寸分類 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(SIZE_CATEGORIES).map(([key, name]) => (
                  <button
                    key={key}
                    onClick={() => setActiveSizeCategory(key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeSizeCategory === key
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-green-50'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              
              {/* 尺寸選項 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getSizesByCategory(activeSizeCategory).map(size => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedSize === size.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{size.icon}</span>
                      <span className="font-medium text-sm">{size.name}</span>
                      {size.popular && <span className="text-xs text-orange-500">🔥</span>}
                    </div>
                    <div className="text-xs text-gray-500">{size.width}×{size.height}</div>
                    <div className="text-xs text-gray-400">{size.aspectRatio}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-2 flex gap-4 text-sm text-gray-600">
            <span>寬度: {width}px</span>
            <span>高度: {height}px</span>
            <span>比例: {getSizeById(selectedSize)?.aspectRatio || 'Custom'}</span>
          </div>
        </div>

        {/* 提示詞輸入 */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            圖像描述
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：一隻可愛的貓咪坐在彩虹橋上"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          
          {/* 提示詞模板 */}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">快速模板:</span>
            {Object.entries(PROMPT_TEMPLATES).map(([key, templates]) => (
              <button
                key={key}
                onClick={() => applyPromptTemplate(templates[0])}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                {key === 'portrait' ? '人像' : key === 'landscape' ? '風景' : key === 'object' ? '物品' : '藝術'}
              </button>
            ))}
          </div>
        </div>

        {/* 批量生成設置 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              批量生成
            </label>
            <button
              onClick={() => setShowBatch(!showBatch)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showBatch ? '隱藏' : '顯示'}批量設置
            </button>
          </div>
          
          {showBatch && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    生成數量
                  </label>
                  <select
                    value={batchCount}
                    onChange={(e) => setBatchCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(count => (
                      <option key={count} value={count}>{count} 張</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    預估時間
                  </label>
                  <div className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-600">
                    約 {Math.ceil(batchCount * 15)} 秒
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 高級設置 */}
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

        {/* 生成按鈕 */}
        <button
          onClick={generateImage}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading && <div className="loading-spinner"></div>}
          {loading ? `生成中... (${batchCount}張)` : `生成圖像 (${batchCount}張)`}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* 生成結果 */}
      {generatedImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            生成結果 ({generatedImages.length}張)
          </h3>
          
          {/* 圖片網格 */}
          <div className={`grid gap-4 ${
            generatedImages.length === 1 ? 'grid-cols-1' :
            generatedImages.length === 2 ? 'grid-cols-2' :
            generatedImages.length <= 4 ? 'grid-cols-2 md:grid-cols-2' :
            'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {generatedImages.map((imageUrl, index) => (
              <div key={index} className="relative bg-gray-100 rounded-lg overflow-hidden group">
                <Image
                  src={imageUrl}
                  alt={`Generated image ${index + 1}`}
                  width={width}
                  height={height}
                  className="w-full h-auto"
                />
                
                {/* 圖片操作按鈕 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <a
                      href={imageUrl}
                      download={`generated-image-${index + 1}.png`}
                      className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      下載
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(imageUrl)
                        alert('圖像URL已複製')
                      }}
                      className="bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      複製
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 生成信息 */}
          {generationMetadata && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">生成信息</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">模型:</span> {generationMetadata.model}
                </div>
                <div>
                  <span className="font-medium">風格:</span> {generationMetadata.style ? getStyleById(generationMetadata.style)?.name : '無'}
                </div>
                <div>
                  <span className="font-medium">尺寸:</span> {width}×{height}
                </div>
                <div>
                  <span className="font-medium">生成時間:</span> {(generationMetadata.generationTime / 1000).toFixed(1)}秒
                </div>
              </div>
              <div className="mt-2">
                <span className="font-medium text-sm text-gray-600">完整提示詞:</span>
                <p className="text-sm text-gray-500 mt-1 break-words">{generationMetadata.prompt}</p>
              </div>
            </div>
          )}
          
          {/* 批量操作 */}
          {generatedImages.length > 1 && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  generatedImages.forEach((url, index) => {
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `generated-image-${index + 1}.png`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  })
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                下載全部 ({generatedImages.length}張)
              </button>
              <button
                onClick={() => {
                  const urls = generatedImages.join('\n')
                  navigator.clipboard.writeText(urls)
                  alert('所有圖像URL已複製')
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                複製全部URL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}