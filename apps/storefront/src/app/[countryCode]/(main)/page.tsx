import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import OrnamentalDivider from "@modules/common/components/ornamental-divider"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Beds4u | Beds built to be lived with",
  description:
    "Ottoman storage, upholstered sleigh frames, solid oak and slender metal beds — a bed factory's range, built for rest and delivered across the UK.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <OrnamentalDivider />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
