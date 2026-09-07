require('./check-env-variables')()
module.exports = {
  output: 'standalone',
  outputFileTracingRoot: require('path').join(__dirname, '../..'),
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '9000' },
      { protocol: 'https', hostname: 'api.hxmza.uk' },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [65, 75],
  },
  async headers() { return [{ source: '/:path*', headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
  ] }] }
}
