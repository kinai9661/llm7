// 圖片生成歷史記錄系統
export interface GenerationRecord {
  id: string
  prompt: string
  model: string
  style?: string
  width: number
  height: number
  steps?: number
  guidance?: number
  imageUrl: string
  thumbnailUrl?: string
  timestamp: number
  generationTime: number
  favorite: boolean
  tags: string[]
  metadata?: {
    provider?: string
    baseUrl?: string
    parameters?: any
  }
}

export interface HistoryFilter {
  model?: string
  style?: string
  dateRange?: {
    start: number
    end: number
  }
  favorite?: boolean
  tags?: string[]
  search?: string
}

class GenerationHistory {
  private readonly STORAGE_KEY = 'llm7_generation_history'
  private readonly MAX_RECORDS = 1000
  
  // 添加生成記錄
  addRecord(record: Omit<GenerationRecord, 'id' | 'timestamp' | 'favorite' | 'tags'>): string {
    const records = this.getRecords()
    
    const newRecord: GenerationRecord = {
      ...record,
      id: this.generateId(),
      timestamp: Date.now(),
      favorite: false,
      tags: this.extractTags(record.prompt)
    }
    
    records.unshift(newRecord)
    
    // 限制記錄數量
    if (records.length > this.MAX_RECORDS) {
      records.splice(this.MAX_RECORDS)
    }
    
    this.saveRecords(records)
    return newRecord.id
  }
  
