import { useState, useRef } from 'react'
import Image from 'next/image'

export default function WatermarkRemover() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('請選擇圖像文件')
        return
      }
      
      setSelectedFile(file)
      setError(null)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeWatermark = async () => {
    if (!selectedFile) {
      setError('請先選擇圖像文件')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await fetch('/api/remove-watermark', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('去水印處理失敗')
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setProcessedImage(imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : '處理圖像時發生錯誤')
    } finally {
      setLoading(false)
    }
  }

  const downloadProcessedImage = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      link.download = 'watermark-removed.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">去水印工具</h2>
        <p className="text-gray-600 mb-6">
          上傳帶有水印的圖像，AI將自動檢測並移除水印
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            選擇圖像文件
          </label>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              選擇文件
            </button>
            {selectedFile && (
              <span className="text-sm text-gray-600">{selectedFile.name}</span>
            )}
          </div>
        </div>

        {previewUrl && (
          <div>
            <h3 className="text-lg font-medium mb-2 text-gray-800">原始圖像</h3>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden max-w-md">
              <Image
                src={previewUrl}
                alt="Original image"
                width={400}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        <button
          onClick={removeWatermark}
          disabled={!selectedFile || loading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? '處理中...' : '移除水印'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {processedImage && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 text-gray-800">處理結果</h3>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden max-w-md">
            <Image
              src={processedImage}
              alt="Processed image"
              width={400}
              height={300}
              className="w-full h-auto"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={downloadProcessedImage}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              下載處理後的圖像
            </button>
          </div>
        </div>
      )}
    </div>
  )
}