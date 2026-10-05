import { describe, expect, it } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'
import { projects } from '@/data/portfolio'

const make = () => createAppRouter(createMemoryHistory())

describe('router', () => {
  it.each(projects.map((p) => p.slug))('resolves /projects/%s', async (slug) => {
    const router = make()
    await router.push(`/projects/${slug}`)
    expect(router.currentRoute.value.name).toBe('project')
  })

  it('sends an unknown project slug to the 404 page', async () => {
    const router = make()
    await router.push('/projects/does-not-exist')
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('sends unknown paths to the 404 page', async () => {
    const router = make()
    await router.push('/whatever/else')
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('keeps hash navigation on the home page', async () => {
    const router = make()
    await router.push({ name: 'home', hash: '#contact' })
    expect(router.currentRoute.value.hash).toBe('#contact')
  })
})
