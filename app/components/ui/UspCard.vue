<template>
  <div class="usp-card group relative rounded-3 overflow-hidden cursor-default"
       :class="wide ? 'usp-wide' : 'usp-narrow'">
    <img :src="image" :alt="title"
         class="absolute inset-0 w-full h-full object-cover"
         loading="lazy" />
    <div class="absolute inset-0 bg-gradient-to-t from-sand-900/80 via-sand-900/30 to-transparent"></div>
    <div class="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
      <h3 class="font-display font-500 text-5 md:text-6 text-white mb-2 leading-tight">{{ title }}</h3>
      <p class="font-body text-4 text-white/85 leading-relaxed max-w-80">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  image: string
  title: string
  description: string
  wide?: boolean
}>(), {
  wide: false,
})
</script>

<style scoped>
.usp-card {
  aspect-ratio: 4 / 3;
}
@media (min-width: 768px) {
  .usp-wide {
    aspect-ratio: 4 / 3;
  }
  .usp-narrow {
    aspect-ratio: auto;
  }
}
</style>
