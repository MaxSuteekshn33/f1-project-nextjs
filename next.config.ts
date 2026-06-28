import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/goat-simulator",
        destination: "/goat-simulator-classic.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
