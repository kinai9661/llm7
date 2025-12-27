# 🔧 LLM7 環境變量設置指南

## 快速開始

### 1. 基本設置（已完成）
✅ 已創建 `.env.local` 文件，包含基本配置
✅ 本地Canvas生成器已啟用，無需API密鑰即可使用

### 2. 測試基本功能
```bash
npm install
npm run dev
```
訪問 http://localhost:3000 即可使用本地圖像生成功能

## 🔑 添加AI模型API密鑰（可選）

### OpenAI (DALL-E)
1. 訪問 https://platform.openai.com/api-keys
2. 創建新的API密鑰
3. 在 `.env.local` 中取消註釋並設置：
```env
OPENAI_API_KEY=sk-your-actual-key-here
ENABLE_OPENAI=true
```

### Hugging Face (免費)
1. 訪問 https://huggingface.co/settings/tokens
2. 創建新的訪問令牌
3. 在 `.env.local` 中設置：
```env
HUGGINGFACE_API_KEY=hf_your-actual-key-here
ENABLE_HUGGINGFACE=true
```

### Replicate
1. 訪問 https://replicate.com/account/api-tokens
2. 創建新的API令牌
3. 在 `.env.local` 中設置：
```env
REPLICATE_API_TOKEN=r8_your-actual-token-here
ENABLE_REPLICATE=true
```

### Stability AI
1. 訪問 https://platform.stability.ai/account/keys
2. 創建新的API密鑰
3. 在 `.env.local` 中設置：
```env
STABILITY_API_KEY=sk-your-actual-key-here
ENABLE_STABILITY=true
```

## 🛠 配置驗證

### 檢查環境配置
```bash
npm run check-env
```

### 查看環境狀態
啟動應用後，點擊"環境狀態"標籤頁查看詳細信息

## 📋 當前配置狀態

### ✅ 已啟用功能
- 本地Canvas圖像生成器
- 去水印工具
- 環境狀態監控
- 速率限制保護

### ⚠️ 需要API密鑰的功能
- OpenAI DALL-E 模型
- Hugging Face 模型
- Replicate 模型
- Stability AI 模型

## 🚀 部署到Vercel

### 1. 推送到GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. 在Vercel中設置環境變量
1. 進入Vercel項目設置
2. 點擊 Environment Variables
3. 添加以下變量：

**必需變量：**
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
ENABLE_WATERMARK_REMOVAL=true
```

**可選變量（如果有API密鑰）：**
```
OPENAI_API_KEY=your-key
ENABLE_OPENAI=true
HUGGINGFACE_API_KEY=your-key
ENABLE_HUGGINGFACE=true
```

### 3. 重新部署
設置完環境變量後，Vercel會自動重新部署

## 💡 使用建議

### 開發環境
- 使用本地Canvas生成器進行開發和測試
- 逐步添加API密鑰測試不同模型

### 生產環境
- 至少配置一個AI模型API密鑰
- 設置適當的速率限制
- 監控API使用量和費用

## 🔍 故障排除

### 常見問題

1. **應用無法啟動**
   - 檢查 `.env.local` 文件格式
   - 確保沒有語法錯誤

2. **API密鑰無效**
   - 檢查密鑰格式是否正確
   - 確認密鑰有效且有足夠額度

3. **圖像生成失敗**
   - 檢查網絡連接
   - 查看瀏覽器控制台錯誤信息

### 獲取幫助
- 查看 `docs/ENVIRONMENT.md` 詳細文檔
- 檢查應用的"環境狀態"頁面
- 查看瀏覽器開發者工具的控制台

## 📞 支持

如果遇到問題，請檢查：
1. `.env.local` 文件是否存在且格式正確
2. API密鑰是否有效
3. 網絡連接是否正常
4. 瀏覽器控制台是否有錯誤信息