<template>
  <div class="tip-card">
    <div class="w-9 h-9 rounded-2 bg-olive-100 flex items-center justify-center text-olive-600 mb-3 flex-shrink-0" v-html="icon"></div>
    <h5 class="text-body font-600 text-sand-800 mb-1">{{ title }}</h5>
    <p class="text-small text-sand-700 leading-relaxed">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  text: string
}>()
</script>

<style scoped>
.tip-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 14px;
  padding: 16px;
}
@media (min-width: 640px) {
  .tip-card {
    padding: 20px;
  }
}
</style>
