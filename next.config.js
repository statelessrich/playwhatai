module.exports = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["media.rawg.io"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.rawg.io/api/games",
      },
    ];
  },
};
