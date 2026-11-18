import type { NextConfig } from "next";
// Next.js 15 resolves `next.config.js` first (`CONFIG_FILES = ['next.config.js', 'next.config.mjs', 'next.config.ts']`).
// Both `next.config.js` and `next.config.ts` export `./lib/nextConfigShared.js` so they can never diverge.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextConfig: NextConfig = require("./lib/nextConfigShared.js");

export default nextConfig;
