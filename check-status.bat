@echo off
title LLM7 環境狀態檢查

echo.
echo ╔══════════════════════════════════════╗
echo ║        LLM7 環境狀態檢查工具          ║
echo ╚══════════════════════════════════════╝
echo.

echo 📋 檢查環境配置文件...
if exist ".env.local" (
    echo ✅ .env.local 文件存在
) else (
    echo ❌ .env.local 文件不存在
    echo 💡 請先運行 setup-env.bat
    goto :end
)

echo.
echo 📄 當前環境配置:
echo ----------------------------------------
type .env.local
echo ----------------------------------------
echo.

echo 🔍 檢查Node.js和npm...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安裝
    echo 💡 請從 https://nodejs.org 下載安裝
) else (
    echo ✅ Node.js 已安裝: 
    node --version
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm 未安裝
) else (
    echo ✅ npm 已安裝: 
    npm --version
)

echo.
echo 📦 檢查依賴...
if exist "node_modules" (
    echo ✅ 依賴已安裝
) else (
    echo ⚠️  依賴未安裝
    echo 💡 運行 npm install 安裝依賴
)

echo.
echo 🎯 快速啟動:
echo    1. 運行 start.bat 啟動開發服務器
echo    2. 訪問 http://localhost:3000
echo    3. 查看"環境狀態"標籤頁了解詳細信息
echo.

:end
pause