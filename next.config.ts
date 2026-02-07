import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Partial Prerendering (PPR) - combines static and dynamic rendering
  // Moved to root level in Next.js 16
  cacheComponents: true,
  reactCompiler: true,

  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ["lucide-react", "framer-motion", "@xyflow/react"],

    // Client router cache configuration (in seconds)
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },

  // Enable modern JavaScript features
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
