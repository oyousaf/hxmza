const fs=require('fs')
function edit(p,fn){fs.writeFileSync(p,fn(fs.readFileSync(p,'utf8')))}
const root='apps/storefront/src/'
edit(root+'lib/data/cart.ts',s=>{
 s=s.replace(/export async function applyGiftCard[\s\S]*?(?=export async function submitPromotionForm)/,'')
 s=s.replaceAll('catch (e: any)', 'catch (e: unknown)').replaceAll('return e.message','return e instanceof Error ? e.message : "Unable to update your basket"')
 s=s.replace('const cartId = getCartId()','const cartId = await getCartId()')
 s=s.replace('    const data = {','    const value = (key: string) => String(formData.get(key) || "")\n    const data: HttpTypes.StoreUpdateCart = {')
 const start=s.indexOf('    const value = '),end=s.indexOf('    await updateCart(data)',start)
 s=s.slice(0,start)+s.slice(start,end).replaceAll('formData.get("','value("').replace('String(value(key) || "")','String(formData.get(key) || "")').replace('    } as any','    }')+s.slice(end)
 return s
})
edit(root+'modules/layout/components/language-select/index.tsx',s=>s.replaceAll('/* @ts-ignore */',''))
edit(root+'modules/products/components/product-tabs/index.tsx',s=>s.replace(/import (Back|FastDelivery|Refresh) from [^\n]+\n/g,''))
edit(root+'modules/account/components/register/index.tsx',s=>s.replace(/By creating an account,[\s\S]*?\n        <\/span>/,'Your account keeps your addresses and order history together.\n        </span>').replace(/import LocalizedClientLink from [^\n]+\n/,''))
edit(root+'modules/checkout/components/review/index.tsx',s=>s.replace(/By clicking the Place Order button,[\s\S]*?Store&apos;s Privacy Policy\./,'Check your bed size, finish, delivery address and order total before placing your order.'))
edit(root+'modules/home/components/hero/index.tsx',s=>'import Image from "next/image"\n'+s.replace('<img src=','<Image width={900} height={700} priority src='))
