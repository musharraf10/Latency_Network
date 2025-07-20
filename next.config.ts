/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: require.resolve("react"),
      "react-dom": require.resolve("react-dom"),
    };
    return config;
  },
};
module.exports = nextConfig;
