// Native `window.scrollTo({ behavior: "smooth" })` timing varies by browser
// and distance, and tends to decelerate abruptly right at the end. This
// drives the scroll manually over a fixed duration with an ease-out curve
// so it feels the same everywhere — still just one rAF loop, negligible cost.
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function scrollToTop(duration = 300) {
  if (typeof window === "undefined") return

  const start = window.scrollY
  if (start === 0) return

  const startTime = performance.now()

  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    // behavior: "auto" is required here — the site sets CSS
    // `scroll-behavior: smooth` globally, which would otherwise make the
    // browser layer its own smooth animation on top of every frame's jump,
    // causing a visible snap once this loop stops but the browser's
    // animation hasn't caught up.
    window.scrollTo({
      top: start * (1 - easeOutCubic(progress)),
      left: 0,
      behavior: "auto",
    })

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}
