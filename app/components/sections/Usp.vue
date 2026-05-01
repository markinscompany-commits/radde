<template>
  <section class="py-20 md:py-26 bg-sand-100">
    <div class="container">
      <div class="text-center mb-16">
        <span class="text-label text-olive-600 mb-4 block">Почему выбирают нас</span>
        <h2 ref="titleRef" class="text-h2 font-500 text-sand-900">
          Что вас ждёт в <span class="section-title-accent">Радде</span>
        </h2>
      </div>

      <div ref="gridRef" class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div v-for="(item, i) in usps" :key="i"
             class="usp-card group relative rounded-3 overflow-hidden cursor-default"
             :class="[
               (i === 0 || i === 3) ? 'md:col-span-7 usp-wide' : 'md:col-span-5 usp-narrow',
             ]">
          <!-- Background photo -->
          <img :src="item.image" :alt="item.title"
               class="absolute inset-0 w-full h-full object-cover"
               loading="lazy" />
          <!-- Dark overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-sand-900/80 via-sand-900/30 to-transparent"></div>
          <!-- Content -->
          <div class="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
            <h3 class="font-display font-500 text-5 md:text-6 text-white mb-2 leading-tight">
              {{ item.title }}
            </h3>
            <p class="font-body text-4 text-white/85 leading-relaxed max-w-80">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'

const titleRef = ref<HTMLElement>()
const gridRef = ref<HTMLElement>()

const usps = [
  {
    title: 'Гастрономия',
    description: 'Вкусные завтраки, обеды и ужины из местных продуктов. Домашняя кухня горного Дагестана.',
    image: `${base}images/usp/food/1.jpg`,
  },
  {
    title: 'Эмоциональная перезагрузка',
    description: 'Расположены в заповедном парке — далеко от городской суеты. Тишина и чистый горный воздух.',
    image: `${base}images/usp/nature/1.jpg`,
  },
  {
    title: 'Точки притяжения',
    description: 'Природные и исторические памятники в шаговой доступности. Гунибская крепость, водопады, каньоны.',
    image: `${base}images/usp/landmarks/1.jpg`,
  },
  {
    title: 'Современная инфраструктура',
    description: 'Барбекю-зоны, детская площадка, смотровые площадки с видом на горы.',
    image: `${base}images/usp/bbq/1.jpg`,
  },
]

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
