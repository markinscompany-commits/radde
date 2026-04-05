<template>
  <section class="py-24 md:py-32 bg-sand-100">
    <div class="container">
      <div class="text-center mb-16">
        <span class="text-label text-olive-600 mb-4 block" data-gsap>Почему выбирают нас</span>
        <h2 ref="titleRef" class="text-h2 font-500 text-sand-900" data-gsap>
          Что вас ждёт в <span class="section-title-accent">Радде</span>
        </h2>
      </div>

      <div ref="gridRef" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div v-for="(item, i) in usps" :key="i"
             class="group relative aspect-4/3 rounded-3 overflow-hidden cursor-default"
             data-gsap>
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
            <p class="font-body text-3.5 text-white/70 leading-relaxed max-w-80">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const titleRef = ref<HTMLElement>()
const gridRef = ref<HTMLElement>()

const usps = [
  {
    title: 'Гастрономия',
    description: 'Вкусные завтраки, обеды и ужины из местных продуктов. Домашняя кухня горного Дагестана.',
    image: '/images/usp/food/1.jpg',
  },
  {
    title: 'Эмоциональная перезагрузка',
    description: 'Расположены в заповедном парке — далеко от городской суеты. Тишина и чистый горный воздух.',
    image: '/images/usp/nature/1.jpg',
  },
  {
    title: 'Точки притяжения',
    description: 'Природные и исторические памятники в шаговой доступности. Гунибская крепость, водопады, каньоны.',
    image: '/images/usp/landmarks/1.jpg',
  },
  {
    title: 'Современная инфраструктура',
    description: 'Барбекю-зоны, детская площадка, смотровые площадки с видом на горы.',
    image: '/images/usp/bbq/1.jpg',
  },
]

onMounted(() => {
  if (!import.meta.client) return
  const { revealUp, staggerReveal } = useGsap()

  if (titleRef.value) revealUp(titleRef.value)

  const cards = gridRef.value?.querySelectorAll('[data-gsap]')
  if (cards?.length) {
    staggerReveal(Array.from(cards) as HTMLElement[], {
      scrollTrigger: { trigger: gridRef.value, start: 'top 80%' },
    })
  }
})
</script>
