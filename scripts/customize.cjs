const fs = require('fs');
const path = require('path');
function write(p, s) { fs.mkdirSync(path.dirname(p), {recursive:true}); fs.writeFileSync(p,s); }
function edit(p, fn) { write(p,fn(fs.readFileSync(p,'utf8'))); }
edit('package.json', s => { const p=JSON.parse(s); p.name='beds4u';p.private=true;p.scripts['backend:seed']='pnpm --filter @dtc/backend exec medusa exec ./src/scripts/seed.ts';p.scripts.typecheck='pnpm --filter @dtc/storefront exec tsc --noEmit'; return JSON.stringify(p,null,2)+'\n'; });
edit('apps/storefront/package.json', s=>{const p=JSON.parse(s);p.scripts.lint='tsc --noEmit';return JSON.stringify(p,null,2)+'\n'});
write('apps/storefront/next.config.js', `require('./check-env-variables')()
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
`);
edit('apps/storefront/src/lib/config.ts',s=>s.replace('baseUrl: MEDUSA_BACKEND_URL,','baseUrl: typeof window === "undefined" ? (process.env.MEDUSA_BACKEND_URL || MEDUSA_BACKEND_URL) : MEDUSA_BACKEND_URL,\n  auth: { type: "jwt", jwtTokenStorageMethod: "nostore" },'));
edit('apps/storefront/src/middleware.ts',s=>s.replace('const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL','const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL').replace('|| "dk"','|| "gb"'));
edit('apps/storefront/src/lib/data/cookies.ts',s=>s.replaceAll('maxAge:', 'path: "/",\n    maxAge:'));
// All branded source text; preserve upstream attribution in LICENSE.
function brand(dir) { for(const d of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,d.name); if(d.isDirectory())brand(p);else if(/\.(tsx|ts)$/.test(p))edit(p,s=>s.replaceAll('Medusa Store','Beds4u').replaceAll('Medusa Next.js Starter Template','Beds4u | Beds made for your home').replaceAll('A performant frontend ecommerce starter template with Next.js 15 and Medusa.','Discover silver upholstered ottoman beds and traditional oak bed frames.')); }}
brand('apps/storefront/src');
write('apps/storefront/src/lib/utils.ts',`import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
`);
write('apps/storefront/components.json',JSON.stringify({"$schema":"https://ui.shadcn.com/schema.json",style:"new-york",rsc:true,tsx:true,tailwind:{config:"tailwind.config.js",css:"src/styles/globals.css",baseColor:"neutral",cssVariables:false},aliases:{components:"@/components",utils:"@lib/utils",ui:"@/components/ui",lib:"@lib",hooks:"@/hooks"}},null,2));
write('apps/storefront/src/components/ui/button.tsx',`import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@lib/utils"
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-stone-800 text-white hover:bg-stone-700", outline: "border border-stone-400 bg-transparent text-stone-800 hover:bg-stone-100" }, size: { default: "h-12 px-6 py-2", sm: "h-9 px-3" } }, defaultVariants: { variant: "default", size: "default" } })
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({className, variant, size, asChild=false, ...props},ref) => { const Comp=asChild ? Slot : "button"; return <Comp className={cn(buttonVariants({variant,size,className}))} ref={ref} {...props} /> })
Button.displayName="Button"
export { Button, buttonVariants }
`);
write('apps/storefront/src/modules/home/components/hero/index.tsx',`import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "../../../../../components/ui/button"
export default function Hero() {
 return <section className="bg-[#e9e6e1] border-b border-stone-300">
  <div className="content-container grid lg:grid-cols-2 items-center gap-10 py-14 lg:py-24">
   <div className="max-w-xl"><p className="text-xs uppercase tracking-[0.25em] text-stone-600 mb-6">Beds4u / The bedroom collection</p>
    <h1 className="font-serif text-5xl lg:text-7xl tracking-tight leading-[1.05] text-stone-800">A little more room.<br/><span className="text-stone-500">A lot more rest.</span></h1>
    <p className="mt-6 mb-8 text-lg leading-relaxed text-stone-600 max-w-md">Soft silver upholstery. Useful ottoman storage. The enduring warmth of oak. Find the bed that feels like home.</p>
    <div className="flex flex-wrap gap-3"><Button asChild><LocalizedClientLink href="/store">Explore the beds <span aria-hidden>→</span></LocalizedClientLink></Button><Button asChild variant="outline"><LocalizedClientLink href="/collections/ottoman-beds">Ottoman collection</LocalizedClientLink></Button></div>
   </div>
   <div className="relative"><img src="/beds/silver-ottoman.svg" alt="Illustration of a silver upholstered ottoman bed in a warm neutral bedroom" className="w-full rounded-t-[120px]"/><p className="text-xs text-stone-600 mt-3">The Silver Ottoman · Collection illustration</p></div>
  </div>
  <div className="content-container grid sm:grid-cols-3 gap-5 py-6 border-t border-stone-300 text-sm text-stone-700"><p>01 / Choose your size and finish</p><p>02 / Make space with ottoman storage</p><p>03 / Plan your delivery at checkout</p></div>
 </section>
}
`);
write('apps/storefront/src/modules/layout/templates/footer/index.tsx',`import LocalizedClientLink from "@modules/common/components/localized-client-link"
export default function Footer() { return <footer className="bg-stone-800 text-stone-200"><div className="content-container py-16 grid sm:grid-cols-2 gap-10"><div><LocalizedClientLink href="/" className="font-serif text-3xl text-white">Beds4u</LocalizedClientLink><p className="mt-4 max-w-sm text-stone-300">A considered collection of upholstered ottomans and traditional oak beds.</p></div><nav aria-label="Footer" className="flex flex-wrap gap-8 sm:justify-end"><LocalizedClientLink href="/store">All beds</LocalizedClientLink><LocalizedClientLink href="/account">Your account</LocalizedClientLink><LocalizedClientLink href="/cart">Basket</LocalizedClientLink></nav><p className="text-xs text-stone-400">© {new Date().getFullYear()} Beds4u</p></div></footer> }
`);
edit('apps/storefront/src/styles/globals.css',s=>s+'\nbody { background: #faf9f6; color: #292524; }\n::selection { background: #d6c5ae; }\n');
// Local vector collection illustrations, replace with real product photography before launch.
for(const [name,color,oak] of [['silver-ottoman','#a3a5a6',false],['grey-ottoman','#686d70',false],['oak-bed','#ae8154',true]]) {
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700"><defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#e4e0d9"/><stop offset="1" stop-color="#f3f0e9"/></linearGradient><linearGradient id="bed" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="${oak?'#825b39':'#797e81'}"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="13"/></filter></defs><path fill="url(#wall)" d="M0 0h900v700H0z"/><path fill="#d1c1ac" d="M0 490h900v210H0z"/><path stroke="#c3b198" d="M0 590h900M120 490L30 700M430 490l20 210M720 490l150 210"/><ellipse cx="456" cy="595" rx="330" ry="35" fill="#463b30" opacity=".2" filter="url(#shadow)"/><path fill="#c5bcae" d="M90 515l560-20 140 125-585 12z"/><rect x="220" y="204" width="420" height="263" rx="${oak?3:28}" fill="url(#bed)"/><g stroke="${oak?'#755132':'#8d9193'}" stroke-width="3">${[270,330,390,450,510,570,620].map(x=>`<path d="M${x} 225v180"/>`).join('')}</g><path d="M220 397h420l113 155H136z" fill="#eeeae4"/><path d="M136 552h617v65H136z" fill="url(#bed)"/><path d="M153 603v31m581-31v31" stroke="#624e3b" stroke-width="14"/><path d="M207 415h438l73 90H164z" fill="#f7f4ed"/><path d="M166 487l553 0 30 60H140z" fill="#c8bba9"/><path d="M251 352h141l12 72H228zM441 352h143l40 72H427z" fill="#faf9f5"/><path d="M160 507h565M153 521h582" stroke="#b3a58e" stroke-width="3"/><rect x="53" y="385" width="115" height="94" rx="3" fill="#a87c51"/><path d="M63 479v39m94-39v39" stroke="#735033" stroke-width="8"/><path d="M110 385V293" stroke="#6b6256" stroke-width="5"/><path d="M73 302l16-62h41l19 62z" fill="#faf5e9"/><circle cx="752" cy="165" r="62" fill="none" stroke="#b59875" stroke-width="7"/><path d="M749 548v-112" stroke="#756b50" stroke-width="6"/><path d="M748 484q-75-95-28-98 32 21 28 98M750 461q58-104 71-65-8 38-71 65" fill="#78806a"/><path d="M714 526h74l-11 65h-52z" fill="#e5dfd2"/></svg>`;
 write('apps/storefront/public/beds/'+name+'.svg',svg);
 write('apps/backend/static/'+name+'.svg',svg);
}
write('apps/backend/medusa-config.ts',`import { loadEnv, defineConfig } from "@medusajs/framework/utils"
loadEnv(process.env.NODE_ENV || "development", process.cwd())
const redisUrl = process.env.REDIS_URL
if (process.env.STRIPE_API_KEY?.startsWith("sk_live_") && process.env.ALLOW_LIVE_PAYMENTS !== "true") throw new Error("Live Stripe payments require ALLOW_LIVE_PAYMENTS=true")
module.exports = defineConfig({
 admin: { backendUrl: process.env.MEDUSA_PUBLIC_URL || "http://localhost:9000" },
 projectConfig: {
  databaseUrl: process.env.DATABASE_URL,
  redisUrl,
  http: { storeCors: process.env.STORE_CORS!, adminCors: process.env.ADMIN_CORS!, authCors: process.env.AUTH_CORS!, jwtSecret: process.env.JWT_SECRET!, cookieSecret: process.env.COOKIE_SECRET! }
 },
 modules: [
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
`);
// Adapt the official store/location/fulfillment workflows and replace apparel data.
const original=fs.readFileSync('apps/backend/src/migration-scripts/initial-data-seed.ts','utf8');
let seed=original.slice(0,original.indexOf('  logger.info("Seeding product data...");'));
seed=seed.replace('const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];','const countries = ["gb"];').replaceAll('"eur"','"gbp"').replaceAll('"Europe"','"United Kingdom"').replaceAll('"Default Store"','"Beds4u"').replaceAll('"European Warehouse"','"Beds4u Factory"').replaceAll('"European Warehouse delivery"','"Beds4u delivery"').replaceAll('"Copenhagen"','""').replaceAll('"DK"','"GB"').replace('payment_providers: ["pp_system_default"]','payment_providers: process.env.STRIPE_API_KEY ? ["pp_stripe_stripe"] : ["pp_system_default"]');
seed=seed.replace(/geo_zones: \[[\s\S]*?\],/,'geo_zones: [{ country_code: "gb", type: "country" }],');
const expressStart=seed.indexOf('      {\n        name: "Express Shipping"');
const expressEnd=seed.indexOf('\n    ],\n  });',expressStart);
if(expressStart>=0) seed=seed.slice(0,expressStart)+seed.slice(expressEnd);
seed=seed.replace('name: "Standard Shipping"','name: "Scheduled bed delivery (sample rate)"').replace('description: "Ship in 2-3 days."','description: "Delivery date arranged after manufacture; sample 15–25 working days."').replaceAll('amount: 10','amount: 49');
seed += `
  const { result: collections } = await createCollectionsWorkflow(container).run({ input: { collections: [
    { title: "Ottoman beds", handle: "ottoman-beds" }, { title: "Traditional oak", handle: "traditional-oak" }
  ] } })
  const imageBase = (process.env.MEDUSA_PUBLIC_URL || "http://localhost:9000") + "/static"
  await createProductsWorkflow(container).run({ input: { products: [
    { title: "Silver Ottoman", handle: "silver-ottoman", finish: "Silver woven upholstery", price: 499, collection: 0 },
    { title: "Charcoal Ottoman", handle: "grey-ottoman", finish: "Charcoal woven upholstery", price: 529, collection: 0 },
    { title: "Heritage Oak", handle: "oak-bed", finish: "Traditional oak", price: 649, collection: 1 }
  ].map((bed) => ({
    title: bed.title, handle: bed.handle,
    description: bed.collection === 0 ? "An upholstered ottoman bed with a generous storage base and a softly panelled headboard. Mattress sold separately. Collection illustration shown; sample catalogue specification." : "A traditional oak bed frame with a slatted headboard and a warm natural finish. Mattress sold separately. Collection illustration shown; sample catalogue specification.",
    status: ProductStatus.PUBLISHED,
    collection_id: collections[bed.collection].id,
    shipping_profile_id: shippingProfile.id,
    thumbnail: imageBase + "/" + bed.handle + ".svg",
    images: [{url: imageBase + "/" + bed.handle + ".svg"}],
    metadata: { lead_time_min_days: 15, lead_time_max_days: 25, lead_time_unit: "working days", configuration_version: 1, sample_catalogue: true },
    options: [{ title: "Size", values: ["Double", "King", "Super King"] }, { title: "Finish", values: [bed.finish] }],
    variants: ["Double", "King", "Super King"].map((size, i) => ({ title: size + " / " + bed.finish, sku: bed.handle.toUpperCase() + "-" + i, options: { Size: size, Finish: bed.finish }, manage_inventory: true, prices: [{ currency_code: "gbp", amount: bed.price + i * 100 }] })),
    sales_channels: [{ id: defaultSalesChannel.id }]
  })) } })
  const { data: inventoryItems } = await query.graph({ entity: "inventory_item", fields: ["id"] })
  await createInventoryLevelsWorkflow(container).run({ input: { inventory_levels: inventoryItems.map(item => ({ location_id: stockLocation.id, stocked_quantity: 10, inventory_item_id: item.id })) } })
  logger.info("Beds4u sample catalogue ready. Retrieve the publishable key in Admin > Settings > Publishable API Keys.")
}
`;
// Seed only explicitly, never automatically during a production migration.
write('apps/backend/src/scripts/seed.ts',seed);
write('apps/backend/src/migration-scripts/initial-data-seed.ts','// Beds4u uses the explicit src/scripts/seed.ts command for initial sample data.\n');
edit('apps/storefront/src/modules/products/templates/product-info/index.tsx',s=>s.replace('          {product.description}\n        </Text>','          {product.description}\n        </Text>\n        {product.metadata?.lead_time_min_days && product.metadata?.lead_time_max_days ? <p className="text-sm text-stone-600 border-t border-stone-200 pt-4">Factory lead time: {String(product.metadata.lead_time_min_days)}–{String(product.metadata.lead_time_max_days)} working days. Delivery arranged after manufacture.</p> : null}'));
console.log('Beds4u customizations applied');
