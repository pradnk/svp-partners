import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the parent directory makes Turbopack misdetect the
  // workspace root, which breaks the React Client Manifest in dev.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
