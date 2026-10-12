import path from "node:path";
import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a plain static site for GitHub Pages (served under /<repo>),
// which is reachable from Bangladeshi ISPs where some *.vercel.app IPs time out.
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = staticExport ? (process.env.PAGES_BASE_PATH ?? "/bsc-nursing-jobs-bd") : undefined;

const nextConfig: NextConfig = {
  ...(staticExport && { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }),
  // Static export has no server, so these server features are only enabled on Vercel.
  cacheComponents: !staticExport,
  partialPrefetching: !staticExport,
  // Shared TypeScript package and ../data live outside this app, in the monorepo root.
  transpilePackages: ["@bsc-nursing/shared"],
  turbopack: {
    root: path.join(__dirname, ".."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
