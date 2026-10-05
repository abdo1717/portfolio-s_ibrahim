<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primaryBlue-500 focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to content
    </a>
    
    <NavBar />
    
    <!-- ═══ التعديل هنا: أضفنا pt-24 لتعويض ارتفاع الـ Navbar الثابت ═══ -->
    <main id="main" class="flex-1 pt-20">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    
    <AppFooter />
  </div>
</template>