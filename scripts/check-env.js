#!/usr/bin/env node

// 簡單的環境變量檢查腳本
const fs = require('fs')
const path = require('path')

function checkEnvironment() {
  console.log('🔍 檢查環境配置...\n')
  
  const envFiles = ['.env.local', '.env']
  let envFound = false
  
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile)
    if (fs.existsSync(envPath)) {
      console.log(`✅ 找到環境文件: ${envFile}`)
      envFound = true
      break
    }
  }
  
  if (!envFound) {
    console.log('⚠️  未找到環境配置文件')
    console.log('💡 運行 npm run init-env 創建配置文件')
    return
  }
  
  // 檢查關鍵環境變量
  const checks = [
    { name: 'NODE_ENV', value: process.env.NODE_ENV, required: false },
    { name: 'NEXT_TELEMETRY_DISABLED', value: process.env.NEXT_TELEMETRY_DISABLED, required: false },
    { name: 'MAX_FILE_SIZE', value: process.env.MAX_FILE_SIZE, required: false },
    { name: 'RATE_LIMIT_REQUESTS', value: process.env.RATE_LIMIT_REQUESTS, required: false }
  ]
  
  console.log('\n📋 環境變量檢查:')
  checks.forEach(check => {
    const status = check.value ? '✅' : (check.required ? '❌' : '⚠️ ')
    console.log(`   ${status} ${check.name}: ${check.value || '未設置'}`)
  })
  
  // 檢查API密鑰
  const apiKeys = [
    { name: 'OPENAI_API_KEY', value: process.env.OPENAI_API_KEY },
    { name: 'REPLICATE_API_TOKEN', value: process.env.REPLICATE_API_TOKEN },
    { name: 'HUGGINGFACE_API_KEY', value: process.env.HUGGINGFACE_API_KEY },
    { name: 'STABILITY_API_KEY', value: process.env.STABILITY_API_KEY }
  ]
  
  const configuredKeys = apiKeys.filter(key => key.value).length
  console.log(`\n🔑 API密鑰: ${configuredKeys}/${apiKeys.length} 已配置`)
  
  if (configuredKeys === 0) {
    console.log('💡 至少配置一個API密鑰以使用AI模型')
  }
  
  console.log('\n✅ 環境配置檢查完成')
}

checkEnvironment()