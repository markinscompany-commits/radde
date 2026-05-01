<template>
  <div class="bg-white rounded-2.5 border border-sand-200 overflow-hidden shadow-sm">
    <button @click="$emit('toggle')"
            class="w-full flex items-center justify-between p-5 md:p-6 text-left bg-transparent border-none cursor-pointer transition-colors hover:bg-sand-50/50">
      <span class="text-body font-600 text-sand-900 pr-4 leading-snug">{{ question }}</span>
      <div class="w-7 h-7 rounded-full bg-sand-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300"
           :class="open ? 'rotate-180' : ''">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5l4 4 4-4" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </button>
    <div class="faq-body" :class="open ? 'faq-open' : ''">
      <div class="px-5 md:px-6 pb-5 md:pb-6">
        <p class="text-body text-sand-700">{{ answer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  question: string
  answer: string
  open: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.faq-open {
  max-height: 300px;
}
</style>
