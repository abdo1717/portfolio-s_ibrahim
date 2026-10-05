<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import AppIcon, { type IconName } from '@/components/ui/AppIcon.vue'
import { vReveal } from '@/directives/reveal'
import { inquiryTypes, profile, socials } from '@/data/portfolio'
import {
  COOLDOWN_MS,
  LIMITS,
  looksLikeBot,
  submitContact,
  validate,
  type ContactErrors,
  type ContactValues,
} from '@/utils/contact'

const COOLDOWN_KEY = 'contact:lastSent'

const contactItems: {
  icon: IconName
  title: string
  text: string
  href?: string
  external?: boolean
}[] = [
  { icon: 'mail', title: 'Email Address', text: profile.email, href: `mailto:${profile.email}` },
  { icon: 'pin', title: 'Location', text: profile.location },
  {
    icon: 'link',
    title: 'Professional Network',
    text: 'LinkedIn Profile',
    href: socials.linkedin,
    external: true,
  },
]

const values = reactive<ContactValues>({
  name: '',
  email: '',
  inquiry: inquiryTypes[0],
  message: '',
  website: '', // honeypot
})
const errors = ref<ContactErrors>({})
const status = ref<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle')
const renderedAt = ref(Date.now())
const messageLeft = computed(() => LIMITS.messageMax - values.message.length)

onMounted(() => {
  renderedAt.value = Date.now()
})

function cooldownLeft(): number {
  try {
    const last = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0)
    return Math.max(0, COOLDOWN_MS - (Date.now() - last))
  } catch {
    return 0 // storage blocked → no cooldown, server side must still rate-limit
  }
}

async function onSubmit() {
  if (status.value === 'sending') return

  errors.value = validate(values)
  if (Object.keys(errors.value).length) {
    // Move focus to the first invalid field.
    const first = (['name', 'email', 'inquiry', 'message'] as const).find((k) => errors.value[k])
    if (first) document.getElementById(`contact-${first}`)?.focus()
    return
  }

  // Honeypot filled → a bot. Pretend success and send nothing.
  if (values.website.trim() !== '') {
    status.value = 'sent'
    return
  }
  // Implausibly fast (autofill + paste) → never drop a real message silently, ask to retry.
  if (looksLikeBot(values, renderedAt.value)) {
    status.value = 'error'
    return
  }

  if (cooldownLeft() > 0) {
    status.value = 'error'
    return
  }

  status.value = 'sending'
  const result = await submitContact(values)

  if (!result.ok) {
    status.value = 'error'
    return
  }

  try {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()))
  } catch {
    /* ignore */
  }

  if (result.via === 'mailto' && result.mailto) {
    window.location.href = result.mailto
    status.value = 'mailto'
  } else {
    status.value = 'sent'
  }

  values.name = ''
  values.email = ''
  values.message = ''
}

const fieldBase =
  'w-full rounded border bg-white px-4 py-3 font-body text-base tracking-normal text-navy outline-none transition-colors placeholder:text-steel/60 focus:border-primaryBlue-500 focus:ring-2 focus:ring-primaryBlue-500/15'
const labelBase = 'font-mono text-sm font-medium tracking-[0.7px] text-muted'
</script>

