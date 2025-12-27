#!/bin/bash

# Vercel Build Script for Next.js
echo "🔧 Starting Next.js build process..."

# 確保使用正確的 Node.js 版本
echo "📦 Node.js version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# 清理可能的衝突
echo "🧹 Cleaning up..."
rm -rf .next
rm -rf dist
rm -rf build
rm -rf node_modules/.cache

# 安裝依賴
echo "📥 Installing dependencies..."
npm ci

# 運行 Next.js 構建
echo "🏗️ Building Next.js application..."
npm run build

# 檢查構建結果
if [ -d ".next" ]; then
    echo "✅ Next.js build successful - .next directory created"
    ls -la .next/
else
    echo "❌ Next.js build failed - .next directory not found"
    exit 1
fi

echo "🎉 Build completed successfully!"