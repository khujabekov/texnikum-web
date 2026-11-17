import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.NEXT_OUTPUT_STANDALONE === "true" ? "standalone" : undefined,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
