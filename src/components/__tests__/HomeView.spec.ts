import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'
import HomeView from '@/views/HomeView.vue'
import NavBar from '@/components/NavBar.vue'
import { projects, profile } from '@/data/portfolio'

async function mountWithRouter(component: object, path = '/') {
  const router = createAppRouter(createMemoryHistory())
  await router.push(path)
  await router.isReady()
  return { router, wrapper: mount(component, { global: { plugins: [router] } }) }
}

describe('HomeView', () => {
  it('renders all sections with their content visible (no hidden text without IntersectionObserver)', async () => {
    const { wrapper } = await mountWithRouter(HomeView)
    const text = wrapper.text()
    for (const s of [
      'Ibrahim',
      'Network Engineer',
      'About Me',
      'Skills',
      'My Projects',
      'Establish a Connection.',
    ]) {
      expect(text).toContain(s)
    }
    expect(wrapper.findAll('.reveal').every((el) => el.classes().includes('is-visible'))).toBe(true)
  })

  it('renders the hero shape and both dot grids from the design', async () => {
    const { wrapper } = await mountWithRouter(HomeView)
    expect(wrapper.find('.hero-shape-rect').exists()).toBe(true)
    expect(wrapper.findAll('svg.dot-grid').length).toBe(2)
    expect(wrapper.find('img.hero-person').attributes('alt')).toBe(profile.name)
  })

  it('links every "View Case Study" button to its own project page', async () => {
    const { wrapper } = await mountWithRouter(HomeView)
    const hrefs = wrapper
      .findAll('a[aria-label^="View case study"]')
      .map((a) => a.attributes('href'))
    expect(hrefs).toEqual(projects.map((p) => `/projects/${p.slug}`))
  })

  it('opens external links safely', async () => {
    const { wrapper } = await mountWithRouter(HomeView)
    wrapper
      .findAll('a[target="_blank"]')
      .forEach((a) => expect(a.attributes('rel')).toContain('noopener'))
  })
})

describe('NavBar', () => {
  it('uses router links (no full-page reloads) and a real CV download link', async () => {
    const { wrapper } = await mountWithRouter(NavBar)
    expect(wrapper.find('a[href="/#about"]').exists()).toBe(true)
    const cv = wrapper.find('a[download]')
    expect(cv.attributes('href')).toBe(profile.cvUrl)
  })

  it('toggles the mobile menu with correct aria state', async () => {
    const { wrapper } = await mountWithRouter(NavBar)
    const btn = wrapper.find('button[aria-controls="mobile-menu"]')
    expect(btn.attributes('aria-expanded')).toBe('false')
    await btn.trigger('click')
    expect(btn.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('#mobile-menu').exists()).toBe(true)
    await wrapper.find('header').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('#mobile-menu').exists()).toBe(false)
  })

  it('highlights "Projects" on a case-study page', async () => {
    const { wrapper } = await mountWithRouter(NavBar, `/projects/${projects[0]!.slug}`)
    await flushPromises()
    expect(wrapper.find('a[aria-current="true"]').text()).toBe('Projects')
  })
})
