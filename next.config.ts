/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Добавьте это для Netlify
  trailingSlash: true,
}

module.exports = nextConfig