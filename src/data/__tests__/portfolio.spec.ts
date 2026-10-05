import { describe, expect, it } from 'vitest'
import { getNeighbours, getProject, projects } from '@/data/portfolio'

describe('portfolio data integrity', () => {
  it('has unique, URL-safe slugs', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/))
  })

  it.each(projects.map((p) => [p.slug, p] as const))(
    '%s is complete and its topology is consistent',
    (_slug, p) => {
      for (const key of ['title', 'summary', 'overview', 'challenge', 'image', 'role'] as const)
        expect(p[key].length).toBeGreaterThan(0)
      expect(p.approach.length).toBeGreaterThan(0)
      expect(p.outcomes.length).toBeGreaterThan(0)
      expect(p.config.code.length).toBeGreaterThan(0)
      const ids = new Set(p.topology.nodes.map((n) => n.id))
      expect(ids.size).toBe(p.topology.nodes.length)
      p.topology.links.forEach((l) => {
        expect(ids.has(l.from)).toBe(true)
        expect(ids.has(l.to)).toBe(true)
      })
      p.topology.nodes.forEach((n) => {
        expect(n.x).toBeGreaterThanOrEqual(66)
        expect(n.x).toBeLessThanOrEqual(574)
      })
    },
  )

  it('never ships a real-looking secret in the sample configs', () => {
    projects.forEach((p) => expect(p.config.code).not.toMatch(/password|secret\s+\S{6,}/i))
  })

  it('looks projects and neighbours up (with wrap-around)', () => {
    expect(getProject('nope')).toBeUndefined()
    const first = projects[0]!
    const last = projects[projects.length - 1]!
    expect(getNeighbours(first.slug)!.prev.slug).toBe(last.slug)
    expect(getNeighbours(last.slug)!.next.slug).toBe(first.slug)
  })
})
