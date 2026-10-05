<script setup lang="ts">
import { statusColors, type ProjectStatus } from '@/data/portfolio'

defineProps<{ status: ProjectStatus }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-sm border border-border bg-white/90 px-2 py-1 font-mono text-xs text-navy"
  >
    <span
      class="h-2 w-2 rounded-full"
      :style="{ background: statusColors[status] }"
      aria-hidden="true"
    ></span>
    {{ status }}
  </span>
</template>
