// 圖片風格預設系統
export interface ImageStyle {
  id: string
  name: string
  nameEn: string
  category: string
  description: string
  prompt: string
  negativePrompt?: string
  icon: string
  preview: string
  popular: boolean
}

export const IMAGE_STYLE_CATEGORIES = {
  artistic: '藝術風格',
  realistic: '寫實風格', 
  cartoon: '卡通動漫',
  vintage: '復古懷舊',
  modern: '現代時尚',
  fantasy: '奇幻魔法',
  nature: '自然風光',
  abstract: '抽象藝術'
}

export const IMAGE_STYLES: ImageStyle[] = [
  // 藝術風格 (8個)
  {
    id: 'oil-painting',
    name: '油畫風格',
    nameEn: 'Oil Painting',
    category: 'artistic',
    description: '經典油畫質感，筆觸豐富',
    prompt: 'oil painting style, thick brushstrokes, rich textures, classical art',
    negativePrompt: 'digital art, photography, smooth',
    icon: '🎨',
    preview: '/styles/oil-painting.jpg',
    popular: true
  },
  {
    id: 'watercolor',
    name: '水彩畫',
    nameEn: 'Watercolor',
    category: 'artistic',
    description: '柔和水彩效果，色彩流動',
    prompt: 'watercolor painting, soft colors, flowing paint, artistic',
    negativePrompt: 'sharp edges, digital',
    icon: '🖌️',
    preview: '/styles/watercolor.jpg',
    popular: true
  },
  {
    id: 'impressionist',
    name: '印象派',
    nameEn: 'Impressionist',
    category: 'artistic',
    description: '印象派風格，光影變化',
    prompt: 'impressionist style, loose brushwork, light and shadow, monet style',
    negativePrompt: 'detailed, sharp',
    icon: '🌅',
    preview: '/styles/impressionist.jpg',
    popular: false
  },
  {
    id: 'van-gogh',
    name: '梵高風格',
    nameEn: 'Van Gogh Style',
    category: 'artistic',
    description: '梵高式旋渦筆觸',
    prompt: 'van gogh style, swirling brushstrokes, vibrant colors, post-impressionist',
    negativePrompt: 'realistic, smooth',
    icon: '🌀',
    preview: '/styles/van-gogh.jpg',
    popular: true
  },
  {
    id: 'picasso',
    name: '畢加索風格',
    nameEn: 'Picasso Style',
    category: 'artistic',
    description: '立體主義，幾何分解',
    prompt: 'picasso style, cubism, geometric shapes, abstract faces',
    negativePrompt: 'realistic, detailed',
    icon: '🔷',
    preview: '/styles/picasso.jpg',
    popular: false
  },
  {
    id: 'sketch',
    name: '素描風格',
    nameEn: 'Sketch',
    category: 'artistic',
    description: '鉛筆素描，線條藝術',
    prompt: 'pencil sketch, line art, black and white, detailed drawing',
    negativePrompt: 'color, painting',
    icon: '✏️',
    preview: '/styles/sketch.jpg',
    popular: true
  },
  {
    id: 'ink-wash',
    name: '水墨畫',
    nameEn: 'Ink Wash',
    category: 'artistic',
    description: '中國水墨畫風格',
    prompt: 'chinese ink wash painting, sumi-e, black ink, minimalist',
    negativePrompt: 'colorful, western art',
    icon: '🖋️',
    preview: '/styles/ink-wash.jpg',
    popular: false
  },
  {
    id: 'pop-art',
    name: '波普藝術',
    nameEn: 'Pop Art',
    category: 'artistic',
    description: '安迪沃荷式波普風格',
    prompt: 'pop art style, bright colors, andy warhol, comic book style',
    negativePrompt: 'realistic, muted colors',
    icon: '🎭',
    preview: '/styles/pop-art.jpg',
    popular: true
  },

  // 寫實風格 (6個)
  {
    id: 'photorealistic',
    name: '照片級寫實',
    nameEn: 'Photorealistic',
    category: 'realistic',
    description: '極度逼真的照片效果',
    prompt: 'photorealistic, highly detailed, 8k resolution, professional photography',
    negativePrompt: 'cartoon, painting, artistic',
    icon: '📸',
    preview: '/styles/photorealistic.jpg',
    popular: true
  },
  {
    id: 'portrait',
    name: '人像攝影',
    nameEn: 'Portrait Photography',
    category: 'realistic',
    description: '專業人像攝影風格',
    prompt: 'portrait photography, professional lighting, shallow depth of field',
    negativePrompt: 'full body, landscape',
    icon: '👤',
    preview: '/styles/portrait.jpg',
    popular: true
  },
  {
    id: 'landscape',
    name: '風景攝影',
    nameEn: 'Landscape Photography',
    category: 'realistic',
    description: '壯麗風景攝影',
    prompt: 'landscape photography, golden hour, dramatic lighting, wide angle',
    negativePrompt: 'portrait, close-up',
    icon: '🏔️',
    preview: '/styles/landscape.jpg',
    popular: true
  },
  {
    id: 'macro',
    name: '微距攝影',
    nameEn: 'Macro Photography',
    category: 'realistic',
    description: '微距特寫效果',
    prompt: 'macro photography, extreme close-up, detailed textures, shallow focus',
    negativePrompt: 'wide shot, landscape',
    icon: '🔍',
    preview: '/styles/macro.jpg',
    popular: false
  },
  {
    id: 'street',
    name: '街頭攝影',
    nameEn: 'Street Photography',
    category: 'realistic',
    description: '街頭紀實風格',
    prompt: 'street photography, candid moments, urban life, documentary style',
    negativePrompt: 'staged, studio',
    icon: '🏙️',
    preview: '/styles/street.jpg',
    popular: false
  },
  {
    id: 'cinematic',
    name: '電影級',
    nameEn: 'Cinematic',
    category: 'realistic',
    description: '電影般的視覺效果',
    prompt: 'cinematic lighting, movie still, dramatic composition, film grain',
    negativePrompt: 'amateur, snapshot',
    icon: '🎬',
    preview: '/styles/cinematic.jpg',
    popular: true
  },

  // 卡通動漫 (6個)
  {
    id: 'anime',
    name: '日式動漫',
    nameEn: 'Anime',
    category: 'cartoon',
    description: '日本動漫風格',
    prompt: 'anime style, manga art, japanese animation, cel shading',
    negativePrompt: 'realistic, western cartoon',
    icon: '🎌',
    preview: '/styles/anime.jpg',
    popular: true
  },
  {
    id: 'disney',
    name: '迪士尼風格',
    nameEn: 'Disney Style',
    category: 'cartoon',
    description: '迪士尼經典動畫風格',
    prompt: 'disney animation style, pixar style, 3d cartoon, colorful',
    negativePrompt: 'realistic, dark',
    icon: '🏰',
    preview: '/styles/disney.jpg',
    popular: true
  },
  {
    id: 'chibi',
    name: 'Q版可愛',
    nameEn: 'Chibi',
    category: 'cartoon',
    description: '超萌Q版角色',
    prompt: 'chibi style, cute, kawaii, big eyes, small body',
    negativePrompt: 'realistic proportions',
    icon: '🥰',
    preview: '/styles/chibi.jpg',
    popular: true
  },
  {
    id: 'comic-book',
    name: '美式漫畫',
    nameEn: 'Comic Book',
    category: 'cartoon',
    description: '美式超級英雄漫畫',
    prompt: 'comic book style, superhero art, bold lines, bright colors',
    negativePrompt: 'realistic, muted',
    icon: '💥',
    preview: '/styles/comic-book.jpg',
    popular: false
  },
  {
    id: 'pixel-art',
    name: '像素藝術',
    nameEn: 'Pixel Art',
    category: 'cartoon',
    description: '8位像素遊戲風格',
    prompt: 'pixel art, 8-bit style, retro gaming, pixelated',
    negativePrompt: 'smooth, high resolution',
    icon: '🎮',
    preview: '/styles/pixel-art.jpg',
    popular: false
  },
  {
    id: 'cartoon-3d',
    name: '3D卡通',
    nameEn: '3D Cartoon',
    category: 'cartoon',
    description: '現代3D動畫風格',
    prompt: '3d cartoon style, rendered, smooth surfaces, colorful',
    negativePrompt: '2d, flat',
    icon: '🎪',
    preview: '/styles/cartoon-3d.jpg',
    popular: true
  },

  // 復古懷舊 (4個)
  {
    id: 'vintage',
    name: '復古膠片',
    nameEn: 'Vintage Film',
    category: 'vintage',
    description: '老式膠片相機效果',
    prompt: 'vintage film photography, grain, faded colors, retro',
    negativePrompt: 'digital, modern',
    icon: '📷',
    preview: '/styles/vintage.jpg',
    popular: true
  },
  {
    id: 'sepia',
    name: '棕褐色調',
    nameEn: 'Sepia Tone',
    category: 'vintage',
    description: '經典棕褐色老照片',
    prompt: 'sepia tone, monochrome, vintage photography, aged',
    negativePrompt: 'colorful, modern',
    icon: '🤎',
    preview: '/styles/sepia.jpg',
    popular: false
  },
  {
    id: 'art-deco',
    name: '裝飾藝術',
    nameEn: 'Art Deco',
    category: 'vintage',
    description: '1920年代裝飾藝術',
    prompt: 'art deco style, geometric patterns, 1920s, elegant',
    negativePrompt: 'modern, minimalist',
    icon: '💎',
    preview: '/styles/art-deco.jpg',
    popular: false
  },
  {
    id: 'polaroid',
    name: '拍立得',
    nameEn: 'Polaroid',
    category: 'vintage',
    description: '拍立得即時相片效果',
    prompt: 'polaroid photo, instant camera, white border, vintage',
    negativePrompt: 'digital, professional',
    icon: '📸',
    preview: '/styles/polaroid.jpg',
    popular: true
  },

  // 現代時尚 (4個)
  {
    id: 'minimalist',
    name: '極簡主義',
    nameEn: 'Minimalist',
    category: 'modern',
    description: '簡潔現代設計',
    prompt: 'minimalist design, clean lines, simple, modern',
    negativePrompt: 'cluttered, ornate',
    icon: '⚪',
    preview: '/styles/minimalist.jpg',
    popular: true
  },
  {
    id: 'neon',
    name: '霓虹賽博',
    nameEn: 'Neon Cyberpunk',
    category: 'modern',
    description: '賽博朋克霓虹風格',
    prompt: 'cyberpunk style, neon lights, futuristic, synthwave',
    negativePrompt: 'natural, vintage',
    icon: '🌈',
    preview: '/styles/neon.jpg',
    popular: true
  },
  {
    id: 'vaporwave',
    name: '蒸汽波',
    nameEn: 'Vaporwave',
    category: 'modern',
    description: '80年代蒸汽波美學',
    prompt: 'vaporwave aesthetic, retro futurism, pink and blue, 80s',
    negativePrompt: 'realistic, natural colors',
    icon: '🌸',
    preview: '/styles/vaporwave.jpg',
    popular: false
  },
  {
    id: 'glitch',
    name: '故障藝術',
    nameEn: 'Glitch Art',
    category: 'modern',
    description: '數位故障效果',
    prompt: 'glitch art, digital corruption, distorted, error aesthetic',
    negativePrompt: 'clean, perfect',
    icon: '📺',
    preview: '/styles/glitch.jpg',
    popular: false
  },

  // 奇幻魔法 (3個)
  {
    id: 'fantasy',
    name: '奇幻魔法',
    nameEn: 'Fantasy Magic',
    category: 'fantasy',
    description: '魔法奇幻世界',
    prompt: 'fantasy art, magical, mystical, enchanted, ethereal',
    negativePrompt: 'realistic, modern',
    icon: '🔮',
    preview: '/styles/fantasy.jpg',
    popular: true
  },
  {
    id: 'steampunk',
    name: '蒸汽朋克',
    nameEn: 'Steampunk',
    category: 'fantasy',
    description: '維多利亞蒸汽機械',
    prompt: 'steampunk style, victorian era, brass gears, mechanical',
    negativePrompt: 'modern, digital',
    icon: '⚙️',
    preview: '/styles/steampunk.jpg',
    popular: false
  },
  {
    id: 'gothic',
    name: '哥特風格',
    nameEn: 'Gothic',
    category: 'fantasy',
    description: '黑暗哥特美學',
    prompt: 'gothic style, dark atmosphere, medieval, dramatic',
    negativePrompt: 'bright, cheerful',
    icon: '🦇',
    preview: '/styles/gothic.jpg',
    popular: false
  },

  // 自然風光 (2個)
  {
    id: 'nature',
    name: '自然寫實',
    nameEn: 'Nature Realistic',
    category: 'nature',
    description: '真實自然風光',
    prompt: 'nature photography, natural lighting, organic, peaceful',
    negativePrompt: 'artificial, urban',
    icon: '🌿',
    preview: '/styles/nature.jpg',
    popular: true
  },
  {
    id: 'botanical',
    name: '植物插畫',
    nameEn: 'Botanical Illustration',
    category: 'nature',
    description: '科學植物插畫風格',
    prompt: 'botanical illustration, scientific drawing, detailed plants',
    negativePrompt: 'abstract, stylized',
    icon: '🌺',
    preview: '/styles/botanical.jpg',
    popular: false
  },

  // 抽象藝術 (2個)
  {
    id: 'abstract',
    name: '抽象表現',
    nameEn: 'Abstract Expressionism',
    category: 'abstract',
    description: '抽象表現主義',
    prompt: 'abstract expressionism, non-representational, emotional',
    negativePrompt: 'realistic, detailed',
    icon: '🎨',
    preview: '/styles/abstract.jpg',
    popular: false
  },
  {
    id: 'geometric',
    name: '幾何抽象',
    nameEn: 'Geometric Abstract',
    category: 'abstract',
    description: '幾何形狀抽象藝術',
    prompt: 'geometric abstract, shapes, patterns, mathematical',
    negativePrompt: 'organic, realistic',
    icon: '🔺',
    preview: '/styles/geometric.jpg',
    popular: false
  }
]

// 獲取風格預設的輔助函數
export const getStyleById = (id: string): ImageStyle | undefined => {
  return IMAGE_STYLES.find(style => style.id === id)
}

export const getStylesByCategory = (category: string): ImageStyle[] => {
  return IMAGE_STYLES.filter(style => style.category === category)
}

export const getPopularStyles = (): ImageStyle[] => {
  return IMAGE_STYLES.filter(style => style.popular)
}

export const searchStyles = (query: string): ImageStyle[] => {
  const lowerQuery = query.toLowerCase()
  return IMAGE_STYLES.filter(style => 
    style.name.toLowerCase().includes(lowerQuery) ||
    style.nameEn.toLowerCase().includes(lowerQuery) ||
    style.description.toLowerCase().includes(lowerQuery)
  )
}