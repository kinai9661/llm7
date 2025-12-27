// app/page.tsx
'use client';

import { useState } from 'react';
import { UploadIcon, DownloadIcon } from '@radix-ui/react-icons';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cleanImage, setCleanImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoading(true);

    // 預覽原圖
    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/remove-watermark', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '處理失敗');
      }

      setCleanImage(data.result[0]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!cleanImage) return;
    const link = document.createElement('a');
    link.href = cleanImage;
    link.download = 'cleaned-image.png';
    link.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          LLM7 圖像去水印工具
        </h1>
        <p className="text-gray-300 text-center mb-8">
          使用 AI 智能移除圖片水印,保持背景完整
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          {/* 上傳區域 */}
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-purple-400 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon className="w-12 h-12 text-white mb-4" />
              <p className="mb-2 text-white font-medium">點擊上傳圖片</p>
              <p className="text-sm text-gray-300">PNG, JPG 或 WEBP (最大 10MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
            />
          </label>

          {/* 錯誤提示 */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* 處理中 */}
          {loading && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400"></div>
              <p className="text-white mt-4">AI 處理中,請稍候...</p>
            </div>
          )}

          {/* 結果對比 */}
          {originalImage && cleanImage && !loading && (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-medium mb-2">原始圖片</h3>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">去水印後</h3>
                <img
                  src={cleanImage}
                  alt="Cleaned"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          {/* 下載按鈕 */}
          {cleanImage && !loading && (
            <div className="mt-6 text-center">
              <button
                onClick={downloadImage}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                <DownloadIcon className="w-5 h-5" />
                下載清理後的圖片
              </button>
            </div>
          )}
        </div>

        {/* 說明 */}
        <div className="mt-8 text-center text-gray-300 text-sm">
          <p>使用 Flux Fill Pro AI 模型 + Replicate API</p>
          <p className="mt-2">支援自動檢測並移除各類水印</p>
        </div>
      </div>
    </main>
  );
}
