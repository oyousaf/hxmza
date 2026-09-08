import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { randomBytes } from "node:crypto"

// Creates a test customer and a manual-payment test order. Local targets only.
const env = Object.fromEntries(readFileSync('apps/storefront/.env.local','utf8').split(/\r?\n/).filter(l=>l && !l.startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)]}))
const base = env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
assert(['localhost','127.0.0.1'].includes(new URL(base).hostname), 'Smoke tests must target localhost')
let token
async function api(path, method='GET', data, auth=token) {
 const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json','x-publishable-api-key':env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,...(auth?{Authorization:`Bearer ${auth}`}:{})},body:data?JSON.stringify(data):undefined})
 const body=await r.json()
 assert(r.ok, `${method} ${path}: ${r.status} ${JSON.stringify(body)}`)
 return body
}
const {regions}=await api('/store/regions')
const region=regions.find(r=>r.currency_code==='gbp')
assert(region)
const {products}=await api(`/store/products?region_id=${region.id}&limit=100&fields=*variants.calculated_price,*variants.inventory_quantity`)
assert.equal(products.length,21)
assert.equal(products.reduce((sum,p)=>sum+p.variants.length,0),57)
const variant=products.find(p=>p.handle==='silver-ottoman').variants[0]
assert(variant.calculated_price.calculated_amount>=499)
const email=`smoke-${Date.now()}@example.test`
const password=randomBytes(24).toString('hex')
token=(await api('/auth/customer/emailpass/register','POST',{email,password})).token
assert(token)
await api('/store/customers','POST',{email,first_name:'Beds4u',last_name:'Test'})
token=(await api('/auth/customer/emailpass','POST',{email,password})).token
assert(token)
const {customer}=await api('/store/customers/me')
assert.equal(customer.email,email)
const address={first_name:'Beds4u',last_name:'Test',address_1:'1 Test Street',city:'London',postal_code:'SW1A 1AA',country_code:'gb',phone:'07700900000'}
let {cart}=await api('/store/carts','POST',{region_id:region.id,email,shipping_address:address,billing_address:address})
cart=(await api(`/store/carts/${cart.id}/line-items`,'POST',{variant_id:variant.id,quantity:1})).cart
assert.equal(cart.items[0].quantity,1)
cart=(await api(`/store/carts/${cart.id}/line-items/${cart.items[0].id}`,'POST',{quantity:2})).cart
assert.equal(cart.items[0].quantity,2)
cart=(await api(`/store/carts/${cart.id}/line-items/${cart.items[0].id}`,'POST',{quantity:1})).cart
const {shipping_options}=await api(`/store/shipping-options?cart_id=${cart.id}`)
assert.equal(shipping_options.length,1)
cart=(await api(`/store/carts/${cart.id}/shipping-methods`,'POST',{option_id:shipping_options[0].id})).cart
assert.equal(cart.shipping_total,49)
const {payment_collection}=await api('/store/payment-collections','POST',{cart_id:cart.id})
await api(`/store/payment-collections/${payment_collection.id}/payment-sessions`,'POST',{provider_id:'pp_system_default'})
const result=await api(`/store/carts/${cart.id}/complete`,'POST',{})
assert.equal(result.type,'order',JSON.stringify(result))
assert.equal(result.order.total,variant.calculated_price.calculated_amount+49)
const {orders}=await api('/store/orders')
assert(orders.some(o=>o.id===result.order.id))
const unauth=await fetch(base+'/store/customers/me',{headers:{'x-publishable-api-key':env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}})
assert.equal(unauth.status,401)
console.log('PASS: GBP catalogue, 57 variants, customer registration/login, basket quantity updates, delivery, manual test checkout, order history, unauthorized account rejection.')
console.log('Stripe is not tested by this script. A test order and customer remain in the local database.')
