import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['@bettracker/core'],
    experimental: {
        optimizePackageImports: ['lucide-react', 'recharts'],
    },
};

export default nextConfig;
