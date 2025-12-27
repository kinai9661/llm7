# LLM7 快速啟動指南

## 🚀 快速開始

### 1. 安裝依賴
```bash
npm install
```

### 2. 配置環境變量
```bash
# 自動配置（推薦）
npm run init-env

# 或手動配置
cp .env.example .env.local
# 編輯 .env.local 文件
```

### 3. 檢查配置
```bash
npm run check-env
```

### 4. 啟動開發服務器
```bash
npm run dev
```

### 5. 訪問應用
打開瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 📋 最小配置

即使不配置任何API密鑰，你也可以使用本地Canvas生成器：

```env
# .env.local
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
ENABLE_WATERMARK_REMOVAL=true
```

## 🔑 添加AI模型

### OpenAI (DALL-E)
1. 獲取API密鑰: https://platform.openai.com/api-keys
2. 添加到 `.env.local`:
```env
OPENAI_API_KEY=sk-your-key-here
ENABLE_OPENAI=true
```

### Hugging Face (免費)
1. 獲取API密鑰: https://huggingface.co/settings/tokens
2. 添加到 `.env.local`:
```env
HUGGINGFACE_API_KEY=hf_your-key-here
ENABLE_HUGGINGFACE=true
```

## 🛠 故障排除

### 常見問題

1. **Canvas依賴安裝失敗**
   ```bash
   # Windows
   npm install --global windows-build-tools
   
   # macOS
   xcode-select --install
   
   # Linux
   sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
   ```

2. **Sharp依賴問題**
   ```bash
   npm rebuild sharp
   ```

3. **環境變量不生效**
   - 確保文件名為 `.env.local`
   - 重啟開發服務器
   - 檢查變量名拼寫

### 檢查狀態
- 訪問"環境狀態"標籤頁查看詳細信息
- 或訪問 `/api/env-status`

## 📦 部署到Vercel

1. 推送代碼到GitHub
2. 在Vercel導入項目
3. 添加環境變量到Vercel項目設置
4. 部署完成

## 💡 提示

- 開發環境使用 `.env.local`
- 生產環境在Vercel設置環境變量
- 本地Canvas生成器無需API密鑰
- 查看 `docs/ENVIRONMENT.md` 了解完整配置選項