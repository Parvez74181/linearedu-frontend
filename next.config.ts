import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sg.storage.bunnycdn.com",
        pathname: "**",
      },

      {
        protocol: "https",
        hostname: "academy-leaneredu.b-cdn.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "academy-lsa.b-cdn.net",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
