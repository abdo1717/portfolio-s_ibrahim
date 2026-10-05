<script setup lang="ts">
import { computed, useId } from 'vue'
import { vReveal } from '@/directives/reveal'
import type { NodeKind, TopologyLink, TopologyNode } from '@/data/portfolio'

const props = defineProps<{
  title: string
  caption: string
  nodes: TopologyNode[]
  links: TopologyLink[]
}>()

const NODE_W = 132
const NODE_H = 54
const uid = useId()

const byId = computed(() => new Map(props.nodes.map((n) => [n.id, n])))

const lines = computed(() =>
  props.links.flatMap((l, i) => {
    const a = byId.value.get(l.from)
    const b = byId.value.get(l.to)
    if (!a || !b) return [] // unknown ids are ignored (covered by a data test)
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    const w = l.label ? l.label.length * 6.4 + 14 : 0
    return [
      { key: `${l.from}-${l.to}-${i}`, i, x1: a.x, y1: a.y, x2: b.x, y2: b.y, mx, my, w, ...l },
    ]
  }),
)

/** Text alternative: the picture is a list of connections, so we say exactly that. */
const description = computed(() =>
  props.links
    .map((l) => {
      const a = byId.value.get(l.from)?.label
      const b = byId.value.get(l.to)?.label
      return a && b ? `${a} to ${b}${l.label ? ` (${l.label})` : ''}` : ''
    })
    .filter(Boolean)
    .join('; '),
)

const kindStyle: Record<
  NodeKind,
  { fill: string; stroke: string; text: string; sub: string; dash?: string }
> = {
  router: { fill: '#FFFFFF', stroke: '#003D9B', text: '#0B1C30', sub: '#495E8A' },
  switch: { fill: '#E6F0FF', stroke: '#003D9B', text: '#0B1C30', sub: '#495E8A' },
  firewall: { fill: '#003D9B', stroke: '#001A45', text: '#FFFFFF', sub: '#B1C6F9' },
  cloud: { fill: '#F3F7FF', stroke: '#003D9B', text: '#0B1C30', sub: '#495E8A', dash: '5 4' },
  site: { fill: '#F8FAFF', stroke: '#8E93A8', text: '#0B1C30', sub: '#495E8A' },
}
</script>

<template>
  <figure v-reveal class="topo overflow-hidden rounded border border-border-light bg-white">
    <div class="overflow-x-auto p-4 sm:p-6">
      <svg
        viewBox="0 0 640 340"
        class="mx-auto h-auto w-full min-w-[520px] max-w-[720px]"
        role="img"
        :aria-labelledby="`${uid}-t ${uid}-d`"
      >
        <title :id="`${uid}-t`">{{ title }}</title>
        <desc :id="`${uid}-d`">{{ description }}</desc>

        <g fill="none" stroke="#003D9B" stroke-width="2" stroke-linecap="round">
          <line
            v-for="l in lines"
            :key="l.key"
            :x1="l.x1"
            :y1="l.y1"
            :x2="l.x2"
            :y2="l.y2"
            pathLength="1"
            :class="l.dashed ? 'link-dashed' : 'link-solid'"
            :stroke-dasharray="l.dashed ? '6 6' : undefined"
            :style="{ '--i': l.i }"
          />
        </g>

        <g
          v-for="l in lines.filter((x) => x.label)"
          :key="`${l.key}-label`"
          class="node"
          :style="{ '--n': 8 }"
        >
          <rect
            :x="l.mx - l.w / 2"
            :y="l.my - 9"
            :width="l.w"
            height="18"
            rx="9"
            fill="#FFFFFF"
            stroke="#C4C6D4"
          />
          <text
            :x="l.mx"
            :y="l.my + 3.5"
            text-anchor="middle"
            font-size="10"
            fill="#434654"
            font-family="'JetBrains Mono Variable', ui-monospace, monospace"
          >
            {{ l.label }}
          </text>
        </g>

        <g v-for="(n, idx) in nodes" :key="n.id" class="node" :style="{ '--n': idx }">
          <rect
            :x="n.x - NODE_W / 2"
            :y="n.y - NODE_H / 2"
            :width="NODE_W"
            :height="NODE_H"
            rx="8"
            :fill="kindStyle[n.kind].fill"
            :stroke="kindStyle[n.kind].stroke"
            stroke-width="1.5"
            :stroke-dasharray="kindStyle[n.kind].dash"
          />
          <text
            :x="n.x"
            :y="n.sub ? n.y - 3 : n.y + 5"
            text-anchor="middle"
            font-size="13.5"
            font-weight="600"
            :fill="kindStyle[n.kind].text"
            font-family="'Inter Variable', system-ui, sans-serif"
          >
            {{ n.label }}
          </text>
          <text
            v-if="n.sub"
            :x="n.x"
            :y="n.y + 13"
            text-anchor="middle"
            font-size="10"
            :fill="kindStyle[n.kind].sub"
            font-family="'JetBrains Mono Variable', ui-monospace, monospace"
          >
            {{ n.sub }}
          </text>
        </g>
      </svg>
    </div>
    <figcaption
      class="border-t border-border-light bg-[#F8FAFF] px-4 py-3 font-body text-sm text-muted sm:px-6"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
/* Nodes fade in one after another, then the links draw themselves. */
.node {
  opacity: 0;
  transition: opacity 0.5s ease calc(var(--n, 0) * 80ms + 150ms);
}
.link-solid {
  stroke-dashoffset: 1;
  stroke-dasharray: 1;
  transition: stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--i, 0) * 90ms + 300ms);
}
.link-dashed {
  opacity: 0;
  transition: opacity 0.7s ease calc(var(--i, 0) * 90ms + 300ms);
}
.is-visible .node,
.is-visible .link-dashed {
  opacity: 1;
}
.is-visible .link-solid {
  stroke-dashoffset: 0;
}

@media (prefers-reduced-motion: reduce) {
  .node,
  .link-solid,
  .link-dashed {
    transition: none;
  }
}
</style>
