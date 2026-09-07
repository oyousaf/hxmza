import LocalizedClientLink from "@modules/common/components/localized-client-link"

// TODO: replace these placeholder hrefs with Beds4u's real social profiles once available.
const socials = [
  { name: "Instagram", href: "#", icon: InstagramIcon },
  { name: "Facebook", href: "#", icon: FacebookIcon },
  { name: "TikTok", href: "#", icon: TikTokIcon },
]

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-200">
      <div className="content-container py-16 grid sm:grid-cols-2 gap-10">
        <div>
          <LocalizedClientLink
            href="/"
            className="font-serif text-3xl text-white"
          >
            Beds4u
          </LocalizedClientLink>
          <p className="mt-4 max-w-sm text-stone-300">
            A bed factory&apos;s range, built plainly and well: ottoman storage,
            upholstered sleigh frames, solid oak and slender steel — chosen for
            the long run, not the showroom floor.
          </p>
          <div className="flex gap-4 mt-6">
            {socials.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                className="text-stone-400 hover:text-white transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-8 gap-y-3 sm:justify-end content-start"
        >
          <LocalizedClientLink href="/store">All Beds</LocalizedClientLink>
          <LocalizedClientLink href="/collections/ottoman-beds">
            Ottoman Beds
          </LocalizedClientLink>
          <LocalizedClientLink href="/collections/traditional-oak">
            Traditional Oak
          </LocalizedClientLink>
          <LocalizedClientLink href="/collections/upholstered-sleigh">
            Upholstered Sleigh
          </LocalizedClientLink>
          <LocalizedClientLink href="/collections/divan-beds">
            Divan Beds
          </LocalizedClientLink>
          <LocalizedClientLink href="/collections/metal-frames">
            Metal Frames
          </LocalizedClientLink>
          <LocalizedClientLink href="/account">
            Your Account
          </LocalizedClientLink>
          <LocalizedClientLink href="/cart">Basket</LocalizedClientLink>
        </nav>
        <p className="text-xs text-stone-400">
          © {new Date().getFullYear()} Beds4u
        </p>
      </div>
    </footer>
  )
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 22v-8.5H16l.5-3.5h-3V7.7c0-1 .3-1.7 1.7-1.7H16.6V2.8C16.2 2.8 15 2.7 13.6 2.7c-2.9 0-4.9 1.8-4.9 5V10H5.7v3.5h3v8.5Z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 2h-3.1v13.4a3 3 0 1 1-2.1-2.9v-3.2a6.1 6.1 0 1 0 5.2 6V9.1a7.6 7.6 0 0 0 4.4 1.4V7.4A4.5 4.5 0 0 1 16.6 2Z" />
    </svg>
  )
}
