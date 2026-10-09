<script setup lang="ts">
import { computed, ref ,onMounted} from 'vue'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import CodeBlock from '@/components/project/CodeBlock.vue'
import TopologyDiagram from '@/components/project/TopologyDiagram.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import { vReveal } from '@/directives/reveal'
import { getNeighbours, getProject } from '@/data/portfolio'

const route = useRoute()
const project = computed(() => getProject(String(route.params.slug)))
const neighbours = computed(() => getNeighbours(String(route.params.slug)))

const isImageExpanded = ref(false)

function openImageLightbox() {
  isImageExpanded.value = true
  document.body.style.overflow = 'hidden' // منع السكرول
}

function closeImageLightbox() {
  isImageExpanded.value = false
  document.body.style.overflow = ''
}

// إغلاق بـ Escape
onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isImageExpanded.value) closeImageLightbox()
  })
})

const h2 = 'font-heading text-2xl font-bold tracking-[-0.01em] text-navy sm:text-3xl'
</script>

<template>
  <article v-if="project" class="bg-white">
    <!-- ───────── Header ───────── -->
    <header class="px-4 pb-10 pt-8 sm:px-10 sm:pt-12 lg:px-16">
      <div class="mx-auto max-w-7xl">
        <RouterLink
          :to="{ name: 'home', hash: '#projects' }"
          class="group inline-flex items-center gap-2 font-body text-base text-steel transition-colors hover:text-primaryBlue-600"
        >
          <AppIcon
            name="arrow-left"
            :size="18"
            class="transition-transform group-hover:-translate-x-1"
          />
          All projects
        </RouterLink>

        <div class="mt-8 flex flex-col gap-5">
          <div v-reveal class="flex flex-wrap items-center gap-3">
            <StatusBadge :status="project.status" />
            <p class="font-mono text-sm font-medium tracking-[0.7px] text-[#00296D]">
              {{ project.tagline }}
            </p>
          </div>
          <h1
            v-reveal="80"
            class="max-w-4xl font-heading text-[clamp(2.25rem,8vw,3.5rem)] font-bold leading-tight tracking-[-0.02em] text-navy"
          >
            {{ project.title }}
          </h1>
          <p
            v-reveal="160"
            class="max-w-3xl font-body text-lg leading-relaxed text-[#434652] sm:text-xl"
          >
            {{ project.summary }}
          </p>
        </div>
      </div>
    </header>

    <!-- ───────── Cover image ───────── -->
<div class="px-4 sm:px-10 lg:px-16">
  <div
    v-reveal="{ delay: 200, variant: 'scale' }"
    class="mx-auto max-w-7xl overflow-hidden rounded border border-border-light  shadow-[0_4px_12px_rgba(0,61,155,0.05)] cursor-zoom-in group"
    @click="openImageLightbox"
  >
    <img
      :src="project.image"
      :alt="project.imageAlt"
      class="w-full h-auto max-h-[500px] sm:max-h-[600px] object-contain transition-transform duration-500 group-hover:scale-[1.01]"
      decoding="async"
    />
    
    <!-- أيقونة التكبير -->
    <div class="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-mono text-steel shadow-sm">
      <AppIcon name="zoom-in" :size="14" />
      <span class="hidden sm:inline">Click to enlarge</span>
    </div>
  </div>
</div>

<!-- ───────── Lightbox Modal ───────── -->
<Teleport to="body">
  <Transition name="lightbox">
    <div
      v-if="isImageExpanded"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
      @click="closeImageLightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged project image"
    >
      <!-- زر الإغلاق -->
      <button
        class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
        @click.stop="closeImageLightbox"
        aria-label="Close image"
      >
        <AppIcon name="close" :size="20" />
      </button>
      
      <!-- الصورة المكبرة -->
      <img
        :src="project.image"
        :alt="project.imageAlt"
        class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        @click.stop
      />
      
      <!-- Caption -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white font-mono">
        {{ project.imageAlt }}
      </div>
    </div>
  </Transition>