<template>
  <section id="contact" class="px-4 py-16 sm:px-10 sm:py-24 lg:px-16">
    <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
      <div class="flex flex-col justify-center gap-8 lg:col-span-5">
        <div>
          <p v-reveal class="font-mono text-sm font-medium uppercase tracking-[0.7px] text-steel">
            Communication Channel
          </p>
          <h2
            v-reveal="80"
            class="mt-2 font-heading text-[clamp(2.25rem,10vw,3rem)] font-bold leading-tight tracking-[-0.02em] text-navy lg:text-[48px]"
          >
            Establish a Connection.
          </h2>
          <p v-reveal="160" class="mt-4 font-body text-lg leading-relaxed text-[#434652]">
            Whether you need network architecture consulting, infrastructure optimization, or
            troubleshooting expertise, I am available to discuss your technical requirements.
          </p>
        </div>

        <ul class="flex flex-col gap-6">
          <li
            v-for="(item, i) in contactItems"
            :key="item.title"
            v-reveal="240 + i * 100"
            class="flex items-center gap-4"
          >
            <div
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-border bg-[#EFF4FF] text-primaryBlue-500"
            >
              <AppIcon :name="item.icon" :size="22" />
            </div>
            <div>
              <h3 class="font-body text-lg font-semibold text-navy">{{ item.title }}</h3>
              <a
                v-if="item.href"
                :href="item.href"
                class="inline-flex items-center gap-1 font-body text-base text-steel underline-offset-4 hover:text-primaryBlue-600 hover:underline"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
              >
                {{ item.text }}
                <AppIcon v-if="item.external" name="external" :size="14" />
              </a>
              <p v-else class="font-body text-base text-steel">{{ item.text }}</p>
            </div>
          </li>
        </ul>
      </div>

      <form
        v-reveal="{ delay: 120, variant: 'scale' }"
        class="flex min-w-0 flex-col gap-6 rounded border border-border-light bg-white p-5 shadow-[0_4px_12px_rgba(0,61,155,0.05)] sm:p-8 lg:col-span-7"
        novalidate
        aria-label="Contact form"
        @submit.prevent="onSubmit"
      >
        <div class="grid gap-6 sm:grid-cols-2">
          <div class="flex flex-col gap-2">
            <label :class="labelBase" for="contact-name">Name / Identifier</label>
            <input
              id="contact-name"
              v-model="values.name"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="John Doe"
              required
              :maxlength="LIMITS.nameMax"
              :aria-invalid="!!errors.name"
              :aria-describedby="errors.name ? 'err-name' : undefined"
              :class="[fieldBase, errors.name ? 'border-red-500' : 'border-border-light']"
            />
            <span v-if="errors.name" id="err-name" class="font-body text-sm text-red-600">{{
              errors.name
            }}</span>
          </div>

          <div class="flex flex-col gap-2">
            <label :class="labelBase" for="contact-email">Email Address</label>
            <input
              id="contact-email"
              v-model="values.email"
              type="email"
              name="email"
              autocomplete="email"
              inputmode="email"
              placeholder="john@example.com"
              required
              :maxlength="LIMITS.emailMax"
              :aria-invalid="!!errors.email"
              :aria-describedby="errors.email ? 'err-email' : undefined"
              :class="[fieldBase, errors.email ? 'border-red-500' : 'border-border-light']"
            />
            <span v-if="errors.email" id="err-email" class="font-body text-sm text-red-600">{{
              errors.email
            }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label :class="labelBase" for="contact-inquiry">Inquiry Type</label>
          <select
            id="contact-inquiry"
            v-model="values.inquiry"
            name="inquiry"
            :aria-invalid="!!errors.inquiry"
            :aria-describedby="errors.inquiry ? 'err-inquiry' : undefined"
            :class="[fieldBase, errors.inquiry ? 'border-red-500' : 'border-border-light']"
          >
            <option v-for="type in inquiryTypes" :key="type" :value="type">{{ type }}</option>
          </select>
          <span v-if="errors.inquiry" id="err-inquiry" class="font-body text-sm text-red-600">{{
            errors.inquiry
          }}</span>
        </div>

        <div class="flex flex-col gap-2">
          <label :class="labelBase" for="contact-message">Message / Packet Payload</label>
          <textarea
            id="contact-message"
            v-model="values.message"
            name="message"
            rows="5"
            placeholder="Describe your network requirements..."
            required
            :maxlength="LIMITS.messageMax"
            :aria-invalid="!!errors.message"
            :aria-describedby="errors.message ? 'err-message' : 'message-count'"
            :class="[
              fieldBase,
              'resize-y',
              errors.message ? 'border-red-500' : 'border-border-light',
            ]"
          ></textarea>
          <div class="flex justify-between gap-4 font-body text-sm">
            <span v-if="errors.message" id="err-message" class="text-red-600">{{
              errors.message
            }}</span>
            <span v-else></span>
            <span id="message-count" class="tabular-nums text-steel/80">{{ messageLeft }}</span>
          </div>
        </div>

        <!-- Honeypot: invisible to people and to screen readers, bots fill it. -->
        <div class="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>
            Website
            <input
              v-model="values.website"
              type="text"
              name="website"
              tabindex="-1"
              autocomplete="off"
            />
          </label>
        </div>

        <button
          type="submit"
          :disabled="status === 'sending'"
          class="flex items-center justify-center gap-2 rounded bg-primaryBlue-500 px-6 py-3 font-body font-medium text-white transition hover:bg-primaryBlue-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {{ status === 'sending' ? 'Sending…' : 'Transmit Message' }}
          <AppIcon name="send" :size="18" />
        </button>

        <!-- One live region announces every outcome to assistive tech. -->
        <p
          role="status"
          aria-live="polite"
          class="min-h-6 font-body text-sm"
          :class="status === 'error' ? 'text-red-600' : 'text-primaryBlue-600'"
        >
          <template v-if="status === 'sent'"
            >Message sent. Thank you — I'll reply as soon as possible.</template
          >
          <template v-else-if="status === 'mailto'"
            >Your email app should open with the message ready to send.</template
          >
          <template v-else-if="status === 'error'">
            The message could not be sent right now. Wait a moment and try again, or email me
            directly at
            {{ profile.email }}.
          </template>
        </p>
      </form>
    </div>
  </section>
</template>
