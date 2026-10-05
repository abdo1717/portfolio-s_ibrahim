<script setup lang="ts">
import { ref } from 'vue'
import { useCountUp } from '@/composables/useCountUp'

const props = withDefaults(
  defineProps<{ to: number; decimals?: number; suffix?: string; label: string }>(),
  {
    decimals: 0,
    suffix: '',
  },
)

const root = ref<HTMLElement | null>(null)
const { display } = useCountUp(root, { to: props.to, decimals: props.decimals })
</script>

<template>
  <div ref="root" class="flex flex-col gap-1 border-l-2 border-primaryBlue-500 pl-4">
    <!-- aria-label gives screen readers the final value instead of a number that is still counting -->
    <span
      class="font-heading text-3xl font-semibold leading-tight tabular-nums text-ink"
      :aria-label="`${to.toFixed(decimals)}${suffix}`"
    >
      <span aria-hidden="true">{{ display }}{{ suffix }}</span>
    </span>
    <span class="font-mono text-xs font-medium tracking-[0.6px] text-muted">{{ label }}</span>
  </div>
</template>
