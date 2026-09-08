import { loadEnv, defineConfig, MedusaError } from "@medusajs/framework/utils"
loadEnv(process.env.NODE_ENV || "development", process.cwd())
const redisUrl = process.env.REDIS_URL
if (process.env.STRIPE_API_KEY?.startsWith("sk_live_") && process.env.ALLOW_LIVE_PAYMENTS !== "true") throw new MedusaError(MedusaError.Types.INVALID_DATA, "Live Stripe payments require ALLOW_LIVE_PAYMENTS=true")
module.exports = defineConfig({
 admin: { backendUrl: process.env.MEDUSA_PUBLIC_URL || "http://localhost:9000" },
 projectConfig: {
  databaseUrl: process.env.DATABASE_URL,
  databaseDriverOptions: { ssl: false },
  redisUrl,
  http: { storeCors: process.env.STORE_CORS!, adminCors: process.env.ADMIN_CORS!, authCors: process.env.AUTH_CORS!, jwtSecret: process.env.JWT_SECRET!, cookieSecret: process.env.COOKIE_SECRET! }
 },
 modules: [
  { resolve: "./src/modules/wishlist" },
  { resolve: "@medusajs/medusa/file", options: { providers: [{ resolve: "@medusajs/medusa/file-local", id: "local", options: { upload_dir: "static", backend_url: (process.env.MEDUSA_PUBLIC_URL || "http://localhost:9000") + "/static" } }] } },
  ...(process.env.STRIPE_API_KEY ? [{ resolve: "@medusajs/medusa/payment", options: { providers: [{ resolve: "@medusajs/medusa/payment-stripe", id: "stripe", options: { apiKey: process.env.STRIPE_API_KEY, webhookSecret: process.env.STRIPE_WEBHOOK_SECRET, capture: true } }] } }] : []),
  ...(redisUrl ? [
   { resolve: "@medusajs/medusa/event-bus-redis", options: { redisUrl } },
   { resolve: "@medusajs/medusa/workflow-engine-redis", options: { redis: { redisUrl } } },
   { resolve: "@medusajs/medusa/locking", options: { providers: [{ resolve: "@medusajs/medusa/locking-redis", id: "locking-redis", is_default: true, options: { redisUrl } }] } },
   { resolve: "@medusajs/medusa/caching", options: { providers: [{ resolve: "@medusajs/caching-redis", id: "caching-redis", is_default: true, options: { redisUrl } }] } }
  ] : [])
 ]
})
