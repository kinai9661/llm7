# 環境變量配置指南

本文檔詳細說明了LLM7項目的所有環境變量配置選項。

## 快速開始

### 自動初始化
```bash
npm run init-env
```

### 手動配置
1. 複製 `.env.example` 到 `.env.local`
2. 根據需要修改配置值
3. 運行 `npm run check-env` 驗證配置

## 環境變量詳解

### 基本配置

#### `NODE_ENV`
- **描述**: 運行環境
- **可選值**: `development`, `production`, `test`
- **默認值**: `development`
- **示例**: `NODE_ENV=production`

#### `NEXT_TELEMETRY_DISABLED`
- **描述**: 禁用Next.js遙測
- **可選值**: `1`, `0`
- **默認值**: `1`
- **建議**: 保持為 `1`

#### `NEXT_PUBLIC_APP_URL`
- **描述**: 應用的公開URL
- **格式**: 完整的URL（包含協議）
- **示例**: `NEXT_PUBLIC_APP_URL=https://llm7.vercel.app`
- **注意**: 生產環境建議設置

#### `VERCEL_URL`
- **描述**: Vercel自動提供的URL
- **格式**: 域名（不含協議）
- **示例**: `VERCEL_URL=llm7-abc123.vercel.app`
- **注意**: Vercel部署時自動設置

### AI模型API密鑰

#### `OPENAI_API_KEY`
- **描述**: OpenAI API密鑰或兼容API的密鑰
- **獲取**: [OpenAI API Keys](https://platform.openai.com/api-keys) 或自定義API提供商
- **格式**: `sk-...` 或自定義格式
- **模型**: DALL-E 2, DALL-E 3 或兼容模型
- **費用**: 按使用量計費

#### `OPENAI_BASE_URL`
- **描述**: 自定義OpenAI兼容API的基礎URL
- **默認值**: `https://api.openai.com/v1`
- **示例**: `https://api.llm7.io/v1`
- **用途**: 支持第三方OpenAI兼容API服務
- **注意**: 可選，不設置則使用官方OpenAI API

#### `REPLICATE_API_TOKEN`
- **描述**: Replicate API令牌
- **獲取**: [Replicate API Tokens](https://replicate.com/account/api-tokens)
- **格式**: `r8_...`
- **模型**: SDXL Lightning, Flux Schnell
- **費用**: 按使用量計費

#### `HUGGINGFACE_API_KEY`
- **描述**: Hugging Face API密鑰
- **獲取**: [Hugging Face Tokens](https://huggingface.co/settings/tokens)
- **格式**: `hf_...`
- **模型**: Stable Diffusion 2.1, Dreamlike Anime
- **費用**: 免費（有速率限制）

#### `STABILITY_API_KEY`
- **描述**: Stability AI API密鑰
- **獲取**: [Stability AI Keys](https://platform.stability.ai/account/keys)
- **格式**: `sk-...`
- **模型**: Stable Diffusion XL, Stable Diffusion v1.6
- **費用**: 按使用量計費

### 功能開關

#### `ENABLE_OPENAI`
- **描述**: 啟用/禁用OpenAI模型
- **可選值**: `true`, `false`
- **默認值**: `true`
- **注意**: 需要配置 `OPENAI_API_KEY`

#### `ENABLE_REPLICATE`
- **描述**: 啟用/禁用Replicate模型
- **可選值**: `true`, `false`
- **默認值**: `true`
- **注意**: 需要配置 `REPLICATE_API_TOKEN`

#### `ENABLE_HUGGINGFACE`
- **描述**: 啟用/禁用Hugging Face模型
- **可選值**: `true`, `false`
- **默認值**: `true`
- **注意**: 需要配置 `HUGGINGFACE_API_KEY`

#### `ENABLE_STABILITY`
- **描述**: 啟用/禁用Stability AI模型
- **可選值**: `true`, `false`
- **默認值**: `true`
- **注意**: 需要配置 `STABILITY_API_KEY`

#### `ENABLE_WATERMARK_REMOVAL`
- **描述**: 啟用/禁用去水印功能
- **可選值**: `true`, `false`
- **默認值**: `true`

### 系統配置

#### `MAX_FILE_SIZE`
- **描述**: 最大文件上傳大小（字節）
- **默認值**: `10485760` (10MB)
- **範圍**: 1MB - 50MB
- **示例**: `MAX_FILE_SIZE=20971520` (20MB)

#### `SUPPORTED_FORMATS`
- **描述**: 支持的圖像格式
- **默認值**: `png,jpg,jpeg,webp,gif`
- **格式**: 逗號分隔的格式列表
- **可選格式**: `png`, `jpg`, `jpeg`, `webp`, `gif`, `bmp`

#### `RATE_LIMIT_REQUESTS`
- **描述**: 速率限制 - 每個時間窗口的最大請求數
- **默認值**: `10`
- **範圍**: 1-1000
- **建議**: 開發環境可設置較高值

#### `RATE_LIMIT_WINDOW`
- **描述**: 速率限制時間窗口（毫秒）
- **默認值**: `60000` (1分鐘)
- **範圍**: 1000ms - 3600000ms (1小時)
- **示例**: `RATE_LIMIT_WINDOW=300000` (5分鐘)

#### `CORS_ORIGINS`
- **描述**: 允許的CORS來源
- **默認值**: `*`
- **格式**: 逗號分隔的URL列表
- **示例**: `CORS_ORIGINS=https://example.com,https://app.example.com`
- **安全**: 生產環境建議設置具體域名

## 環境配置示例

### 開發環境
```env
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
ENABLE_WATERMARK_REMOVAL=true
MAX_FILE_SIZE=10485760
RATE_LIMIT_REQUESTS=100
CORS_ORIGINS=*
```

### 生產環境
```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_APP_URL=https://your-domain.com
OPENAI_API_KEY=sk-your-key-here
REPLICATE_API_TOKEN=r8_your-token-here
ENABLE_OPENAI=true
ENABLE_REPLICATE=true
MAX_FILE_SIZE=10485760
RATE_LIMIT_REQUESTS=10
CORS_ORIGINS=https://your-domain.com
```

### 僅免費模型
```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
HUGGINGFACE_API_KEY=hf_your-key-here
ENABLE_OPENAI=false
ENABLE_REPLICATE=false
ENABLE_HUGGINGFACE=true
ENABLE_STABILITY=false
```

## 驗證和調試

### 檢查配置
```bash
npm run check-env
```

### 查看環境狀態
訪問應用的"環境狀態"標籤頁，或直接訪問 `/api/env-status`

### 常見問題

#### API密鑰無效
- 檢查密鑰格式是否正確
- 確認密鑰是否有效且有足夠額度
- 檢查對應的功能開關是否啟用

#### 文件上傳失敗
- 檢查 `MAX_FILE_SIZE` 設置
- 確認文件格式在 `SUPPORTED_FORMATS` 中
- 檢查 `ENABLE_WATERMARK_REMOVAL` 設置

#### 速率限制問題
- 調整 `RATE_LIMIT_REQUESTS` 和 `RATE_LIMIT_WINDOW`
- 開發環境可以設置更寬鬆的限制

## 安全建議

1. **不要提交 `.env.local` 到版本控制**
2. **生產環境使用具體的CORS來源**
3. **定期輪換API密鑰**
4. **監控API使用量和費用**
5. **設置適當的速率限制**

## Vercel部署

在Vercel項目設置中添加環境變量：

1. 進入項目設置 → Environment Variables
2. 添加所需的環境變量
3. 重新部署項目

**注意**: Vercel會自動設置 `VERCEL_URL`，無需手動配置。