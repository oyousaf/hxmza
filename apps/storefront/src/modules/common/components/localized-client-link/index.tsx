"use client"

import Link from "next/link"
import React from "react"

/**
 * Beds4u ships to the UK only, so the country code is applied internally by
 * middleware rewrites rather than shown in the URL — links use plain paths.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: unknown
}) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
