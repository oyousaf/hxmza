import { NextRequest, NextResponse } from "next/server"

// Beds4u ships to the UK only — there is a single region ("gb"), so the
// storefront's [countryCode] route segment is applied internally via a
// rewrite rather than exposed in the URL. Visitors only ever see clean
// paths like /store or /cart; Next resolves them against /gb/store etc.
const REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "gb"

export function middleware(request: NextRequest) {
  // Any request for a real file (public/ assets, generated metadata routes,
  // etc.) should pass through untouched rather than be rewritten under /gb.
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  const path = request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
  url.pathname = `/${REGION}${path}`
  const response = NextResponse.rewrite(url)

  if (!request.cookies.get("_medusa_cache_id")) {
    response.cookies.set("_medusa_cache_id", crypto.randomUUID(), {
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image|twitter-image|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
