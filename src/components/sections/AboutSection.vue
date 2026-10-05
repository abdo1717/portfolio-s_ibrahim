<script setup lang="ts">
import StatCounter from '@/components/ui/StatCounter.vue'
import { vReveal } from '@/directives/reveal'

const stats = [
  { to: 2, suffix: '+', label: 'Years Exp.' },
  { to: 6, suffix: '+', label: 'Projects Delivered' },
  { to: 99.1, decimals: 1, suffix: '%', label: 'Uptime Maintained' },
]
</script>

<template>
  <!-- `isolate` creates its own stacking context: the glow can sit behind the text
       without disappearing behind the section's white background (old bug). -->
  <section
    id="about"
    class="relative isolate overflow-hidden bg-white px-4 py-20 sm:px-10 sm:py-28 lg:px-16 lg:py-32"
  >
    <!-- Soft blue light bleeding in from the left edge, exactly like the design. -->
    <div
      class="about-glow pointer-events-none absolute -z-10"
      aria-hidden="true"
      v-reveal="{ variant: 'scale' }"
    ></div>

    <div class="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:gap-16">
      <div class="lg:sticky lg:top-32 lg:h-fit lg:w-80 lg:shrink-0">
        <h2
          v-reveal
          class="font-heading text-4xl font-extrabold leading-tight tracking-[-0.02em] text-ink lg:text-[48px]"
        >
          About Me
        </h2>
        <div
          v-reveal="{ variant: 'bar', delay: 250 }"
          class="mt-3 h-[7px] w-[114px] bg-primaryBlue-600"
        ></div>
      </div>

      <div class="relative flex-1">
        <div
          class="flex flex-col gap-5 font-body text-lg leading-relaxed text-ink sm:gap-6 lg:text-xl lg:leading-relaxed"
        >
          <p v-reveal="100">
            I'm Ibrahim Zaki, a Network Engineer and a graduate of the Arab Academy for Science,
            Technology &amp; Maritime Transport, with a degree in Communications Engineering.
          </p>
          <p v-reveal="220">
            With 2 years of experience in the mobile telecommunications field, I have developed
            practical experience in mobile network operations and telecommunications technologies,
            alongside my academic foundation in communications and networking.
          </p>
          <p v-reveal="340">
            I'm passionate about network infrastructure, troubleshooting, and building reliable and
            efficient network solutions. I continuously work on expanding my technical knowledge and
            developing my skills to take on new challenges in the networking and telecommunications
            industry.
          </p>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-3 sm:gap-8 lg:max-w-2xl">
          <div v-for="(stat, i) in stats" :key="stat.label" v-reveal="460 + i * 120">
            <StatCounter v-bind="stat" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* A radial gradient (not a blurred SVG) — smooth, cheap to paint, no visible edge.
   Centre sits ~60px inside the left edge, half-way down the section.
   The reveal directive adds .reveal-scale (scale .96 → 1) + opacity; here we add a slower ease. */
.about-glow {
  left: -260px;
  top: 50%;
  width: 560px;
  height: 560px;
  margin-top: -280px;
  border-radius: 9999px;
  background: radial-gradient(
    closest-side,
    rgba(0, 61, 155, 0.72) 0%,
    rgba(0, 61, 155, 0.42) 40%,
    rgba(0, 61, 155, 0.14) 72%,
    rgba(0, 61, 155, 0) 100%
  );
  filter: blur(24px);
  transition-duration: 1.6s !important;
}

/* Starts smaller and grows into place while it fades in. */
.about-glow.reveal-scale:not(.is-visible) {
  transform: scale(0.6);
}

@media (min-width: 1024px) {
  .about-glow {
    left: -320px;
    width: 760px;
    height: 720px;
    margin-top: -360px;
  }
}
</style>
