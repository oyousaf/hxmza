import { Metadata } from "next"

import { retrieveWishlist } from "@lib/data/wishlist"
import { listProducts } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Beds you've saved for later.",
}

export default async function Wishlist(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const [wishlistItems, region] = await Promise.all([
    retrieveWishlist(),
    getRegion(countryCode),
  ])

  const productIds = wishlistItems.map((item) => item.product_id)

  const products =
    productIds.length && region
      ? await listProducts({
          countryCode,
          queryParams: { id: productIds },
        }).then(({ response }) => response.products)
      : []

  return (
    <div className="w-full" data-testid="wishlist-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Wishlist</h1>
        <p className="text-base-regular">
          Beds you&apos;ve saved for later — click the heart on any product to remove it.
        </p>
      </div>
      {products.length ? (
        <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-12">
          {products.map((product) =>
            region ? (
              <li key={product.id}>
                <ProductPreview product={product} region={region} />
              </li>
            ) : null
          )}
        </ul>
      ) : (
        <p className="text-base-regular text-ui-fg-subtle">
          Nothing saved yet — browse the store and tap the heart on anything you like.
        </p>
      )}
    </div>
  )
}
