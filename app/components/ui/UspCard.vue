<template>
  <div class="usp-card group relative rounded-3 overflow-hidden cursor-default"
       :class="wide ? 'usp-wide' : 'usp-narrow'">
    <UiPicture :src="image" :alt="title"
         sizes="(min-width: 768px) 50vw, 100vw"
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
/* В мозаичной раскладке (md+) делаем карточки чуть площе — −10% высоты:
   было 4/3 (h = w * 0.75), теперь 4/2.7 (h = w * 0.675) */
@media (min-width: 768px) {
  .usp-wide {
    aspect-ratio: 4 / 2.7;
  }
  .usp-narrow {
    aspect-ratio: auto;
  }
}
</style>
