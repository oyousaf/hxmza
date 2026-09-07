import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-200">
      <div className="content-container py-16 grid sm:grid-cols-2 gap-10">
        <div>
          <LocalizedClientLink href="/" className="font-serif text-3xl text-white">
            Beds4u
          </LocalizedClientLink>
          <p className="mt-4 max-w-sm text-stone-300">
            A bed factory&apos;s range, built plainly and well: ottoman storage, upholstered sleigh frames, solid oak and slender steel — chosen for the long run, not the showroom floor.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 sm:justify-end content-start">
          <LocalizedClientLink href="/store">All beds</LocalizedClientLink>
          <LocalizedClientLink href="/collections/ottoman-beds">Ottoman beds</LocalizedClientLink>
          <LocalizedClientLink href="/collections/traditional-oak">Traditional oak</LocalizedClientLink>
          <LocalizedClientLink href="/collections/upholstered-sleigh">Upholstered sleigh</LocalizedClientLink>
          <LocalizedClientLink href="/collections/divan-beds">Divan beds</LocalizedClientLink>
          <LocalizedClientLink href="/collections/metal-frames">Metal frames</LocalizedClientLink>
          <LocalizedClientLink href="/account">Your account</LocalizedClientLink>
          <LocalizedClientLink href="/cart">Basket</LocalizedClientLink>
        </nav>
        <p className="text-xs text-stone-400">© {new Date().getFullYear()} Beds4u</p>
      </div>
    </footer>
  )
}
