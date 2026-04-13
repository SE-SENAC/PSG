import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'psg.se.senac.br',
      },
      {
        protocol: 'https',
        hostname: 'www.se.senac.br',
      }
    ],
  },
  // basePath: '/psg', // Removido conforme solicitado
  async rewrites() {
    // Durante o desenvolvimento local, 'backend' não é resolvido.
    // Usamos localhost:3001 como padrão se estivermos fora do Docker.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const proxyTarget = apiUrl.replace('backend', 'localhost').replace('3000', '3001');

    return [
      {
        source: '/api/:path*',
        destination: `${proxyTarget}/api/:path*`,
      },
      {
        source: '/docs/:path*',
        destination: `${proxyTarget}/docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
