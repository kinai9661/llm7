/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['canvas', 'sharp']
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'canvas': 'commonjs canvas',
        'sharp': 'commonjs sharp'
      })
    }
    return config
  },
  // 確保使用 Next.js 構建
  distDir: '.next',
  generateEtags: false,
  poweredByHeader: false
}

module.exports = nextConfig