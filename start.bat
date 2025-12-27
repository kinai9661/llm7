@echo off
title LLM7 圖像工具啟動器

echo.
echo ╔══════════════════════════════════════╗
echo ║          LLM7 圖像工具啟動器          ║
echo ╚══════════════════════════════════════╝
echo.

echo 🔍 檢查環境配置...
if not exist ".env.local" (
    echo ❌ 環境配置文件不存在
    echo 💡 請先運行 setup-env.bat
    pause
    exit /b 1
)

echo ✅ 環境配置文件已找到
echo.

echo 📦 安裝依賴...
call npm install
if errorlevel 1 (
    echo ❌ 依賴安裝失敗
    pause
    exit /b 1
)

echo ✅ 依賴安裝完成
echo.

echo 🧪 測試API配置...
call npm run test-api
echo.

echo 🚀 啟動開發服務器...
echo 💡 服務器啟動後，訪問 http://localhost:3000
echo 🛑 按 Ctrl+C 停止服務器
echo.

call npm run dev