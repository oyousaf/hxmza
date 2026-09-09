// Native `window.scrollTo({ behavior: "smooth" })` timing varies by browser
// and distance, and tends to decelerate abruptly right at the end. This
// drives the scroll manually over a fixed duration with an ease-out curve
// so it feels the same everywhere — still just one rAF loop, negligible cost.
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function scrollToTop(duration = 500) {
  if (typeof window === "undefined") return

  const start = window.scrollY
  if (start === 0) return

  const startTime = performance.now()

  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, start * (1 - easeOutCubic(progress)))

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}
