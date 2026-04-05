<template>
  <section id="activities" class="py-24 md:py-32 bg-sand-100">
    <div class="container">
      <div class="text-center mb-16">
        <span class="text-label text-olive-600 mb-4 block">Чем заняться</span>
        <h2 ref="titleRef" class="text-h2 font-500 text-sand-900">
          Активности <span class="section-title-accent">и впечатления</span>
        </h2>
      </div>

      <div ref="gridRef" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div v-for="(item, i) in activities" :key="i"
             class="group relative aspect-3/2 rounded-3 overflow-hidden cursor-default">
          <img :src="item.image" :alt="item.title"
               class="absolute inset-0 w-full h-full object-cover"
               loading="lazy" />
          <div class="absolute inset-0 bg-gradient-to-t from-sand-900/80 via-sand-900/20 to-transparent"></div>
          <div class="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
            <h3 class="font-display font-500 text-5 md:text-6 text-white mb-2">{{ item.title }}</h3>
            <p class="font-body text-3.5 text-white/70 max-w-90">{{ item.description }}</p>
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

const activities = [
  {
    title: 'Горные прогулки',
    description: 'Пешие маршруты по реликтовому лесу и горным тропам с панорамными видами.',
    image: `${base}images/usp/nature/1.jpg`,
  },
  {
    title: 'Конные прогулки',
    description: 'Верховая езда по горным маршрутам с опытными инструкторами.',
    image: `${base}images/usp/landmarks/1.jpg`,
  },
  {
    title: 'Достопримечательности',
    description: 'Гунибская крепость, водопады, каньоны и природные памятники в шаговой доступности.',
    image: `${base}images/usp/landmarks/2.jpg`,
  },
  {
    title: 'Смотровые площадки',
    description: 'Панорамные виды на горы и долины. Незабываемые закаты на высоте 1600 метров.',
    image: `${base}images/hero/hero-4.jpg`,
  },
]

</script>
