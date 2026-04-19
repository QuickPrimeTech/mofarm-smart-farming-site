import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/meshack-kipkemoi/**", // Allows all paths under your Cloudinary account
      },
      {
        protocol: "https",
        hostname: "jnsbknjphqyoztefixrk.supabase.co",
        pathname: "/storage/v1/object/**", // Allows all paths under the specified Supabase storage bucket
      },
    ],
  },
  allowedDevOrigins: ["lz62klsuhtff7kjv2ytqb3e74u.srv.us"],
};

export default nextConfig;
