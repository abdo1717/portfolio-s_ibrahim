import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ContactSection from '@/components/sections/ContactSection.vue'

const fill = async (w: ReturnType<typeof mount>, over: Record<string, string> = {}) => {
  const v = {
    name: 'Sara Ali',
    email: 'sara@company.com',
    message: 'Please review our BGP setup soon.',
    ...over,
  }
  await w.find('#contact-name').setValue(v.name)
  await w.find('#contact-email').setValue(v.email)
  await w.find('#contact-message').setValue(v.message)
}

describe('ContactSection', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useRealTimers()
  })

  it('shows accessible errors and sends nothing when invalid', async () => {
    const w = mount(ContactSection, { attachTo: document.body })
    await w.find('form').trigger('submit')
    expect(w.find('#err-name').exists()).toBe(true)
    expect(w.find('#contact-email').attributes('aria-invalid')).toBe('true')
    expect(w.find('[role="status"]').text()).toBe('')
    w.unmount()
  })

  it('escapes hostile input (rendered as text, never as HTML)', async () => {
    const w = mount(ContactSection)
    await fill(w, { name: '<img src=x onerror=alert(1)>' })
    await w.find('form').trigger('submit')
    expect(w.html()).not.toContain('<img src=x')
  })

  it('silently ignores submissions that fill the honeypot', async () => {
    const w = mount(ContactSection)
    await fill(w)
    await w.find('input[name="website"]').setValue('http://spam')
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(localStorage.getItem('contact:lastSent')).toBeNull()
  })

  it('rejects a submit that is faster than a human could type', async () => {
    const w = mount(ContactSection)
    await fill(w)
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(w.find('[role="status"]').text()).toContain('could not be sent')
  })

  it('has the honeypot hidden from assistive tech', () => {
    const w = mount(ContactSection)
    const hp = w.find('input[name="website"]')
    expect(hp.attributes('tabindex')).toBe('-1')
    expect(hp.element.closest('[aria-hidden="true"]')).not.toBeNull()
  })
})
