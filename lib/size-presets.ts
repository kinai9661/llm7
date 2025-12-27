// 圖片尺寸預設模板
export interface SizePreset {
  id: string
  name: string
  width: number
  height: number
  category: string
  description: string
  icon: string
  aspectRatio: string
  popular: boolean
}

export const SIZE_CATEGORIES = {
  social: '社交媒體',
  print: '印刷設計',
  web: '網頁設計',
  mobile: '移動設備',
  art: '藝術創作',
  video: '視頻相關'
}

export const SIZE_PRESETS: SizePreset[] = [
  // 社交媒體
  {
    id: 'instagram-square',
    name: 'Instagram 正方形',
    width: 1080,
    height: 1080,
    category: 'social',
    description: 'Instagram 貼文標準尺寸',
    icon: '📷',
    aspectRatio: '1:1',
    popular: true
  },
  {
    id: 'instagram-story',
    name: 'Instagram 限時動態',
    width: 1080,
    height: 1920,
    category: 'social',
    description: 'Instagram Stories 垂直尺寸',
    icon: '📱',
    aspectRatio: '9:16',
    popular: true
  },
  {
    id: 'facebook-post',
    name: 'Facebook 貼文',
    width: 1200,
    height: 630,
    category: 'social',
    description: 'Facebook 分享圖片尺寸',
    icon: '👥',
    aspectRatio: '1.91:1',
    popular: true
  },
  {
    id: 'facebook-cover',
    name: 'Facebook 封面',
    width: 1640,
    height: 859,
    category: 'social',
    description: 'Facebook 頁面封面照片',
    icon: '🎭',
    aspectRatio: '1.91:1',
    popular: false
  },
  {
    id: 'twitter-post',
    name: 'Twitter 貼文',
    width: 1024,
    height: 512,
    category: 'social',
    description: 'Twitter 圖片貼文尺寸',
    icon: '🐦',
    aspectRatio: '2:1',
    popular: true
  },
  {
    id: 'twitter-header',
    name: 'Twitter 標題',
    width: 1500,
    height: 500,
    category: 'social',
    description: 'Twitter 個人資料標題',
    icon: '🎪',
    aspectRatio: '3:1',
    popular: false
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn 貼文',
    width: 1200,
    height: 627,
    category: 'social',
    description: 'LinkedIn 分享圖片',
    icon: '💼',
    aspectRatio: '1.91:1',
    popular: false
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube 縮圖',
    width: 1280,
    height: 720,
    category: 'social',
    description: 'YouTube 視頻縮圖',
    icon: '📺',
    aspectRatio: '16:9',
    popular: true
  },
  {
    id: 'tiktok-video',
    name: 'TikTok 視頻',
    width: 1080,
    height: 1920,
    category: 'social',
    description: 'TikTok 垂直視頻尺寸',
    icon: '🎵',
    aspectRatio: '9:16',
    popular: true
  },

  // 印刷設計
  {
    id: 'a4-portrait',
    name: 'A4 直向',
    width: 2480,
    height: 3508,
    category: 'print',
    description: 'A4 紙張直向 (300 DPI)',
    icon: '📄',
    aspectRatio: '√2:1',
    popular: true
  },
  {
    id: 'a4-landscape',
    name: 'A4 橫向',
    width: 3508,
    height: 2480,
    category: 'print',
    description: 'A4 紙張橫向 (300 DPI)',
    icon: '📃',
    aspectRatio: '1:√2',
    popular: false
  },
  {
    id: 'business-card',
    name: '名片',
    width: 1050,
    height: 600,
    category: 'print',
    description: '標準名片尺寸 (300 DPI)',
    icon: '💳',
    aspectRatio: '1.75:1',
    popular: false
  },
  {
    id: 'poster-a3',
    name: 'A3 海報',
    width: 3508,
    height: 4961,
    category: 'print',
    description: 'A3 海報尺寸 (300 DPI)',
    icon: '🎪',
    aspectRatio: '√2:1',
    popular: false
  },
  {
    id: 'flyer',
    name: '傳單',
    width: 1275,
    height: 1650,
    category: 'print',
    description: '標準傳單尺寸 (300 DPI)',
    icon: '📋',
    aspectRatio: '4:5',
    popular: false
  },

  // 網頁設計
  {
    id: 'web-banner',
    name: '網頁橫幅',
    width: 1920,
    height: 600,
    category: 'web',
    description: '網站頂部橫幅',
    icon: '🌐',
    aspectRatio: '3.2:1',
    popular: true
  },
  {
    id: 'blog-header',
    name: '部落格標題',
    width: 1200,
    height: 400,
    category: 'web',
    description: '部落格文章標題圖',
    icon: '📝',
    aspectRatio: '3:1',
    popular: true
  },
  {
    id: 'web-square',
    name: '網頁正方形',
    width: 800,
    height: 800,
    category: 'web',
    description: '網頁正方形圖片',
    icon: '⬜',
    aspectRatio: '1:1',
    popular: false
  },
  {
    id: 'email-header',
    name: '電子郵件標題',
    width: 600,
    height: 200,
    category: 'web',
    description: '電子郵件標題圖片',
    icon: '📧',
    aspectRatio: '3:1',
    popular: false
  },

  // 移動設備
  {
    id: 'mobile-wallpaper',
    name: '手機桌布',
    width: 1080,
    height: 1920,
    category: 'mobile',
    description: '手機桌布尺寸',
    icon: '📱',
    aspectRatio: '9:16',
    popular: true
  },
  {
    id: 'tablet-wallpaper',
    name: '平板桌布',
    width: 2048,
    height: 1536,
    category: 'mobile',
    description: '平板電腦桌布',
    icon: '📟',
    aspectRatio: '4:3',
    popular: false
  },
  {
    id: 'app-icon',
    name: 'App 圖標',
    width: 1024,
    height: 1024,
    category: 'mobile',
    description: 'App 應用程式圖標',
    icon: '📲',
    aspectRatio: '1:1',
    popular: false
  },

  // 藝術創作
  {
    id: 'square-art',
    name: '正方形藝術',
    width: 1024,
    height: 1024,
    category: 'art',
    description: '正方形藝術作品',
    icon: '🎨',
    aspectRatio: '1:1',
    popular: true
  },
  {
    id: 'portrait-art',
    name: '肖像藝術',
    width: 768,
    height: 1024,
    category: 'art',
    description: '垂直肖像藝術',
    icon: '🖼️',
    aspectRatio: '3:4',
    popular: true
  },
  {
    id: 'landscape-art',
    name: '風景藝術',
    width: 1024,
    height: 768,
    category: 'art',
    description: '水平風景藝術',
    icon: '🏞️',
    aspectRatio: '4:3',
    popular: true
  },
  {
    id: 'panorama',
    name: '全景藝術',
    width: 1024,
    height: 512,
    category: 'art',
    description: '全景寬幅藝術',
    icon: '🌄',
    aspectRatio: '2:1',
    popular: false
  },

  // 視頻相關
  {
    id: 'video-16-9',
    name: '16:9 視頻',
    width: 1920,
    height: 1080,
    category: 'video',
    description: '標準視頻比例',
    icon: '🎬',
    aspectRatio: '16:9',
    popular: true
  },
  {
    id: 'video-4-3',
    name: '4:3 視頻',
    width: 1024,
    height: 768,
    category: 'video',
    description: '傳統視頻比例',
    icon: '📹',
    aspectRatio: '4:3',
    popular: false
  },
  {
    id: 'video-vertical',
    name: '垂直視頻',
    width: 1080,
    height: 1920,
    category: 'video',
    description: '手機垂直視頻',
    icon: '📲',
    aspectRatio: '9:16',
    popular: true
  }
]

// 輔助函數
export const getSizeById = (id: string): SizePreset | undefined => {
  return SIZE_PRESETS.find(preset => preset.id === id)
}

export const getSizesByCategory = (category: string): SizePreset[] => {
  return SIZE_PRESETS.filter(preset => preset.category === category)
}

export const getPopularSizes = (): SizePreset[] => {
  return SIZE_PRESETS.filter(preset => preset.popular)
}

export const getCustomSize = (width: number, height: number): SizePreset => {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const divisor = gcd(width, height)
  const aspectW = width / divisor
  const aspectH = height / divisor
  
  return {
    id: 'custom',
    name: '自定義尺寸',
    width,
    height,
    category: 'custom',
    description: `自定義 ${width}x${height} 像素`,
    icon: '⚙️',
    aspectRatio: `${aspectW}:${aspectH}`,
    popular: false
  }
}