<script setup lang="ts">
import { computed } from 'vue'

/**
 * Decorative dot matrix from the design (replaces the two "Frame 27" images).
 * Dots pop in as a diagonal wave — `delay` is the start time in ms.
 * Colour comes from CSS `color` (blue on white, white on the blue shape).
 */
const props = withDefaults(
  defineProps<{ cols: number; rows: number; gap?: number; radius?: number; delay?: number }>(),
  { gap: 16, radius: 3.5, delay: 0 },
)

const width = computed(() => (props.cols - 1) * props.gap + props.radius * 2)
const height = computed(() => (props.rows - 1) * props.gap + props.radius * 2)
const dots = computed(() =>
  Array.from({ length: props.cols * props.rows }, (_, i) => {
    const row = Math.floor(i / props.cols)
    const col = i % props.cols
    return {
      key: i,
      cx: col * props.gap + props.radius,
      cy: row * props.gap + props.radius,
      order: row + col,
    }
  }),
)
</script>

<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    class="dot-grid block h-auto w-full"
    :style="{ '--base': `${delay}ms` }"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      v-for="d in dots"
      :key="d.key"
      class="dot"
      :cx="d.cx"
      :cy="d.cy"
      :r="radius"
      fill="currentColor"
      :style="{ '--i': d.order }"
    />
  </svg>
</template>

<style scoped>
.dot {
  opacity: 0;
  transform: scale(0.3);
  transform-box: fill-box;
  transform-origin: center;
  animation: dot-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--base, 0ms) + var(--i) * 28ms);
}

@keyframes dot-in {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dot {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
