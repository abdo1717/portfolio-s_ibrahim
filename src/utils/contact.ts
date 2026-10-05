import { inquiryTypes, profile } from '@/data/portfolio'

export const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
} as const

/** Minimum time (ms) a human needs to fill the form — faster submits are treated as bots. */
export const MIN_FILL_TIME_MS = 2500
/** Minimum time (ms) between two successful submits from the same browser. */
export const COOLDOWN_MS = 30_000

export interface ContactValues {
  name: string
  email: string
  inquiry: string
  message: string
  /** Honeypot: hidden from humans, bots fill it. Must stay empty. */
  website: string
}

export type ContactErrors = Partial<Record<'name' | 'email' | 'inquiry' | 'message', string>>

// Pragmatic email check (RFC-complete regexes cause more problems than they solve).
const EMAIL_RE =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/

/** Removes control characters (incl. CR/LF → blocks header injection) and collapses spaces. */
export function cleanSingleLine(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F\u2028\u2029]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Keeps newlines/tabs in the message but drops every other control character. */
export function cleanMultiLine(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n?/g, '\n')
    .trim()
}

export function sanitize(values: ContactValues): ContactValues {
  return {
    name: cleanSingleLine(values.name),
    email: cleanSingleLine(values.email),
    inquiry: cleanSingleLine(values.inquiry),
    message: cleanMultiLine(values.message),
    website: values.website,
  }
}

export function validate(raw: ContactValues): ContactErrors {
  const v = sanitize(raw)
  const errors: ContactErrors = {}

  if (v.name.length < LIMITS.nameMin)
    errors.name = `Enter your name (at least ${LIMITS.nameMin} characters).`
  else if (v.name.length > LIMITS.nameMax)
    errors.name = `Name is too long (max ${LIMITS.nameMax} characters).`

  if (!v.email) errors.email = 'Enter your email address.'
  else if (v.email.length > LIMITS.emailMax || !EMAIL_RE.test(v.email))
    errors.email = 'Enter a valid email address, for example name@company.com.'

  if (!(inquiryTypes as readonly string[]).includes(v.inquiry))
    errors.inquiry = 'Choose one of the inquiry types.'

  if (v.message.length < LIMITS.messageMin)
    errors.message = `Describe your request in at least ${LIMITS.messageMin} characters.`
  else if (v.message.length > LIMITS.messageMax)
    errors.message = `Message is too long (max ${LIMITS.messageMax} characters).`

  return errors
}

/** True when the request looks automated (honeypot filled or submitted implausibly fast). */
export function looksLikeBot(values: ContactValues, renderedAt: number, now = Date.now()): boolean {
  return values.website.trim() !== '' || now - renderedAt < MIN_FILL_TIME_MS
}

/** Accepts only https endpoints (or same-origin relative paths). */
export function safeEndpoint(endpoint: string | undefined): string | null {
  if (!endpoint) return null
  if (endpoint.startsWith('/') && !endpoint.startsWith('//')) return endpoint
  try {
    const url = new URL(endpoint)
    return url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

/** Builds the mailto: fallback. Every dynamic part is percent-encoded. */
export function buildMailto(values: ContactValues, to: string = profile.email): string {
  const v = sanitize(values)
  const subject = `[Portfolio] ${v.inquiry} — ${v.name}`
  const body = `${v.message}\n\n— ${v.name} (${v.email})`
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export type SubmitResult =
  | { ok: true; via: 'endpoint' | 'mailto' }
  | { ok: false; reason: 'network' | 'server' | 'timeout' }

/**
 * Sends the form to the configured endpoint (JSON, 10s timeout).
 * Without an endpoint it returns the mailto: link for the caller to open.
 */
export async function submitContact(
  values: ContactValues,
  endpoint: string | undefined = import.meta.env.VITE_CONTACT_ENDPOINT,
  fetchImpl: typeof fetch = fetch,
): Promise<SubmitResult & { mailto?: string }> {
  const v = sanitize(values)
  const url = safeEndpoint(endpoint)

  if (!url) return { ok: true, via: 'mailto', mailto: buildMailto(v) }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10_000)
  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: v.name,
        email: v.email,
        inquiry: v.inquiry,
        message: v.message,
      }),
      signal: controller.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    })
    return res.ok ? { ok: true, via: 'endpoint' } : { ok: false, reason: 'server' }
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof DOMException && e.name === 'AbortError' ? 'timeout' : 'network',
    }
  } finally {
    clearTimeout(timer)
  }
}
