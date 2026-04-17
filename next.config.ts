import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'kwslinkhout.be' }],
        destination: 'https://www.kwslinkhout.be/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
