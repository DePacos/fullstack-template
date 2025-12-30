/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@template/ui', '@template/contracts', '@template/trpc'],
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [{ loader: '@svgr/webpack', options: { icon: true, svgo: false } }],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
