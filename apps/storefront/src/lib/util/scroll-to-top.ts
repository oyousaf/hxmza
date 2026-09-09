// Native `window.scrollTo({ behavior: "smooth" })` timing varies by browser
// and distance, and tends to decelerate abruptly right at the end. This
// drives the scroll manually over a fixed duration with an ease-out curve
// so it feels the same everywhere — still just one rAF loop, negligible cost.
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function scrollToTop(duration = 600) {
  if (typeof window === "undefined") return

  const start = window.scrollY
  if (start === 0) return

  const startTime = performance.now()

  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    // behavior: "instant" is required here, not "auto" — per spec, "auto"
    // means "defer to the CSS scroll-behavior property", which is "smooth"
    // globally on this site. That was silently re-smoothing every frame's
    // jump on top of this loop's own easing, making the whole thing feel
    // laggy instead of snappy. "instant" is the only value that actually
    // bypasses CSS scroll-behavior.
    window.scrollTo({
      top: start * (1 - easeOutCubic(progress)),
      left: 0,
      behavior: "instant",
    })

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}
