<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
</script>

<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-24 text-center">
    <p class="font-mono text-sm font-medium tracking-[0.6px] text-steel">Error 404</p>
    <h1 class="font-heading text-4xl font-extrabold text-ink">Page not found</h1>
    <p class="max-w-md font-body text-lg text-muted">
      The page you are looking for does not exist or may have been moved. Head back to the homepage
      to keep exploring.
    </p>
    <RouterLink
      :to="{ name: 'home' }"
      class="mt-4 inline-flex items-center gap-3 rounded-xl border border-primaryBlue-50 bg-primaryBlue-500 px-6 py-3 font-body text-lg text-primaryBlue-50 transition-colors hover:bg-primaryBlue-600"
    >
      <AppIcon name="arrow-left" :size="20" />
      Back to Home
    </RouterLink>
  </div>
</template>
