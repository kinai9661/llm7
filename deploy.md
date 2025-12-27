# 部署指南

## Vercel部署步驟

### 1. 準備工作
確保你的項目已經推送到GitHub倉庫。

### 2. Vercel部署
1. 訪問 [vercel.com](https://vercel.com)
2. 使用GitHub帳號登錄
3. 點擊 "New Project"
4. 選擇你的GitHub倉庫
5. 配置項目設置：
   - Framework Preset: Next.js
   - Root Directory: llm7 (如果項目在子目錄中)
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. 環境變量配置
在Vercel項目設置中添加以下環境變量：
```
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

### 4. 部署完成
點擊 "Deploy" 按鈕，等待部署完成。

## 本地測試部署版本

```bash
# 安裝依賴
npm install

# 構建項目
npm run build

# 啟動生產版本
npm start
```

## 故障排除

### 常見部署問題

1. **Canvas依賴問題**
   - Vercel自動處理canvas依賴
   - 如果遇到問題，檢查next.config.js配置

2. **文件大小限制**
   - Vercel免費版有10MB文件限制
   - 大文件處理可能需要升級計劃

3. **API超時**
   - 免費版API執行時間限制為10秒
   - 複雜圖像處理可能需要優化

### 性能優化建議

1. **圖像壓縮**
   - 使用Sharp進行圖像優化
   - 設置合適的圖像質量參數

2. **緩存策略**
   - 利用Vercel的邊緣緩存
   - 設置適當的Cache-Control頭

3. **代碼分割**
   - 使用動態導入
   - 按需加載組件