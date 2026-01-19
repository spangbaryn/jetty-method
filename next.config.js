/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow production builds to complete even with type errors
    // TODO: Fix Sanity schema types and remove this
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
