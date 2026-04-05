<template>
  <div class="py-8 md:py-12 flex justify-center" :class="bgClass">
    <svg width="240" height="32" viewBox="0 0 240 32" fill="none" xmlns="http://www.w3.org/2000/svg"
         :class="svgClass" class="opacity-60">
      <!-- Caucasian mountain ornament pattern -->
      <path d="M0 16h40" stroke="currentColor" stroke-width="1"/>
      <path d="M200 16h40" stroke="currentColor" stroke-width="1"/>
      <!-- Left diamond -->
      <path d="M52 16l8-8 8 8-8 8z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M56 16l4-4 4 4-4 4z" fill="currentColor" opacity="0.3"/>
      <!-- Center ornament (mountain peaks) -->
      <path d="M88 20l12-14 8 10 12-16 12 16 8-10 12 14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
      <circle cx="120" cy="6" r="2" fill="currentColor" opacity="0.4"/>
      <!-- Right diamond -->
      <path d="M172 16l8-8 8 8-8 8z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M176 16l4-4 4 4-4 4z" fill="currentColor" opacity="0.3"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  dark?: boolean
  variant?: 'light' | 'medium' | 'dark'
}>()

const bgClass = computed(() => {
  const v = props.variant ?? (props.dark ? 'dark' : 'light')
  return v === 'dark' ? 'bg-sand-900' : v === 'medium' ? 'bg-sand-100' : 'bg-sand-50'
})

const svgClass = computed(() => {
  const v = props.variant ?? (props.dark ? 'dark' : 'light')
  return v === 'dark' ? 'text-sand-700' : 'text-sand-300'
})
</script>
