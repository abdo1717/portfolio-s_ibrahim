<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { profile } from '@/data/portfolio'

const links = [
  { label: 'Home', section: 'home' },
  { label: 'About', section: 'about' },
  { label: 'Skills', section: 'skills' },
  { label: 'Projects', section: 'projects' },
  { label: 'Contact', section: 'contact' },
] as const

const route = useRoute()
const mobileOpen = ref(false)
const window = globalThis.window
const { active, refresh } = useScrollSpy(links.map((l) => l.section))

/** On the case-study page "Projects" stays highlighted; on the home page the scroll position decides. */
const current = computed(() => {
  if (route.name === 'project') return 'projects'
  if (route.name === 'home') return active.value
  return ''
})

// The home sections appear after the page transition — re-check once they exist.
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
    setTimeout(refresh, 400)
  }
)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') mobileOpen.value = false
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 border-b border-black/[0.08] bg-[#FDFDFD]/95 px-4 py-3 shadow-[0_4px_20px_0_rgba(0,0,0,0.10)] backdrop-blur sm:gap-4 sm:px-6 sm:py-4 lg:px-16"
    @keydown="onKeydown"
  >
    <RouterLink
      :to="{ name: 'home', hash: '#home' }"
      class="shrink-0 font-heading text-4xl font-bold leading-none tracking-[-0.06em]"
      aria-label="Ibrahim Zaki — home"
    >
      <span class="text-[#4E7CC3]">i</span><span class="text-[#00255D]">z</span>
    </RouterLink>

    <nav class="hidden flex-1 items-center justify-center gap-10 lg:flex" aria-label="Primary">
      <RouterLink
        v-for="link in links"
        :key="link.section"
        :to="{ name: 'home', hash: `#${link.section}` }"
        class="group relative py-1 font-body text-lg text-muted transition-colors hover:text-primaryBlue-600"
        :class="{ 'font-bold text-primaryBlue-600': current === link.section }"
        :aria-current="current === link.section ? 'true' : undefined"
      >
        <!-- Invisible bold copy reserves the width, so the bold state never shifts the layout. -->
        <span
          class="inline-block before:invisible before:block before:h-0 before:font-bold before:content-[attr(data-label)]"
          :data-label="link.label"
        >
          {{ link.label }}
        </span>
        <span
          class="absolute -bottom-1 left-0 h-1 w-full origin-center bg-primaryBlue-600 transition-transform duration-300"
          :class="current === link.section ? 'scale-x-100' : 'scale-x-0'"
          aria-hidden="true"
        ></span>
      </RouterLink>
    </nav>

    <a
      :href="`${window.location.origin}${profile.cvUrl}`"
      target="_blank"
      rel="noopener noreferrer"
      class="ml-auto hidden shrink-0 items-center gap-2 rounded-xl border border-primaryBlue-50 bg-primaryBlue-500 px-5 py-2.5 font-body text-lg text-primaryBlue-50 transition hover:bg-primaryBlue-600 lg:inline-flex"
    >
      Download CV
    </a>

    <button
      type="button"
      class="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-primaryBlue-600 lg:hidden"
      :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
      :aria-expanded="mobileOpen"
      aria-controls="mobile-menu"
      @click="mobileOpen = !mobileOpen"
    >
      <AppIcon :name="mobileOpen ? 'close' : 'menu'" :size="24" />
    </button>

    <Transition name="page">
      <div
        v-if="mobileOpen"
        id="mobile-menu"
        class="absolute left-0 top-full flex w-full flex-col gap-1 border-b border-black/[0.08] bg-[#FDFDFD] p-4 shadow-lg sm:p-6 lg:hidden"
      >
        <RouterLink
          v-for="link in links"
          :key="link.section"
          :to="{ name: 'home', hash: `#${link.section}` }"
          class="rounded-lg px-2 py-2.5 font-body text-lg text-muted hover:bg-primaryBlue-50 hover:text-primaryBlue-600"
          :class="{ 'bg-primaryBlue-50 font-bold text-primaryBlue-600': current === link.section }"
          :aria-current="current === link.section ? 'true' : undefined"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </RouterLink>
        <a
          :href="`${window.location.origin}${profile.cvUrl}`"
          target="_blank"
          rel="noopener noreferrer"
          @click="mobileOpen = false"
          class="mt-2 inline-flex items-center justify-center gap-3 rounded-xl border border-primaryBlue-50 bg-primaryBlue-500 px-5 py-2.5 font-body text-lg text-primaryBlue-50"
        >
          Download CV
        </a>
      </div>
    </Transition>
  </header>
</template>
