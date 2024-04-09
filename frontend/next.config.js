/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@coral-xyz/anchor"],
  },
}

module.exports = nextConfig
