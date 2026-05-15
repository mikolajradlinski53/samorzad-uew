/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NEXT_STATIC_EXPORT === 'true' ? {
    output: 'export',
    trailingSlash: true,
  } : {}),
  images: { unoptimized: true },
}
module.exports = nextConfig
