import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Returns the id of the section currently under the "reading line"
 * (35% from the top of the viewport). Works with sections that appear/disappear
 * when the route changes, because it queries the DOM on every (throttled) scroll.
 */
export function useScrollSpy(ids: readonly string[]) {
  const active = ref<string>(ids[0] ?? '')
  let ticking = false

  function update() {
    ticking = false
    const line = window.innerHeight * 0.35
    let current = ''
    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= line) current = id
    }
    if (current) active.value = current
  }

  function onScroll() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return { active, refresh: update }
}
