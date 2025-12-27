// 批量圖片生成系統
export interface BatchGenerateParams {
  prompts: string[]
  model: string
  style?: string
  width: number
  height: number
  steps?: number
  guidance?: number
  count: number
}

export interface BatchGenerateResult {
  id: string
  prompt: string
  imageUrl?: string
  error?: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  generationTime?: number
  metadata?: any
}

export interface BatchGenerateResponse {
  batchId: string
  results: BatchGenerateResult[]
  totalCount: number
  completedCount: number
  failedCount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  startTime: number
  endTime?: number
}

class BatchGenerator {
  private batches = new Map<string, BatchGenerateResponse>()
  
  // 創建批量生成任務
  createBatch(params: BatchGenerateParams): string {
    const batchId = this.generateBatchId()
    const results: BatchGenerateResult[] = []
    
    // 為每個提示詞創建任務
    params.prompts.forEach((prompt, index) => {
      for (let i = 0; i < params.count; i++) {
        results.push({
          id: `${batchId}-${index}-${i}`,
          prompt: prompt.trim(),
          status: 'pending'
        })
      }
    })
    
    const batch: BatchGenerateResponse = {
      batchId,
      results,
      totalCount: results.length,
      completedCount: 0,
      failedCount: 0,
      status: 'pending',
      startTime: Date.now()
    }
    
    this.batches.set(batchId, batch)
    return batchId
  }
  
  // 獲取批量任務狀態
  getBatchStatus(batchId: string): BatchGenerateResponse | null {
    return this.batches.get(batchId) || null
  }
  
  // 更新單個任務結果
  updateResult(batchId: string, resultId: string, update: Partial<BatchGenerateResult>): void {
    const batch = this.batches.get(batchId)
    if (!batch) return
    
    const result = batch.results.find(r => r.id === resultId)
    if (!result) return
    
    Object.assign(result, update)
    
    // 更新批量狀態
    this.updateBatchStatus(batch)
  }
  
  // 更新批量狀態
  private updateBatchStatus(batch: BatchGenerateResponse): void {
    const completed = batch.results.filter(r => r.status === 'completed').length
    const failed = batch.results.filter(r => r.status === 'failed').length
    const processing = batch.results.filter(r => r.status === 'generating').length
    
    batch.completedCount = completed
    batch.failedCount = failed
    
    if (completed + failed === batch.totalCount) {
      batch.status = 'completed'
      batch.endTime = Date.now()
    } else if (processing > 0) {
      batch.status = 'processing'
    }
  }
  
  // 生成批量ID
  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // 清理過期批量任務
  cleanupExpiredBatches(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now()
    for (const [batchId, batch] of this.batches.entries()) {
      if (now - batch.startTime > maxAge) {
        this.batches.delete(batchId)
      }
    }
  }
  
  // 獲取所有批量任務
  getAllBatches(): BatchGenerateResponse[] {
    return Array.from(this.batches.values())
  }
  
  // 刪除批量任務
  deleteBatch(batchId: string): boolean {
    return this.batches.delete(batchId)
  }
}

// 單例實例
export const batchGenerator = new BatchGenerator()

// 批量生成輔助函數
export const generatePromptVariations = (basePrompt: string, count: number): string[] => {
  const variations = [basePrompt]
  
  const modifiers = [
    'highly detailed',
    'masterpiece',
    'best quality',
    'ultra detailed',
    'professional',
    'artistic',
    'beautiful',
    'stunning',
    'amazing',
    'incredible'
  ]
  
  const styles = [
    'digital art',
    'concept art',
    'illustration',
    'painting',
    'artwork',
    'fine art'
  ]
  
  const lighting = [
    'dramatic lighting',
    'soft lighting',
    'natural lighting',
    'studio lighting',
    'golden hour',
    'cinematic lighting'
  ]
  
  for (let i = 1; i < count && i < 10; i++) {
    let variation = basePrompt
    
    // 隨機添加修飾詞
    if (Math.random() > 0.5) {
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)]
      variation = `${modifier}, ${variation}`
    }
    
    // 隨機添加風格
    if (Math.random() > 0.6) {
      const style = styles[Math.floor(Math.random() * styles.length)]
      variation = `${variation}, ${style}`
    }
    
    // 隨機添加光照
    if (Math.random() > 0.7) {
      const light = lighting[Math.floor(Math.random() * lighting.length)]
      variation = `${variation}, ${light}`
    }
    
    variations.push(variation)
  }
  
  return variations.slice(0, count)
}

// 提示詞模板
export const PROMPT_TEMPLATES = {
  portrait: [
    'portrait of {subject}',
    'headshot of {subject}',
    'close-up of {subject}',
    '{subject} portrait photography'
  ],
  landscape: [
    'landscape of {subject}',
    'scenic view of {subject}',
    'panoramic {subject}',
    'beautiful {subject} scenery'
  ],
  object: [
    'detailed {subject}',
    'professional photo of {subject}',
    'studio shot of {subject}',
    'high quality {subject}'
  ],
  artistic: [
    'artistic interpretation of {subject}',
    'creative {subject} artwork',
    'stylized {subject}',
    'abstract {subject} art'
  ]
}

export const applyTemplate = (template: string, subject: string): string => {
  return template.replace('{subject}', subject)
}