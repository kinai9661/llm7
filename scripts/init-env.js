#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function initializeEnvironment() {
  console.log('🚀 LLM7 環境變量初始化工具\n')
  
  const envPath = path.join(process.cwd(), '.env.local')
  const examplePath = path.join(process.cwd(), '.env.example')
  
  // 檢查是否已存在 .env.local
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env.local 已存在，是否覆蓋？ (y/N): ')
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ 已取消初始化')
      rl.close()
      return
    }
  }
  
  console.log('📝 請配置以下環境變量（按Enter跳過）:\n')
  
  const config = {}
  
  // 基本配置
  console.log('=== 基本配置 ===')
  config.NODE_ENV = await question('環境 (development/production) [development]: ') || 'development'
  config.NEXT_TELEMETRY_DISABLED = '1'
  
  if (config.NODE_ENV === 'production') {
    config.NEXT_PUBLIC_APP_URL = await question('應用URL: ')
  }
  
  // API密鑰配置
  console.log('\n=== AI模型API密鑰 ===')
  console.log('💡 提示：可以稍後在 .env.local 文件中手動添加')
  
  const openaiKey = await question('OpenAI API Key: ')
  if (openaiKey) config.OPENAI_API_KEY = openaiKey
  
  const replicateToken = await question('Replicate API Token: ')
  if (replicateToken) config.REPLICATE_API_TOKEN = replicateToken
  
  const huggingfaceKey = await question('Hugging Face API Key: ')
  if (huggingfaceKey) config.HUGGINGFACE_API_KEY = huggingfaceKey
  
  const stabilityKey = await question('Stability AI API Key: ')
  if (stabilityKey) config.STABILITY_API_KEY = stabilityKey
  
  // 功能開關
  console.log('\n=== 功能配置 ===')
  const enableWatermark = await question('啟用去水印功能？ (Y/n): ')
  config.ENABLE_WATERMARK_REMOVAL = enableWatermark.toLowerCase() !== 'n' ? 'true' : 'false'
  
  // 高級配置
  console.log('\n=== 高級配置 ===')
  const maxFileSize = await question('最大文件大小 (MB) [10]: ')
  config.MAX_FILE_SIZE = (parseInt(maxFileSize) || 10) * 1024 * 1024
  
  const rateLimit = await question('速率限制 (每分鐘請求數) [10]: ')
  config.RATE_LIMIT_REQUESTS = parseInt(rateLimit) || 10
  
  // 生成 .env.local 文件
  let envContent = '# LLM7 環境配置\n'
  envContent += `# 生成時間: ${new Date().toISOString()}\n\n`
  
  envContent += '# 基本配置\n'
  envContent += `NODE_ENV=${config.NODE_ENV}\n`
  envContent += `NEXT_TELEMETRY_DISABLED=${config.NEXT_TELEMETRY_DISABLED}\n`
  if (config.NEXT_PUBLIC_APP_URL) {
    envContent += `NEXT_PUBLIC_APP_URL=${config.NEXT_PUBLIC_APP_URL}\n`
  }
  
  envContent += '\n# AI模型API密鑰\n'
  if (config.OPENAI_API_KEY) envContent += `OPENAI_API_KEY=${config.OPENAI_API_KEY}\n`
  if (config.REPLICATE_API_TOKEN) envContent += `REPLICATE_API_TOKEN=${config.REPLICATE_API_TOKEN}\n`
  if (config.HUGGINGFACE_API_KEY) envContent += `HUGGINGFACE_API_KEY=${config.HUGGINGFACE_API_KEY}\n`
  if (config.STABILITY_API_KEY) envContent += `STABILITY_API_KEY=${config.STABILITY_API_KEY}\n`
  
  envContent += '\n# 功能開關\n'
  envContent += `ENABLE_OPENAI=${config.OPENAI_API_KEY ? 'true' : 'false'}\n`
  envContent += `ENABLE_REPLICATE=${config.REPLICATE_API_TOKEN ? 'true' : 'false'}\n`
  envContent += `ENABLE_HUGGINGFACE=${config.HUGGINGFACE_API_KEY ? 'true' : 'false'}\n`
  envContent += `ENABLE_STABILITY=${config.STABILITY_API_KEY ? 'true' : 'false'}\n`
  envContent += `ENABLE_WATERMARK_REMOVAL=${config.ENABLE_WATERMARK_REMOVAL}\n`
  
  envContent += '\n# 系統配置\n'
  envContent += `MAX_FILE_SIZE=${config.MAX_FILE_SIZE}\n`
  envContent += `RATE_LIMIT_REQUESTS=${config.RATE_LIMIT_REQUESTS}\n`
  envContent += 'RATE_LIMIT_WINDOW=60000\n'
  envContent += 'SUPPORTED_FORMATS=png,jpg,jpeg,webp,gif\n'
  envContent += 'CORS_ORIGINS=*\n'
  
  try {
    fs.writeFileSync(envPath, envContent)
    console.log('\n✅ 環境配置已保存到 .env.local')
    
    // 顯示配置摘要
    console.log('\n📊 配置摘要:')
    console.log(`   環境: ${config.NODE_ENV}`)
    console.log(`   API密鑰: ${Object.keys(config).filter(k => k.includes('API')).length} 個`)
    console.log(`   最大文件大小: ${config.MAX_FILE_SIZE / 1024 / 1024}MB`)
    console.log(`   速率限制: ${config.RATE_LIMIT_REQUESTS} 請求/分鐘`)
    
    console.log('\n🎉 初始化完成！')
    console.log('💡 提示: 你可以隨時編輯 .env.local 文件來修改配置')
    console.log('🚀 運行 npm run dev 啟動開發服務器')
    
  } catch (error) {
    console.error('\n❌ 保存配置文件失敗:', error.message)
  }
  
  rl.close()
}

// 運行初始化
initializeEnvironment().catch(console.error)