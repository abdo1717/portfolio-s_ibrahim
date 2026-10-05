import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, withDirectives } from 'vue'
import { mount } from '@vue/test-utils'
import { vReveal } from '@/directives/reveal'

afterEach(() => vi.unstubAllGlobals())

const Demo = defineComponent({
  render: () => withDirectives(h('p', { class: 'own-class' }, 'hi'), [[vReveal, 200]]),
})

describe('v-reveal', () => {
  it('hides the element until it intersects, keeps its own classes, then reveals once', () => {
    let callback!: IntersectionObserverCallback
    const observe = vi.fn()
    const unobserve = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: IntersectionObserverCallback) {
          callback = cb
        }
        observe = observe
        unobserve = unobserve
      },
    )

    const el = mount(Demo).element as HTMLElement
    expect(el.classList.contains('own-class')).toBe(true) // Vue's class patch must not wipe ours
    expect(el.classList.contains('reveal')).toBe(true)
    expect(el.style.getPropertyValue('--reveal-delay')).toBe('200ms')
    expect(el.classList.contains('is-visible')).toBe(false)
    expect(observe).toHaveBeenCalledWith(el)

    callback(
      [{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    expect(el.classList.contains('is-visible')).toBe(true)
    expect(unobserve).toHaveBeenCalledWith(el)
  })

  it('shows the element immediately when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const w = mount(Demo)
    expect(w.classes()).toEqual(expect.arrayContaining(['reveal', 'is-visible', 'own-class']))
  })
})
