import { useState } from 'react'
import Head from 'next/head'
import ImageGenerator from '../components/ImageGenerator'
import WatermarkRemover from '../components/WatermarkRemover'
import ModelManager from '../components/ModelManager'
import EnvironmentStatus from '../components/EnvironmentStatus'
import GenerationHistory from '../components/GenerationHistory'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'remove' | 'models' | 'env' | 'history'>('generate')

  return (
    <>
      <Head>
        <title>LLM7 圖像工具</title>
        <meta name="description" content="AI圖像生成和去水印工具" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            LLM7 圖像工具
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-md flex flex-wrap">
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                    activeTab === 'generate'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  🎨 AI 圖像生成
                </button>
                <button
                  onClick={() => setActiveTab('remove')}
                  className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                    activeTab === 'remove'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  🔧 去水印工具
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                    activeTab === 'history'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  📚 生成歷史
                </button>
                <button
                  onClick={() => setActiveTab('models')}
                  className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                    activeTab === 'models'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  ⚙️ 模型管理
                </button>
                <button
                  onClick={() => setActiveTab('env')}
                  className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                    activeTab === 'env'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  📊 環境狀態
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              {activeTab === 'generate' ? (
                <ImageGenerator />
              ) : activeTab === 'remove' ? (
                <WatermarkRemover />
              ) : activeTab === 'history' ? (
                <GenerationHistory />
              ) : activeTab === 'models' ? (
                <ModelManager />
              ) : (
                <EnvironmentStatus />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}