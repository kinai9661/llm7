# 🔑 API密鑰設置指南

## 當前狀態
✅ 基本環境已配置完成
✅ LLM7.io API已配置並啟用
✅ 本地Canvas生成器可用（無需API密鑰）

## 已配置的API

### LLM7.io API（已設置）
✅ **API地址**: https://api.llm7.io/v1
✅ **API密鑰**: 已配置
✅ **模型**: DALL-E 2, DALL-E 3 兼容

**當前配置:**
```env
OPENAI_API_KEY=9AakmnJR+Tknqtg4jcJ2DsL0MPS/RI5PfyoWSk7Zc43RhFJqWuWdW6rlkxLYjrGL17Xa+Ky39nwjQIFk3dpD/N/IDeBkiplfRaXkxgQAab3YtUBejFBl7F+XA0xkaBYvcJ/ljQ==
OPENAI_BASE_URL=https://api.llm7.io/v1
ENABLE_OPENAI=true
```

## 添加其他AI模型API密鑰（可選）

### 1. 自定義OpenAI兼容API（如LLM7.io）
**已配置示例 - LLM7.io:**
```env
OPENAI_API_KEY=your-custom-api-key
OPENAI_BASE_URL=https://api.llm7.io/v1
ENABLE_OPENAI=true
```

**支持的自定義API提供商:**
- LLM7.io - 已配置
- OpenRouter
- Together AI
- 其他OpenAI兼容的API服務

### 2. 原版OpenAI DALL-E
**獲取API密鑰：**
1. 訪問 https://platform.openai.com/api-keys
2. 點擊 "Create new secret key"
3. 複製生成的密鑰（格式：sk-...）

**添加到 .env.local：**
```env
OPENAI_API_KEY=sk-your-actual-key-here
ENABLE_OPENAI=true
```

### 2. Hugging Face（免費）
**獲取API密鑰：**
1. 訪問 https://huggingface.co/settings/tokens
2. 點擊 "New token"
3. 選擇 "Read" 權限
4. 複製生成的令牌（格式：hf_...）

**添加到 .env.local：**
```env
HUGGINGFACE_API_KEY=hf_your-actual-key-here
ENABLE_HUGGINGFACE=true
```

### 3. Replicate
**獲取API密鑰：**
1. 訪問 https://replicate.com/account/api-tokens
2. 點擊 "Create token"
3. 複製生成的令牌（格式：r8_...）

**添加到 .env.local：**
```env
REPLICATE_API_TOKEN=r8_your-actual-token-here
ENABLE_REPLICATE=true
```

### 4. Stability AI
**獲取API密鑰：**
1. 訪問 https://platform.stability.ai/account/keys
2. 點擊 "Create API Key"
3. 複製生成的密鑰（格式：sk-...）

**添加到 .env.local：**
```env
STABILITY_API_KEY=sk-your-actual-key-here
ENABLE_STABILITY=true
```

## 完整的 .env.local 示例

### 使用LLM7.io API（當前配置）
```env
# LLM7 環境配置
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# 自定義API配置 (LLM7.io)
OPENAI_API_KEY=9AakmnJR+Tknqtg4jcJ2DsL0MPS/RI5PfyoWSk7Zc43RhFJqWuWdW6rlkxLYjrGL17Xa+Ky39nwjQIFk3dpD/N/IDeBkiplfRaXkxgQAab3YtUBejFBl7F+XA0xkaBYvcJ/ljQ==
OPENAI_BASE_URL=https://api.llm7.io/v1

# 功能開關
ENABLE_OPENAI=true
ENABLE_WATERMARK_REMOVAL=true

# 系統配置
MAX_FILE_SIZE=10485760
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60000
SUPPORTED_FORMATS=png,jpg,jpeg,webp,gif
CORS_ORIGINS=*
```

### 使用多個API提供商
```env
# LLM7 環境配置
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# AI模型API密鑰
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_BASE_URL=https://api.llm7.io/v1  # 可選：自定義API端點
HUGGINGFACE_API_KEY=hf_your-huggingface-key-here

# 功能開關
ENABLE_OPENAI=true
ENABLE_HUGGINGFACE=true
ENABLE_WATERMARK_REMOVAL=true

# 系統配置
MAX_FILE_SIZE=10485760
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60000
SUPPORTED_FORMATS=png,jpg,jpeg,webp,gif
CORS_ORIGINS=*
```

## 驗證設置

### 1. 檢查配置
```bash
npm run check-env
```

### 2. 啟動應用
```bash
npm run dev
```

### 3. 測試功能
1. 訪問 http://localhost:3000
2. 點擊"環境狀態"標籤頁
3. 查看API提供商狀態
4. 測試圖像生成功能

## 費用說明

### 免費選項
- **本地Canvas生成器**: 完全免費
- **Hugging Face**: 免費，但有速率限制

### 付費選項
- **OpenAI DALL-E**: ~$0.02-0.08 每張圖
- **Replicate**: 按使用量計費
- **Stability AI**: 按使用量計費

## 安全提醒

⚠️ **重要**: 
- 不要將API密鑰提交到版本控制
- 定期輪換API密鑰
- 監控API使用量
- 設置使用限制和警報