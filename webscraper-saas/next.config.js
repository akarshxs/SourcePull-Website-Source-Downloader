/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["archiver", "archiver-utils", "zip-stream", "tar-stream"],
  },
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};
module.exports = nextConfig;