</Teleport>

    <!-- ───────── Body ───────── -->
    <div class="px-4 py-14 sm:px-10 sm:py-20 lg:px-16">
      <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
        <div class="flex min-w-0 flex-col gap-14 sm:gap-16 lg:col-span-8">
          <section aria-labelledby="overview">
            <h2 id="overview" v-reveal :class="h2">Overview</h2>
            <div
              v-reveal="{ variant: 'bar', delay: 150 }"
              class="mt-3 h-1 w-12 bg-primaryBlue-600"
            ></div>
            <p v-reveal="100" class="mt-5 font-body text-lg leading-relaxed text-ink">
              {{ project.overview }}
            </p>
          </section>

          <section aria-labelledby="challenge">
            <h2 id="challenge" v-reveal :class="h2">The challenge</h2>
            <div
              v-reveal="{ variant: 'bar', delay: 150 }"
              class="mt-3 h-1 w-12 bg-primaryBlue-600"
            ></div>
            <p v-reveal="100" class="mt-5 font-body text-lg leading-relaxed text-ink">
              {{ project.challenge }}
            </p>
          </section>

          <section aria-labelledby="approach">
            <h2 id="approach" v-reveal :class="h2">How it was built</h2>
            <div
              v-reveal="{ variant: 'bar', delay: 150 }"
              class="mt-3 h-1 w-12 bg-primaryBlue-600"
            ></div>
            <!-- A real sequence, so numbering is meaningful here. -->
            <ol class="mt-8 flex flex-col">
              <li
                v-for="(step, i) in project.approach"
                :key="step.title"
                v-reveal="i * 90"
                class="relative flex gap-5 pb-8 last:pb-0"
              >
                <span
                  v-if="i < project.approach.length - 1"
                  class="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-border"
                  aria-hidden="true"
                ></span>
                <span
                  class="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primaryBlue-500 bg-primaryBlue-50 font-mono text-sm font-medium text-primaryBlue-500"
                >
                  {{ i + 1 }}
                </span>
                <div class="pt-1.5">
                  <h3 class="font-body text-xl font-semibold text-navy">{{ step.title }}</h3>
                  <p class="mt-1.5 font-body text-base leading-relaxed text-[#434652]">
                    {{ step.text }}
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <section aria-labelledby="architecture">
            <h2 id="architecture" v-reveal :class="h2">Architecture</h2>
            <div
              v-reveal="{ variant: 'bar', delay: 150 }"
              class="mt-3 h-1 w-12 bg-primaryBlue-600"
            ></div>
            <div class="mt-6">
              <TopologyDiagram
                :title="`${project.title} — network topology`"
                :caption="project.topology.caption"
                :nodes="project.topology.nodes"
                :links="project.topology.links"
              />
            </div>
          </section>

          <section aria-labelledby="config">
            <h2 id="config" v-reveal :class="h2">Sample configuration</h2>
            <div
              v-reveal="{ variant: 'bar', delay: 150 }"
              class="mt-3 h-1 w-12 bg-primaryBlue-600"
            ></div>
            <div v-reveal="100" class="mt-6">
              <CodeBlock
                :filename="project.config.filename"
                :language="project.config.language"
                :code="project.config.code"
                :note="project.config.note"
              />
            </div>
          </section>

          <section aria-labelledby="outcomes">
            <h2 id="outcomes" v-reveal :class="h2">Outcomes</h2>
            <div
              v-reveal="{ variant: 'bar', delay: 150 }"
              class="mt-3 h-1 w-12 bg-primaryBlue-600"
            ></div>
            <ul class="mt-6 grid gap-4">
              <li
                v-for="(outcome, i) in project.outcomes"
                :key="outcome"
                v-reveal="i * 90"
                class="flex items-start gap-4 rounded border border-border-light bg-[#F8FAFF] p-4"
              >
                <span
                  class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primaryBlue-500 text-white"
                >
                  <AppIcon name="check" :size="16" />
                </span>
                <span class="font-body text-base leading-relaxed text-ink">{{ outcome }}</span>
              </li>
            </ul>
          </section>
        </div>

        <!-- ───────── Sidebar ───────── -->
        <aside class="lg:col-span-4">
          <div class="flex flex-col gap-6 lg:sticky lg:top-28">
            <div
              v-reveal
              class="rounded border border-border-light bg-white p-6 shadow-[0_4px_12px_rgba(0,61,155,0.05)]"
            >
              <h2 class="font-heading text-xl font-bold text-navy">Project facts</h2>
              <dl class="mt-5 flex flex-col gap-5">
                <div>
                  <dt class="font-mono text-xs font-medium tracking-[0.6px] text-steel">Status</dt>
                  <dd class="mt-1.5"><StatusBadge :status="project.status" /></dd>
                </div>
                <div>
                  <dt class="font-mono text-xs font-medium tracking-[0.6px] text-steel">My role</dt>
                  <dd class="mt-1.5 font-body text-base text-ink">{{ project.role }}</dd>
                </div>
                <div v-for="group in project.stack" :key="group.group">
                  <dt class="font-mono text-xs font-medium tracking-[0.6px] text-steel">
                    {{ group.group }}
                  </dt>
                  <dd class="mt-1.5 flex flex-wrap gap-2">
                    <span
                      v-for="item in group.items"
                      :key="item"
                      class="rounded-sm border border-border bg-[#E5EEFF] px-2 py-1 font-body text-xs text-[#434652]"
                    >
                      {{ item }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div v-reveal="120" class="rounded bg-primaryBlue-500 p-6 text-white">
              <h2 class="font-heading text-xl font-bold">Need something similar?</h2>
              <p class="mt-2 font-body text-base leading-relaxed text-[#B1C6F9]">
                Tell me about your network and I'll get back to you with the next steps.
              </p>
              <RouterLink
                :to="{ name: 'home', hash: '#contact' }"
                class="mt-5 inline-flex items-center gap-2 rounded-xl border border-primaryBlue-50 bg-primaryBlue-50 px-5 py-2.5 font-body text-base font-medium text-primaryBlue-500 transition-colors hover:bg-white"
              >
                Contact Me
                <AppIcon name="arrow-right" :size="18" />
              </RouterLink>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- ───────── Previous / next ───────── -->
    <nav v-if="neighbours" class="px-4 pb-6 sm:px-10 lg:px-16" aria-label="More projects">
      <div class="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2">
        <RouterLink
          :to="{ name: 'project', params: { slug: neighbours.prev.slug } }"
          class="motion-lift group flex flex-col gap-1 rounded border border-border-light bg-white p-5"
        >
          <span class="inline-flex items-center gap-2 font-mono text-xs text-steel">
            <AppIcon name="arrow-left" :size="14" /> Previous project
          </span>
          <span
            class="font-body text-lg font-semibold text-navy group-hover:text-primaryBlue-600"
            >{{ neighbours.prev.title }}</span
          >
        </RouterLink>
        <RouterLink
          :to="{ name: 'project', params: { slug: neighbours.next.slug } }"
          class="motion-lift group flex flex-col items-end gap-1 rounded border border-border-light bg-white p-5 text-right"
        >
          <span class="inline-flex items-center gap-2 font-mono text-xs text-steel">
            Next project <AppIcon name="arrow-right" :size="14" />
          </span>
          <span
            class="font-body text-lg font-semibold text-navy group-hover:text-primaryBlue-600"
            >{{ neighbours.next.title }}</span
          >
        </RouterLink>
      </div>
    </nav>

    <CtaBanner />
  </article>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.lightbox-enter-active img {
  transition: transform 0.3s ease;
  transform: scale(0.95);
}

.lightbox-enter-to img {
  transform: scale(1);
}
</style>