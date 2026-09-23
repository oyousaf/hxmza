# Hxmza's Hub — Car Rental App 🚗

A stylish, responsive car rental platform built with:

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Motion](https://motion.dev) (formerly Framer Motion)
- [Car Specs API (RapidAPI)](https://rapidapi.com/alekivanovski96-O1vKHrFskQm/api/car-specs) — proxied server-side
- [Unsplash API](https://unsplash.com/developers) — proxied server-side

## Features
- Search available cars by make
- Featured filter and sorting (price, rating, mileage)
- Animated UI with an accessible, keyboard-navigable modal for car specs
- Optimized image rendering and accessibility (skip link, focus trap, keyboard search)
- Mobile responsive, dark mode

## Setup

Copy `.env.local.example` to `.env.local` and fill in your keys:

```
RAPIDAPI_KEY=
UNSPLASH_ACCESS_KEY=
```

These are server-only env vars (no `NEXT_PUBLIC_` prefix) — the app proxies
both APIs through Next.js route handlers under `app/api/` so the keys are
never sent to the browser.

```
npm install
npm run dev
```
