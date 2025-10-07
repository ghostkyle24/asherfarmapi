import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignora erros de ESLint durante o build em produção (evita falhas no Vercel)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
