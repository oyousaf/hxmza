require('./check-env-variables')()
module.exports = {
  output: 'standalone',
  outputFileTracingRoot: require('path').join(__dirname, '../..'),
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async headers() { return [{ source: '/:path*', headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
  ] }] }
}
