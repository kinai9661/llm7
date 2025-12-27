@echo off
echo 🚀 LLM7 環境變量設置工具
echo.

echo ✅ 基本環境變量已設置
echo ✅ 本地Canvas生成器已啟用
echo.

echo 📋 當前配置:
echo    - NODE_ENV: development
echo    - 去水印功能: 已啟用
echo    - 本地圖像生成: 已啟用
echo    - 最大文件大小: 10MB
echo.

echo 💡 可選: 添加AI模型API密鑰
echo.
echo 🔑 支持的AI模型:
echo    1. OpenAI DALL-E (付費)
echo    2. Hugging Face (免費)
echo    3. Replicate (付費)
echo    4. Stability AI (付費)
echo.

echo 📝 要添加API密鑰，請編輯 .env.local 文件
echo    例如: OPENAI_API_KEY=sk-your-key-here
echo.

echo 🚀 啟動開發服務器:
echo    npm install
echo    npm run dev
echo.

echo ✨ 訪問 http://localhost:3000 開始使用!
pause