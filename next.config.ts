import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack(config) {
    // 👇 Agregamos soporte para shaders GLSL
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"],
    });

    return config;
  },
};

export default nextConfig;
