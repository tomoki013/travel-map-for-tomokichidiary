import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["react-map-gl"],
  basePath: "/map",
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tomokichidiary.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
