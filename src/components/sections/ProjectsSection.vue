<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { vReveal } from '@/directives/reveal'
import { projects } from '@/data/portfolio'
</script>

<template>
  <section id="projects" class="bg-white px-4 py-16 sm:px-10 sm:py-20 lg:px-16">
    <div class="mx-auto flex max-w-7xl flex-col gap-12 sm:gap-20">
      <div class="flex flex-col items-center gap-4 text-center">
        <h2
          v-reveal
          class="font-heading text-4xl font-bold tracking-[-0.02em] text-navy lg:text-[48px]"
        >
          My <span class="text-primaryBlue-500">Projects</span>
        </h2>
        <p
          v-reveal="120"
          class="max-w-3xl font-body text-lg font-medium leading-relaxed text-[#434652] sm:text-2xl sm:leading-tight"
        >
          Showcasing key projects in network infrastructure design, implementation, and security,
          with a focus on high performance and reliability.
        </p>
      </div>

      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="(project, i) in projects" :key="project.slug" v-reveal="i * 120">
          <article
            class="motion-lift flex h-full flex-col overflow-hidden rounded-[5px] border border-border-light bg-white"
          >
            <div class="relative h-48 overflow-hidden border-b border-border bg-primaryBlue-50">
              <img
                :src="project.image"
                :alt="project.imageAlt"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
              />
              <StatusBadge :status="project.status" class="absolute left-4 top-4" />
            </div>

            <div class="flex flex-1 flex-col p-4">
              <p
                class="break-words pb-2 font-mono text-xs font-medium leading-relaxed tracking-[0.5px] text-[#00296D] sm:text-sm sm:tracking-[0.7px]"
              >
                {{ project.tagline }}
              </p>
              <h3 class="pb-3 font-body text-xl font-semibold leading-snug text-navy sm:text-2xl">
                {{ project.title }}
              </h3>
              <p class="flex-1 pb-6 font-body text-base leading-relaxed text-[#434652]">
                {{ project.summary }}
              </p>

              <ul
                class="mb-6 flex flex-wrap gap-2 border-t border-[#F1F5F9] pt-4"
                aria-label="Technologies"
              >
                <li
                  v-for="tag in project.tags"
                  :key="tag"
                  class="rounded-sm border border-border bg-[#E5EEFF] px-2 py-1 font-body text-xs text-[#434652]"
                >
                  {{ tag }}
                </li>
              </ul>

              <RouterLink
                :to="{ name: 'project', params: { slug: project.slug } }"
                class="group flex items-center justify-center gap-2 rounded-md bg-primaryBlue-500 px-4 py-2 font-body text-base font-semibold text-white transition-colors hover:bg-primaryBlue-600"
                :aria-label="`View case study: ${project.title}`"
              >
                View Case Study
                <AppIcon
                  name="arrow-right"
                  :size="16"
                  class="transition-transform group-hover:translate-x-1"
                />
              </RouterLink>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>
