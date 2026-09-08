import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getBaseURL } from "@lib/util/env"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()

  const [{ collections }, { response }] = await Promise.all([
    listCollections({ fields: "handle" }),
    listProducts({ countryCode: "gb", queryParams: { limit: 100, fields: "handle" } }),
  ])

  const staticRoutes = ["", "/store", "/contact"].map((path) => ({
    url: `${baseUrl}${path}`,
  }))

  const collectionRoutes = (collections ?? []).map((collection) => ({
    url: `${baseUrl}/collections/${collection.handle}`,
  }))

  const productRoutes = response.products.map((product) => ({
    url: `${baseUrl}/products/${product.handle}`,
  }))

  return [...staticRoutes, ...collectionRoutes, ...productRoutes]
}
