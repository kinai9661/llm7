import { useState } from 'react'
import Head from 'next/head'
import ImageGenerator from '../components/ImageGenerator'
import WatermarkRemover from '../components/WatermarkRemover'
import ModelManager from '../components/ModelManager'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generate' | 'remove' | 'models'>('generate')

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
              <div className="bg-white rounded-lg p-1 shadow-md">
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'generate'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  AI 圖像生成
                </button>
                <button
                  onClick={() => setActiveTab('remove')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'remove'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  去水印工具
                </button>
                <button
                  onClick={() => setActiveTab('models')}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === 'models'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  模型管理
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              {activeTab === 'generate' ? (
                <ImageGenerator />
              ) : activeTab === 'remove' ? (
                <WatermarkRemover />
              ) : (
                <ModelManager />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}