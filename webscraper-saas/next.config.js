/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14.2+ uses serverExternalPackages (no longer experimental)
  serverExternalPackages: ["archiver", "archiver-utils", "zip-stream", "tar-stream"],
};
module.exports = nextConfig;
