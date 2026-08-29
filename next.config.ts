import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Lets `next dev` access Cloudflare bindings (harmless when there are none).
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  // No Image Optimization service on Workers; serve images as-is.
  images: { unoptimized: true },
};

export default nextConfig;
