<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps<{ filename: string; language: string; code: string; note?: string }>()

const copied = ref(false)
const failed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  failed.value = false
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
  } catch {
    // Clipboard API blocked (insecure context / permissions) → tell the user instead of failing silently.
    failed.value = true
  }
  clearTimeout(timer)
  timer = setTimeout(() => {
    copied.value = false
    failed.value = false
  }, 2000)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <figure class="overflow-hidden rounded border border-[#1B2B44] bg-navy text-[#D6E3FF]">
    <figcaption
      class="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5"
    >
      <span class="flex min-w-0 items-center gap-3 font-mono text-xs">
        <span class="truncate text-white">{{ filename }}</span>
        <span class="shrink-0 rounded-sm bg-white/10 px-1.5 py-0.5 text-[#B1C6F9]">{{
          language
        }}</span>
      </span>
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-1.5 rounded px-2 py-1 font-mono text-xs text-[#B1C6F9] transition-colors hover:bg-white/10 hover:text-white"
        @click="copy"
      >
        <AppIcon :name="copied ? 'check' : 'copy'" :size="14" />
        <span aria-live="polite">{{ failed ? 'Copy failed' : copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </figcaption>
    <!-- tabindex: keyboard users must be able to scroll long lines -->
    <pre
      class="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed"
      tabindex="0"
      :aria-label="`${language} sample: ${filename}`"
    ><code>{{ code }}</code></pre>
    <p v-if="note" class="border-t border-white/10 px-4 py-2.5 font-body text-xs text-[#93A9D6]">
      {{ note }}
    </p>
  </figure>
</template>
