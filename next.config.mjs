/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    basePath: "/fin-customer",
    instrumentationHook: true,
  },
};

export default nextConfig;
