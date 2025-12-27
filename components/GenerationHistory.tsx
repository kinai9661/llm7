import { useState, useEffect } from 'react'
import Image from 'next/image'
import { generationHistory, GenerationRecord, formatTimestamp, formatGenerationTime } from '../lib/generation-history'
import { getStyleById } from '../lib/image-styles'

export default function GenerationHistory() {
  const [records, setRecords] = useState<GenerationRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<GenerationRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterModel, setFilterModel] = useState('')
  const [filterStyle, setFilterStyle] = useState('')
  const [showFavorites, setShowFavorites] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'fastest' | 'slowest'>('newest')
  const [selectedRecord, setSelectedRecord] = useState<GenerationRecord | null>(null)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    loadRecords()
  }, [])

  useEffect(() => {
    filterAndSortRecords()
  }, [records, searchTerm, filterModel, filterStyle, showFavorites, sortBy])

  const loadRecords = () => {
    const allRecords = generationHistory.getRecords()
    setRecords(allRecords)
  }

  const filterAndSortRecords = () => {
    let filtered = [...records]

    // 搜索過濾
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(record =>
        record.prompt.toLowerCase().includes(term) ||
        record.tags.some(tag => tag.includes(term))
      )
    }

    // 模型過濾
    if (filterModel) {
      filtered = filtered.filter(record => record.model === filterModel)
    }

    // 風格過濾
    if (filterStyle) {
      filtered = filtered.filter(record => record.style === filterStyle)
    }

    // 收藏過濾
    if (showFavorites) {
      filtered = filtered.filter(record => record.favorite)
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp
        case 'oldest':
          return a.timestamp - b.timestamp
        case 'fastest':
          return a.generationTime - b.generationTime
        case 'slowest':
          return b.generationTime - a.generationTime
        default:
          return b.timestamp - a.timestamp
      }
    })

    setFilteredRecords(filtered)
  }

  const toggleFavorite = (id: string) => {
    generationHistory.toggleFavorite(id)
    loadRecords()
  }

  const deleteRecord = (id: string) => {
    if (confirm('確定要刪除這個生成記錄嗎？')) {
      generationHistory.deleteRecord(id)
      loadRecords()
      setSelectedRecord(null)
    }
  }

  const exportHistory = () => {
    const data = generationHistory.exportRecords('json')
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `generation-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearHistory = () => {
    if (confirm('確定要清空所有生成歷史嗎？此操作無法撤銷。')) {
      generationHistory.clearHistory()
      loadRecords()
    }
  }

  const getUniqueModels = () => {
    return [...new Set(records.map(r => r.model))]
  }

  const getUniqueStyles = () => {
    return [...new Set(records.map(r => r.style).filter(Boolean))]
  }

  const statistics = generationHistory.getStatistics()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">生成歷史</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showStats ? '隱藏' : '顯示'}統計
            </button>
            <button
              onClick={exportHistory}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              導出
            </button>
            <button
              onClick={clearHistory}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              清空
            </button>
          </div>
        </div>
        
        <p className="text-gray-600">
          共 {records.length} 條記錄，顯示 {filteredRecords.length} 條
        </p>
      </div>

      {/* 統計信息 */}
      {showStats && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">統計信息</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{statistics.totalRecords}</div>
              <div className="text-sm text-blue-800">總生成數</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{statistics.favoriteCount}</div>
              <div className="text-sm text-red-800">收藏數</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(statistics.modelStats).length}
              </div>
              <div className="text-sm text-green-800">使用模型</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(statistics.styleStats).length}
              </div>
              <div className="text-sm text-purple-800">使用風格</div>
            </div>
          </div>
        </div>
      )}

      {/* 過濾和搜索 */}
      <div className="bg-white rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">搜索</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索提示詞或標籤..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">模型</label>
            <select
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有模型</option>
              {getUniqueModels().map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">風格</label>
            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有風格</option>
              {getUniqueStyles().map(style => (
                <option key={style} value={style}>
                  {getStyleById(style)?.name || style}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">最新</option>
              <option value="oldest">最舊</option>
              <option value="fastest">最快</option>
              <option value="slowest">最慢</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showFavorites}
              onChange={(e) => setShowFavorites(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">只顯示收藏</span>
          </label>
        </div>
      </div>

      {/* 記錄網格 */}
      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredRecords.map(record => (
            <div
              key={record.id}
              className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedRecord(record)}
            >
              <div className="relative aspect-square">
                <Image
                  src={record.imageUrl}
                  alt={record.prompt}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(record.id)
                  }}
                  className={`absolute top-2 right-2 p-1 rounded-full ${
                    record.favorite
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-400 hover:text-red-500'
                  }`}
                >
                  ❤️
                </button>
              </div>
              
              <div className="p-3">
                <p className="text-sm text-gray-800 line-clamp-2 mb-2">
                  {record.prompt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatTimestamp(record.timestamp)}</span>
                  <span>{formatGenerationTime(record.generationTime)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到記錄</h3>
          <p className="text-gray-500">
            {records.length === 0 ? '還沒有生成任何圖片' : '沒有符合條件的記錄'}
          </p>
        </div>
      )}

      {/* 詳情模態框 */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">生成詳情</h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Image
                    src={selectedRecord.imageUrl}
                    alt={selectedRecord.prompt}
                    width={selectedRecord.width}
                    height={selectedRecord.height}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">提示詞</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedRecord.prompt}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">模型</label>
                      <p className="text-sm text-gray-900">{selectedRecord.model}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">風格</label>
                      <p className="text-sm text-gray-900">
                        {selectedRecord.style ? getStyleById(selectedRecord.style)?.name : '無'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">尺寸</label>
                      <p className="text-sm text-gray-900">{selectedRecord.width}×{selectedRecord.height}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">生成時間</label>
                      <p className="text-sm text-gray-900">{formatGenerationTime(selectedRecord.generationTime)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">標籤</label>
                    <div className="flex flex-wrap gap-1">
                      {selectedRecord.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <a
                      href={selectedRecord.imageUrl}
                      download={`generated-${selectedRecord.id}.png`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                    >
                      下載
                    </a>
                    <button
                      onClick={() => toggleFavorite(selectedRecord.id)}
                      className={`px-4 py-2 rounded text-sm ${
                        selectedRecord.favorite
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {selectedRecord.favorite ? '取消收藏' : '加入收藏'}
                    </button>
                    <button
                      onClick={() => deleteRecord(selectedRecord.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}