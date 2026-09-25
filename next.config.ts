import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.public.blob.vercel-storage.com", pathname: "/**" }],
  },
  experimental: {
    // Cover images are capped at 4 MB in the upload action; leave room for multipart overhead.
    serverActions: { bodySizeLimit: "4.5mb" },
  },
};

export default nextConfig;
