<script setup lang="ts">
import DotGrid from '@/components/ui/DotGrid.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { profile } from '@/data/portfolio'
</script>

<template>
  <section
    id="home"
    class="relative overflow-hidden bg-white px-4 pb-16 pt-8 sm:px-10 sm:pb-20 sm:pt-12 lg:px-16 lg:pb-28 lg:pt-16"
  >
    <!-- Blue dot matrix on the far left edge -->
    <div class="absolute left-0 top-[80px] hidden w-[80px] text-primaryBlue-500 lg:block">
      <DotGrid :cols="5" :rows="9" :delay="350" />
    </div>

    <div
      class="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-10 lg:flex-row lg:justify-between lg:gap-16"
    >
      <!-- ───────── Text ──────── -->
      <div class="flex min-w-0 flex-1 flex-col items-start gap-6 lg:gap-7">
        <div
          class="hero-in flex max-w-full items-center gap-2 rounded-xl border border-[#C3C6D6]/50 bg-[#EDEEF0] px-3 py-1.5 sm:px-3.5"
          style="--d: 0ms"
        >
          <span class="block h-3 w-3 rounded-full bg-[#90EE90]/75" aria-hidden="true"></span>
          <span
            class="font-mono text-[10px] font-medium uppercase leading-4 tracking-[0.45px] text-primaryBlue-1000 sm:text-sm sm:tracking-[0.6px]"
          >
            Available for new opportunities
          </span>
        </div>

        <h1
          class="font-heading text-[clamp(2.25rem,10vw,3rem)] font-bold leading-tight tracking-[-0.02em] text-ink lg:text-[48px] lg:leading-[60px]"
        >
          <span class="hero-in block" style="--d: 120ms">
            <span class="text-primaryBlue-500">Ibrahim</span> Zaki
          </span>
          <!-- ═══ تعديل: شيلنا الـ cursor المنفصل، الـ border-right هو اللي بينمض ══ -->
          <span class="hero-in block" style="--d: 240ms">
            <span class="typing-text">Network Engineer</span>
          </span>
        </h1>

        <p
          class="hero-in max-w-xl font-body text-lg leading-relaxed text-muted sm:text-xl"
          style="--d: 360ms"
        >
          Designing, configuring, and maintaining secure, reliable, and high-performance networks
          that keep businesses connected.
        </p>

        <div
          class="hero-in flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
          style="--d: 480ms"
        >
          <RouterLink
            :to="{ name: 'home', hash: '#projects' }"
            class="inline-flex items-center justify-center gap-3 rounded-xl border border-primaryBlue-50 bg-primaryBlue-500 px-5 py-2.5 font-body text-lg text-primaryBlue-50 transition hover:bg-primaryBlue-600 hover:shadow-lg hover:shadow-primaryBlue-500/25"
          >
            View Projects
            <AppIcon name="arrow-right" :size="22" />
          </RouterLink>
          <RouterLink
            :to="{ name: 'home', hash: '#contact' }"
            class="inline-flex items-center justify-center gap-3 rounded-xl border border-primaryBlue-1000 bg-white px-5 py-2.5 font-body text-lg text-primaryBlue-1000 transition-colors hover:bg-primaryBlue-50"
          >
            Contact Me
          </RouterLink>
        </div>
      </div>

      <!-- ───────── Stage: blue shape + dots + photo ───────── -->
      <div class="hero-stage" data-testid="hero-stage">
        <div class="hero-shape" aria-hidden="true">
          <div class="hero-shape-rect"></div>
        </div>

        <div class="hero-dots-right hidden text-white lg:block" aria-hidden="true">
          <DotGrid :cols="5" :rows="9" :delay="900" />
        </div>

        <img
          :src="profile.photo"
          :alt="profile.name"
          class="hero-person"
          width="360"
          height="600"
          decoding="async"
          fetchpriority="high"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ──────────── Intro animation (runs once on load) ───────────── */
.hero-in {
  opacity: 0;
  animation: hero-rise 0.85s var(--ease-out-expo) forwards;
  animation-delay: var(--d, 0ms);
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translate3d(0, 22px, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ═══════════════════════════════════════════════════════════
   إصلاح 1: Typing Animation - إزالة المسافة المتبقية
   ═══════════════════════════════════════════════════════════ */
.typing-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;

  /* الـ cursor هو border-right */
  border-right: 3px solid var(--color-primaryBlue-500);

  /* 
     مهم جداً: box-sizing: border-box
     يخلي الـ width يشمل الـ border والـ padding
     لما width = 0، كل حاجة تختفي بما فيها الـ border
  */
  box-sizing: border-box;
  padding-right: 0;  /* شيلنا الـ padding عشان ما يفضلش حاجة */

  width: 0;

  animation:
    typing-loop 5s steps(16, end) 1s infinite,
    caret-blink 0.8s step-end infinite;
}

@keyframes typing-loop {
  0%, 10%  { width: 0; }
  35%, 60% { width: 100%; }
  95%, 100%{ width: 0; }
}

@keyframes caret-blink {
  from, to { border-color: var(--color-primaryBlue-500); }
  50%      { border-color: transparent; }
}

/* ═══════════════════════════════════════════════════════════
   Stage geometry
   ═══════════════════════════════════════════════════════════ */
.hero-stage {
  --u: 0.68px;
  --cap-x: 93;
  --cap-y: 367;
  --rect-w: 330;
  --rect-l: 330;
  --person-x: 40;

  position: relative;
  flex: none;
  width: calc(460 * var(--u));
  height: calc(600 * var(--u));
}

@media (min-width: 640px) {
  .hero-stage {
    --u: 0.85px;
  }
}

@media (min-width: 1024px) {
  .hero-stage {
    --u: 1px;
    --cap-x: 115;
    --cap-y: 377;
    --rect-w: 383;
    --rect-l: 1400;
    --person-x: 55;
    height: calc(640 * var(--u));
  }
}

.hero-shape {
  position: absolute;
  left: calc(var(--cap-x) * var(--u));
  top: calc(var(--cap-y) * var(--u));
  width: 0;
  height: 0;
}

.hero-shape-rect {
  position: absolute;
  left: 0;
  top: calc(var(--rect-w) * var(--u) / -2);
  width: calc(var(--rect-l) * var(--u));
  height: calc(var(--rect-w) * var(--u));
  border-radius: calc(95 * var(--u));
  background: var(--color-primaryBlue-500);
  transform-origin: 0 50%;
  transform: rotate(-45deg);
  animation: shape-wipe 1.3s 0.1s var(--ease-out-expo) both;
}

@keyframes shape-wipe {
  from {
    opacity: 0;
    clip-path: inset(0 100% 0 0);
  }
  to {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

.hero-dots-right {
  position: absolute;
  left: calc(525 * var(--u));
  top: calc(50 * var(--u));
  width: calc(72 * var(--u));
  z-index: 1;
}

/* ═══ إصلاح 2: إنزال الصورة لتقاطع آخر الشكل الأزرق ═══ */
.hero-person {
  position: absolute;
  bottom: calc(115 * var(--u));   /* ← سالب عشان تنزل تحت قاع الـ stage */
  left: calc(0 * var(--u));
  z-index: 2;
  width: calc(420 * var(--u));
  height: auto;
  max-width: none;
  opacity: 0;
  animation: hero-rise 1s 0.55s var(--ease-out-expo) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .hero-in,
  .hero-person,
  .hero-shape-rect,
  .typing-text {
    animation: none;
    opacity: 1;
    clip-path: none;
    width: 100%;
    border-color: var(--color-primaryBlue-500);
  }
}
</style>
