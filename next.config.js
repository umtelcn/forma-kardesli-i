/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint hatalarını build sırasında yoksay
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript hatalarını build sırasında yoksay (isteğe bağlı)
  typescript: {
    ignoreBuildErrors: false, // true yaparsanız TypeScript hatalarını da yoksayar
  },
  // Image konfigürasyonu
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uwfoctzdrpemxfjffcqk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Performans optimizasyonları
  experimental: {
    optimizeCss: true,
  },
  // Webpack konfigürasyonu (Supabase uyarılarını gizle)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Supabase WebSocket uyarılarını gizle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;