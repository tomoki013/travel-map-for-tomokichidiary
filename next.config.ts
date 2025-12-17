import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-map-gl"],
  basePath: "/map",
};

export default nextConfig;
