import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"
import LayoutBanners from "@modules/layout/components/layout-banners"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <LayoutBanners />
      {props.children}
      <Footer />
    </>
  )
}
