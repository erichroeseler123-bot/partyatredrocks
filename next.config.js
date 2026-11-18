/**
 * Authoritative Next.js build entrypoint (`CONFIG_FILES[0]` in Next.js 15).
 * Delegates to `./lib/nextConfigShared.js` so `next.config.js` and `next.config.ts`
 * can never become competing configuration authorities.
 *
 * @type {import('next').NextConfig}
 */
module.exports = require("./lib/nextConfigShared.js");
