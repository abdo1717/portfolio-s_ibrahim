import type { Directive } from 'vue'

/**
 * v-reveal — fades/slides an element in the first time it scrolls into view.
 *
 *   <p v-reveal>…</p>                     default: rise
 *   <p v-reveal="120">…</p>               120ms delay (use for staggering)
 *   <p v-reveal="{ delay: 120, variant: 'left' }">…</p>
 *
 * Variants: 'up' (default) | 'left' | 'scale' | 'bar' (scaleX draw-in).
 * Falls back to "visible" when IntersectionObserver is missing (old browsers,
 * jsdom) or when the user prefers reduced motion — content is never hidden.
 */
export type RevealValue = number | { delay?: number; variant?: 'up' | 'left' | 'scale' | 'bar' }

let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
  }
  return observer
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

export const vReveal: Directive<HTMLElement, RevealValue | undefined> = {
  // `beforeMount`: Vue writes the element's own `class` AFTER `created`, which would wipe our classes.
  // It still runs before the element is inserted, so the hidden state is in place before the first paint.
  beforeMount(el, { value }) {
    const opts = typeof value === 'number' ? { delay: value } : (value ?? {})
    const variant = opts.variant ?? 'up'

    el.classList.add(variant === 'bar' ? 'reveal-bar' : 'reveal')
    if (variant === 'left') el.classList.add('reveal-left')
    if (variant === 'scale') el.classList.add('reveal-scale')
    if (opts.delay) el.style.setProperty('--reveal-delay', `${opts.delay}ms`)

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      el.classList.add('is-visible')
    }
  },
  mounted(el) {
    if (!el.classList.contains('is-visible')) getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
