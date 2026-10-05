import { describe, expect, it, vi } from 'vitest'
import {
  buildMailto,
  cleanSingleLine,
  looksLikeBot,
  safeEndpoint,
  sanitize,
  submitContact,
  validate,
  type ContactValues,
} from '@/utils/contact'

const ok: ContactValues = {
  name: 'Sara Ali',
  email: 'sara@company.com',
  inquiry: 'Troubleshooting',
  message: 'Our branch VPN drops every hour, can you help?',
  website: '',
}

describe('validate', () => {
  it('accepts a valid form', () => expect(validate(ok)).toEqual({}))

  it.each(['', 'a', 'a@b', 'a b@c.com', 'a@@c.com', '<script>@x.com', 'x@y..com'])(
    'rejects email %j',
    (email) => {
      expect(validate({ ...ok, email }).email).toBeTruthy()
    },
  )

  it('enforces length limits', () => {
    expect(validate({ ...ok, name: 'x'.repeat(81) }).name).toBeTruthy()
    expect(validate({ ...ok, message: 'short' }).message).toBeTruthy()
    expect(validate({ ...ok, message: 'x'.repeat(2001) }).message).toBeTruthy()
  })

  it('rejects an inquiry type that is not in the list (tampered select)', () => {
    expect(validate({ ...ok, inquiry: 'Free money' }).inquiry).toBeTruthy()
  })
})

describe('sanitize / header injection', () => {
  it('strips CR/LF from single-line fields', () => {
    expect(cleanSingleLine('Sara\r\nBcc: evil@x.com')).toBe('Sara Bcc: evil@x.com')
  })
  it('keeps newlines in the message but removes other control characters', () => {
    expect(sanitize({ ...ok, message: 'line1\r\nline2\u0000\u0007' }).message).toBe('line1\nline2')
  })
})

describe('buildMailto', () => {
  it('percent-encodes everything and cannot smuggle extra headers', () => {
    const url = buildMailto({ ...ok, name: 'X\r\nBcc: evil@x.com' }, 'me@site.com')
    expect(url.startsWith('mailto:me%40site.com?subject=')).toBe(true)
    expect(url).not.toMatch(/[\r\n]/)
    expect(decodeURIComponent(url)).not.toContain('\nBcc:')
  })
})

describe('bot checks', () => {
  it('flags a filled honeypot', () =>
    expect(looksLikeBot({ ...ok, website: 'x' }, 0, 99999)).toBe(true))
  it('flags a too-fast submit', () => expect(looksLikeBot(ok, 1000, 1500)).toBe(true))
  it('lets a normal submit through', () => expect(looksLikeBot(ok, 1000, 9000)).toBe(false))
})

describe('safeEndpoint', () => {
  it('allows https and same-origin paths only', () => {
    expect(safeEndpoint('https://formspree.io/f/abc')).toBe('https://formspree.io/f/abc')
    expect(safeEndpoint('/api/contact')).toBe('/api/contact')
    expect(safeEndpoint('http://insecure.com')).toBeNull()
    expect(safeEndpoint('//evil.com/x')).toBeNull()
    expect(safeEndpoint('javascript:alert(1)')).toBeNull()
    expect(safeEndpoint('')).toBeNull()
    expect(safeEndpoint(undefined)).toBeNull()
  })
})

describe('submitContact', () => {
  it('falls back to mailto without an endpoint', async () => {
    const r = await submitContact(ok, undefined)
    expect(r).toMatchObject({ ok: true, via: 'mailto' })
    expect(r.mailto).toContain('mailto:')
  })

  it('POSTs sanitized JSON without the honeypot field or credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    const r = await submitContact(
      { ...ok, name: '  Sara\n Ali ' },
      'https://x.io/f',
      fetchMock as unknown as typeof fetch,
    )
    expect(r).toEqual({ ok: true, via: 'endpoint' })
    const [, init] = fetchMock.mock.calls[0]!
    expect(JSON.parse(init.body)).toEqual({
      name: 'Sara Ali',
      email: ok.email,
      inquiry: ok.inquiry,
      message: ok.message,
    })
    expect(init.credentials).toBe('omit')
  })

  it('reports server and network failures', async () => {
    const bad = vi.fn().mockResolvedValue({ ok: false })
    expect(await submitContact(ok, 'https://x.io/f', bad as unknown as typeof fetch)).toEqual({
      ok: false,
      reason: 'server',
    })
    const down = vi.fn().mockRejectedValue(new TypeError('offline'))
    expect(await submitContact(ok, 'https://x.io/f', down as unknown as typeof fetch)).toEqual({
      ok: false,
      reason: 'network',
    })
  })
})
