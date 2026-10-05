<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import { vReveal } from '@/directives/reveal'
</script>

<template>
  <section class="px-4 py-16 sm:px-10 sm:py-20 lg:px-16">
    <div
      v-reveal="{ variant: 'scale' }"
      class="relative mx-auto flex max-w-7xl flex-col items-center overflow-hidden rounded-3xl border border-border bg-primaryBlue-500 px-5 py-12 text-center shadow-sm sm:px-12 sm:py-16 lg:py-20"
    >
      <!-- Soft light in the top-left corner, as in the design. -->
      <div
        class="pointer-events-none absolute -left-10 -top-6 h-24 w-56 rounded-full bg-white/15 blur-2xl"
        aria-hidden="true"
      ></div>

      <h2
        class="relative max-w-3xl font-body text-[clamp(2rem,9vw,3rem)] font-bold leading-tight tracking-[-0.02em] text-white lg:text-[48px]"
      >
        Let’s Build a Stronger Network
      </h2>
      <div
        class="relative mt-6 max-w-2xl space-y-2 font-body text-base leading-relaxed text-[#B1C6F9] sm:text-lg"
      >
        <p>Need a reliable, secure, and scalable network infrastructure?</p>
        <p>
          I’m always open to discussing new projects, technical challenges, or opportunities to
          improve network performance and security.
        </p>
        <p class="pt-2 font-semibold text-white">
          Let’s connect and build a network that works for you.
        </p>
      </div>
      <RouterLink
        :to="{ name: 'home', hash: '#contact' }"
        class="relative mt-8 inline-flex items-center justify-center gap-3 rounded-2xl border border-primaryBlue-500 bg-primaryBlue-50 px-6 py-3 font-body text-lg text-primaryBlue-500 transition hover:bg-white hover:shadow-lg sm:mt-10 sm:text-xl"
      >
        Contact Me
        <AppIcon name="arrow-right" :size="22" />
      </RouterLink>
    </div>
  </section>
</template>
