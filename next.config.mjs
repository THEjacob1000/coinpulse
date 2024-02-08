/** @type {import('next').NextConfig} */
const withBundleAnalyzer = (
  await import("@next/bundle-analyzer")
).default({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_ENV: "PRODUCTION", //your next configs goes here
  },
});

export default nextConfig;
