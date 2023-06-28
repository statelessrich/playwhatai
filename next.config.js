const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media.rawg.io"],
  },
  webpack: (config, options) => {
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }

    return config;
  },
};

module.exports = nextConfig;
