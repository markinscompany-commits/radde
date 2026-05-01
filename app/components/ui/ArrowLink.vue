<template>
  <a :href="href"
     class="inline-flex items-center gap-2 font-body font-600 transition-colors"
     :class="[sizeClass, colorClass]">
    <slot />
    <svg :width="iconPx" :height="iconPx" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  href: string
  size?: 'sm' | 'md'
  variant?: 'amber' | 'sand'
}>(), {
  size: 'md',
  variant: 'amber',
})

const sizeClass = computed(() => props.size === 'sm' ? 'text-4' : 'text-4')
const iconPx = computed(() => props.size === 'sm' ? 14 : 16)
const colorClass = computed(() =>
  props.variant === 'amber'
    ? 'text-amber-600 hover:text-amber-700'
    : 'text-sand-700 hover:text-sand-900'
)
</script>
