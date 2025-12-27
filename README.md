# LLM7 圖像工具

一個基於Next.js的AI圖像生成和去水印工具，支持Vercel部署。

## 功能特色

### 🎨 多模型AI圖像生成
- 支持多個AI模型提供商（OpenAI、Replicate、Hugging Face、Stability AI）
- 自動檢測可用模型
- 免費和付費模型選擇
- 高級參數調整（解析度、步數、引導強度）
- 實時生成進度和元數據顯示

### 🔧 智能去水印
- 自動檢測水印區域
- AI驅動的水印移除算法
- 支持多種圖像格式
- 批量處理能力

### ⚙️ 模型管理
- 實時檢測API密鑰狀態
- 多提供商模型支持
- 免費模型自動回退
- 詳細的模型信息展示

## 技術棧

- **前端**: Next.js 14, React 18, TypeScript
- **樣式**: Tailwind CSS
- **圖像處理**: Sharp, Canvas API
- **AI模型**: OpenAI DALL-E, Replicate, Hugging Face, Stability AI
- **部署**: Vercel
- **文件上傳**: Multer

## 快速開始

### 本地開發

1. 安裝依賴
```bash
npm install
```

2. 啟動開發服務器
```bash
npm run dev
```

3. 打開瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### Vercel部署

1. 將代碼推送到GitHub倉庫

2. 在Vercel中導入項目

3. 配置環境變量（如需要）

4. 部署完成

## 項目結構

```
llm7/
├── components/          # React組件
│   ├── ImageGenerator.tsx
│   └── WatermarkRemover.tsx
├── pages/              # Next.js頁面
│   ├── api/           # API路由
│   │   ├── generate-image.ts
│   │   └── remove-watermark.ts
│   ├── _app.tsx
│   └── index.tsx
├── styles/            # 樣式文件
│   └── globals.css
├── public/            # 靜態資源
├── next.config.js     # Next.js配置
├── tailwind.config.js # Tailwind配置
├── vercel.json        # Vercel部署配置
└── package.json       # 項目依賴
```

## API端點

### POST /api/generate-image
生成AI圖像

**請求體:**
```json
{
  "prompt": "圖像描述文字"
}
```

**響應:**
```json
{
  "imageUrl": "data:image/png;base64,..."
}
```

### POST /api/remove-watermark
移除圖像水印

**請求:** FormData with image file

**響應:** 處理後的圖像文件

## 使用說明

### 圖像生成
1. 在"AI圖像生成"標籤頁中選擇AI模型
2. 輸入圖像描述（支持中英文）
3. 調整高級參數（可選）
4. 點擊"生成圖像"按鈕
5. 等待AI處理完成
6. 查看生成元數據
7. 下載或複製圖像URL

### 去水印
1. 切換到"去水印工具"標籤頁
2. 選擇帶有水印的圖像文件
3. 點擊"移除水印"按鈕
4. 下載處理後的圖像

### 模型管理
1. 切換到"模型管理"標籤頁
2. 查看API提供商狀態
3. 瀏覽可用模型列表
4. 配置API密鑰（按需）
5. 刷新模型狀態

## 配置選項

### 環境變量
- `NEXT_TELEMETRY_DISABLED`: 禁用Next.js遙測
- `NODE_ENV`: 運行環境
- `OPENAI_API_KEY`: OpenAI API密鑰（可選）
- `REPLICATE_API_TOKEN`: Replicate API令牌（可選）
- `HUGGINGFACE_API_KEY`: Hugging Face API密鑰（可選）
- `STABILITY_API_KEY`: Stability AI API密鑰（可選）

### Vercel配置
- 最大執行時間: 30秒
- 文件大小限制: 10MB
- 支持的圖像格式: PNG, JPG, JPEG, WebP

## 性能優化

- 圖像處理使用Sharp進行優化
- Canvas API用於高級圖像操作
- 響應式設計適配移動設備
- 懶加載和代碼分割

## 故障排除

### 常見問題

1. **圖像生成失敗**
   - 檢查提示詞是否過長
   - 確認網絡連接正常

2. **去水印效果不佳**
   - 嘗試不同的圖像格式
   - 確保水印不是圖像的主要內容

3. **部署問題**
   - 檢查Vercel配置
   - 確認所有依賴已正確安裝

## 貢獻指南

1. Fork項目
2. 創建功能分支
3. 提交更改
4. 推送到分支
5. 創建Pull Request

## 許可證

MIT License

## 聯繫方式

如有問題或建議，請創建Issue或聯繫開發團隊。