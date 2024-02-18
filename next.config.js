/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  transpilePackages: ["crypto-js"],
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  rewrites: async () => {
    return [
      {
        source: "/py-api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : "/api/",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/docs"
            : "/api/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/openapi.json"
            : "/api/openapi.json",
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mermaid.ink",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
