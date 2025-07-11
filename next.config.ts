import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'sleepercdn.com', // avatars
      'a.espncdn.com' // player and team logos
    ],
  },
};

export default nextConfig;
