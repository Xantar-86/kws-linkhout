import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,
  
  // Proxy Netlify Identity calls to the Netlify site
  async rewrites() {
    return [
      {
        source: "/.netlify/identity/:path*",
        destination: "https://kws-linkhout.netlify.app/.netlify/identity/:path*",
      },
    ];
  },
  
  // Add CORS headers for identity
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
