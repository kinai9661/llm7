#!/usr/bin/env node

// 測試LLM7.io API配置
const fs = require('fs')
const path = require('path')

function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local')
  const env = {}
  
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    const lines = content.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim()
        }
      }
    }
  }
  
  return env
}

async function testAPI() {
  console.log('🧪 測試LLM7.io API配置...\n')
  
  // 載入環境變量
  const env = loadEnvFile()
  
  const apiKey = env.OPENAI_API_KEY
  const baseUrl = env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  
  console.log('📋 當前配置:')
  console.log(`   API Key: ${apiKey ? apiKey.substring(0, 20) + '...' : '未設置'}`)
  console.log(`   Base URL: ${baseUrl}`)
  console.log(`   OpenAI啟用: ${env.ENABLE_OPENAI}`)
  console.log()
  
  if (!apiKey) {
    console.log('❌ API密鑰未設置')
    console.log('💡 請檢查 .env.local 文件中的 OPENAI_API_KEY')
    return
  }
  
  try {
    console.log('🔍 測試API連接...')
    
    // 測試API連接
    const response = await fetch(`${baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      console.log('✅ API連接成功!')
      console.log('🎨 LLM7.io API可以正常使用')
    } else {
      console.log(`⚠️  API響應: ${response.status} ${response.statusText}`)
      console.log('💡 這可能是正常的，某些API不支持模型列表端點')
      console.log('🎯 請在應用中測試圖像生成功能')
    }
    
  } catch (error) {
    console.log('⚠️  連接測試失敗:', error.message)
    console.log('💡 這可能是網絡問題，請在應用中測試實際功能')
  }
  
  console.log('\n🚀 啟動應用測試圖像生成:')
  console.log('   npm run dev')
  console.log('   訪問 http://localhost:3000')
  console.log('   選擇 DALL-E 模型並測試生成')
}

testAPI()