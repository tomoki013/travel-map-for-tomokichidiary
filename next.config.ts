import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-map-gl"],
  basePath: "/map",
  trailingSlash: true,
};

export default nextConfig;
