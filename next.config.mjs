/** @type {import('next').NextConfig} */
// Если сайт открывается не из корня домена, а из подпапки (например /site/), задайте перед сборкой:
// NEXT_PUBLIC_BASE_PATH=/site
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath: basePath || undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;