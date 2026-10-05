import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'
import ProjectDetailView from '@/views/ProjectDetailView.vue'
import { projects } from '@/data/portfolio'

describe.each(projects.map((p) => [p.slug, p] as const))(
  'ProjectDetailView /%s',
  (slug, project) => {
    it('renders the whole case study', async () => {
      const router = createAppRouter(createMemoryHistory())
      await router.push(`/projects/${slug}`)
      const wrapper = mount(ProjectDetailView, { global: { plugins: [router] } })
      await flushPromises()

      expect(wrapper.find('h1').text()).toBe(project.title)
      for (const h of [
        'Overview',
        'The challenge',
        'How it was built',
        'Architecture',
        'Sample configuration',
        'Outcomes',
      ]) {
        expect(wrapper.text()).toContain(h)
      }
      expect(wrapper.findAll('ol > li').length).toBe(project.approach.length)
      expect(wrapper.find('svg[role="img"] desc').text().length).toBeGreaterThan(10) // diagram has a text alternative
      expect(wrapper.find('pre code').text()).toBe(project.config.code)
      expect(wrapper.find('a[href="/#projects"]').exists()).toBe(true) // back link
    })
  },
)
