import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // stel je omgevingsvariabele beschikbaar voor de client (optioneel)
  env: {
    NEXT_PUBLIC_STRAPI_URL: process.env.STRAPI_URL!,
  },

  async rewrites() {
    return [
      // alléén /api/* naar Strapi
      {
        source: "/api/:path*",
        destination: `${process.env.STRAPI_URL}/api/:path*`,
      },
      // uploads/media
      {
        source: "/uploads/:path*",
        destination: `${process.env.STRAPI_URL}/uploads/:path*`,
      },
      // admin-panel (optioneel, als je nog extern admin wilt bereiken)
      {
        source: "/admin/:path*",
        destination: `${process.env.STRAPI_URL}/admin/:path*`,
      },
    ];
  },
};

export default nextConfig;
