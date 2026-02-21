import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  
  // Redirect www to non-www
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.kwslinkhout.be",
          },
        ],
        destination: "https://kwslinkhout.be/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