  // 獲取所有記錄
  getRecords(): GenerationRecord[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load generation history:', error)
      return []
    }
  }
  
  // 保存記錄
  private saveRecords(records: GenerationRecord[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records))
    } catch (error) {
      console.error('Failed to save generation history:', error)
    }
  }
  
  // 獲取單個記錄
  getRecord(id: string): GenerationRecord | null {
    const records = this.getRecords()
    return records.find(record => record.id === id) || null
  }
  
  // 更新記錄
  updateRecord(id: string, updates: Partial<GenerationRecord>): boolean {
    const records = this.getRecords()
    const index = records.findIndex(record => record.id === id)
    
    if (index === -1) return false
    
    records[index] = { ...records[index], ...updates }
    this.saveRecords(records)
    return true
  }
  
  // 刪除記錄
  deleteRecord(id: string): boolean {
    const records = this.getRecords()
    const index = records.findIndex(record => record.id === id)
    
    if (index === -1) return false
    
    records.splice(index, 1)
    this.saveRecords(records)
    return true
  }
  
  // 切換收藏狀態
  toggleFavorite(id: string): boolean {
    const record = this.getRecord(id)
    if (!record) return false
    
    return this.updateRecord(id, { favorite: !record.favorite })
  }
  
  // 添加標籤
  addTag(id: string, tag: string): boolean {
    const record = this.getRecord(id)
    if (!record) return false
    
    const tags = [...new Set([...record.tags, tag.toLowerCase()])]
    return this.updateRecord(id, { tags })
  }
  
  // 移除標籤
  removeTag(id: string, tag: string): boolean {
    const record = this.getRecord(id)
    if (!record) return false
    
    const tags = record.tags.filter(t => t !== tag.toLowerCase())
    return this.updateRecord(id, { tags })
  }
  
  // 篩選記錄
  filterRecords(filter: HistoryFilter): GenerationRecord[] {
    let records = this.getRecords()
    
    if (filter.model) {
      records = records.filter(record => record.model === filter.model)
    }
    
    if (filter.style) {
      records = records.filter(record => record.style === filter.style)
    }
    
    if (filter.favorite !== undefined) {
      records = records.filter(record => record.favorite === filter.favorite)
    }
    
    if (filter.dateRange) {
      records = records.filter(record => 
        record.timestamp >= filter.dateRange!.start &&
        record.timestamp <= filter.dateRange!.end
      )
    }
    
    if (filter.tags && filter.tags.length > 0) {
      records = records.filter(record =>
        filter.tags!.some(tag => record.tags.includes(tag.toLowerCase()))
      )
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      records = records.filter(record =>
        record.prompt.toLowerCase().includes(searchLower) ||
        record.tags.some(tag => tag.includes(searchLower))
      )
    }
    
    return records
  }
  
  // 獲取統計信息
  getStatistics(): {
    totalRecords: number
    favoriteCount: number
    modelStats: Record<string, number>
    styleStats: Record<string, number>
    recentActivity: { date: string; count: number }[]
  } {
    const records = this.getRecords()
    
    const modelStats: Record<string, number> = {}
    const styleStats: Record<string, number> = {}
    const dailyActivity: Record<string, number> = {}
    
    records.forEach(record => {
      // 模型統計
      modelStats[record.model] = (modelStats[record.model] || 0) + 1
      
      // 風格統計
      if (record.style) {
        styleStats[record.style] = (styleStats[record.style] || 0) + 1
      }
      
      // 日期活動統計
      const date = new Date(record.timestamp).toISOString().split('T')[0]
      dailyActivity[date] = (dailyActivity[date] || 0) + 1
    })
    
    // 最近7天活動
    const recentActivity = Object.entries(dailyActivity)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 7)
      .map(([date, count]) => ({ date, count }))
    
    return {
      totalRecords: records.length,
      favoriteCount: records.filter(r => r.favorite).length,
      modelStats,
      styleStats,
      recentActivity
    }
  }
  
  // 導出記錄
  exportRecords(format: 'json' | 'csv' = 'json'): string {
    const records = this.getRecords()
    
    if (format === 'csv') {
      const headers = ['ID', 'Prompt', 'Model', 'Style', 'Width', 'Height', 'Timestamp', 'Favorite']
      const rows = records.map(record => [
        record.id,
        `"${record.prompt.replace(/"/g, '""')}"`,
        record.model,
        record.style || '',
        record.width,
        record.height,
        new Date(record.timestamp).toISOString(),
        record.favorite
      ])
      
      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
    }
    
    return JSON.stringify(records, null, 2)
  }
  
  // 導入記錄
  importRecords(data: string, format: 'json' | 'csv' = 'json'): number {
    try {
      let importedRecords: GenerationRecord[] = []
      
      if (format === 'json') {
        importedRecords = JSON.parse(data)
      } else {
        // CSV 導入邏輯（簡化版）
        const lines = data.split('\n')
        const headers = lines[0].split(',')
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',')
          if (values.length >= headers.length) {
            // 簡化的CSV解析
            importedRecords.push({
              id: values[0],
              prompt: values[1].replace(/^"|"$/g, '').replace(/""/g, '"'),
              model: values[2],
              style: values[3] || undefined,
              width: parseInt(values[4]),
              height: parseInt(values[5]),
              imageUrl: '',
              timestamp: new Date(values[6]).getTime(),
              generationTime: 0,
              favorite: values[7] === 'true',
              tags: []
            })
          }
        }
      }
      
      const existingRecords = this.getRecords()
      const mergedRecords = [...importedRecords, ...existingRecords]
      
      // 去重
      const uniqueRecords = mergedRecords.filter((record, index, arr) =>
        arr.findIndex(r => r.id === record.id) === index
      )
      
      this.saveRecords(uniqueRecords.slice(0, this.MAX_RECORDS))
      return importedRecords.length
    } catch (error) {
      console.error('Failed to import records:', error)
      return 0
    }
  }
  
  // 清空歷史記錄
  clearHistory(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }
  
  // 生成ID
  private generateId(): string {
    return `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // 從提示詞提取標籤
  private extractTags(prompt: string): string[] {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'])
    
    return prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word))
      .slice(0, 10) // 最多10個標籤
  }
}

// 單例實例
export const generationHistory = new GenerationHistory()

// 輔助函數
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - timestamp
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-TW')
  }
}

export const formatGenerationTime = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`
  } else {
    return `${(ms / 60000).toFixed(1)}m`
  }
}