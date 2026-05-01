<template>
  <section class="section-padding bg-sand-100">
    <div class="container">
      <UiSectionHeader label="Почему выбирают нас" title="Что вас ждёт в" accent="Радде" class="mb-16" />

      <div ref="gridRef" class="grid grid-cols-1 md:grid-cols-12 gap-5">
        <UiUspCard
          v-for="(item, i) in usps"
          :key="i"
          :image="item.image"
          :title="item.title"
          :description="item.description"
          :wide="i === 0 || i === 3"
          :class="(i === 0 || i === 3) ? 'md:col-span-7' : 'md:col-span-5'"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'

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

