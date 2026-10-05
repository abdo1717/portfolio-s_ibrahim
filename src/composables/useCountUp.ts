import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

interface CountUpOptions {
  to: number
  decimals?: number
  duration?: number
}

/**
 * Counts from 0 to `to` when `target` first scrolls into view.
 * Without IntersectionObserver / with reduced motion the final value is shown at once.
 */
export function useCountUp(
  target: Ref<HTMLElement | null>,
  { to, decimals = 0, duration = 1400 }: CountUpOptions,
) {
  const value = ref(to) // final value first → correct for no-JS-animation cases and tests
  let frame = 0
  let observer: IntersectionObserver | undefined

  const format = (n: number) => n.toFixed(decimals)
  const display = ref(format(to))

  function run() {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      value.value = to * eased
      display.value = format(value.value)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }

  onMounted(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!target.value || typeof IntersectionObserver === 'undefined' || reduced) return

    display.value = format(0)
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer?.disconnect()
          run()
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(target.value)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    observer?.disconnect()
  })

  return { display }
}
