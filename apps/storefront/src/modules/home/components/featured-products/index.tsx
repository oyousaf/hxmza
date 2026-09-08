import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import OrnamentalDivider from "@modules/common/components/ornamental-divider"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  return collections.map((collection, index) => (
    <li key={collection.id}>
      {index > 0 && <OrnamentalDivider />}
      <ProductRail collection={collection} region={region} />
    </li>
  ))
}
