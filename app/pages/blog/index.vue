<template>
  <div>
    <UiAppHeader @book="showBooking = true" />

    <!-- Hero strip -->
    <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-40 pb-16 md:pb-20">
      <img
        :src="`${base}images/hero/hero-2.jpg`"
        alt="Реликтовый лес Радде — фон страницы блога"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-sand-900/80"></div>

      <div class="container relative z-10">
        <UiBreadcrumbs
          variant="dark"
          :items="[
            { label: 'Главная', href: base },
            { label: 'Блог' },
          ]"
          class="mb-6"
        />
        <h1 class="text-h1 text-white mb-5 max-w-200">
          Полезное <span class="section-title-accent">о Радде</span>
        </h1>
        <p class="text-body-lg text-white/75 max-w-150">
          Маршруты по Гунибскому району, гид по дагестанской кухне, советы по семейному отдыху в горах и истории про реликтовый лес. Всё, что помогает спланировать поездку и сделать её ярче.
        </p>
      </div>
    </section>

    <!-- Категории + список -->
    <section class="bg-sand-50 pt-12 md:pt-16 pb-20 md:pb-26">
      <!-- Sentinel: невидимая точка перед табами. Когда уходит за верх
           viewport — IntersectionObserver добавляет класс is-stuck к табам,
           и они становятся fixed под шапкой. CSS position:sticky ломается
           из-за body overflow-x: hidden — поэтому используем JS-подход. -->
      <div ref="catBarSentinel" class="cat-bar-sentinel"></div>
      <div ref="catBarRef" class="cat-bar" :class="catBarStuck ? 'cat-bar--stuck' : ''">
        <div class="container">
          <div class="flex items-center gap-2 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap md:overflow-visible">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              class="cat-chip"
              :class="activeCat === cat ? 'cat-chip--active' : ''"
              @click="activeCat = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
      <!-- Spacer: занимает место табов когда они становятся fixed,
           чтобы контент не "прыгал" вверх -->
      <div v-show="catBarStuck" :style="{ height: `${catBarHeight}px` }"></div>

      <div class="container pt-8 md:pt-10">
        <div v-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <UiBlogCard
            v-for="post in filtered"
            :key="post.href"
            :post="post"
          />
        </div>
        <div v-else class="text-center py-12">
          <p class="text-body text-sand-700">В этой категории пока нет статей.</p>
        </div>
      </div>
    </section>

    <UiEthnicDivider variant="light" />

    <SectionsContactFooter />

    <UiBookingModal v-model="showBooking" />
  </div>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
const showBooking = ref(false)

const { posts } = useBlogPosts()

// Виртуальный пост «О пансионате» — отдельная страница /blog/about,
// но в листинге блога показывается как обычная карточка
const aboutPost = {
  title: 'О пансионате Радде',
  excerpt: 'История пансионата, реликтовый лес на 1700 метрах, философия гостеприимства и подробно о номерах, кухне и активностях.',
  category: 'О пансионате',
  readTime: '6 мин чтения',
  image: `${base}images/hero/hero-1.jpg`,
  href: `${base}blog/about`,
}

const allCards = computed(() => [
  aboutPost,
  ...posts.map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    readTime: p.readTime,
    image: p.image,
    href: `${base}blog/${p.slug}`,
  })),
])

const ALL = 'Все статьи'
const categories = computed(() => [ALL, ...Array.from(new Set(allCards.value.map((p) => p.category)))])
const activeCat = ref(ALL)

const filtered = computed(() => {
  if (activeCat.value === ALL) return allCards.value
  return allCards.value.filter((p) => p.category === activeCat.value)
})

useSiteMeta({
  title: 'Блог — Пансионат Радде',
  description: 'Статьи о пансионате Радде, маршрутах по Гунибскому району, дагестанской кухне и семейном отдыхе в горах.',
  path: '/blog',
})
useStructuredData().breadcrumbs([
  { name: 'Главная', path: '/' },
  { name: 'Блог', path: '/blog' },
])

// Sticky категории через IntersectionObserver (CSS sticky ломается
// из-за body overflow-x: hidden, особенно в Safari)
const catBarSentinel = ref<HTMLElement>()
const catBarRef = ref<HTMLElement>()
const catBarStuck = ref(false)
const catBarHeight = ref(0)

onMounted(() => {
  if (!import.meta.client) return
  if (!catBarSentinel.value) return

  // Запоминаем высоту блока с табами один раз
  if (catBarRef.value) catBarHeight.value = catBarRef.value.offsetHeight

  // rootMargin: -64px сверху — учёт фиксированной шапки сайта
  const headerOffset = window.innerWidth >= 768 ? 72 : 64
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      // Когда sentinel НЕ виден сверху — фиксируем табы
      catBarStuck.value = !entry.isIntersecting && entry.boundingClientRect.top < 0
    },
    { rootMargin: `-${headerOffset}px 0px 0px 0px`, threshold: 0 },
  )
  observer.observe(catBarSentinel.value)
  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
/* Невидимый sentinel перед табами — для IntersectionObserver */
.cat-bar-sentinel {
  height: 1px;
  margin-bottom: -1px;
  pointer-events: none;
}

/* Полоска с табами категорий: при скролле через JS получает is-stuck
   и становится fixed под шапкой (sticky не работает из-за body overflow-x). */
.cat-bar {
  background: rgba(250, 246, 240, 0.92);
  backdrop-filter: blur(8px);
  padding: 10px 0;
  transition: box-shadow 0.2s, border-color 0.2s;
}
@media (min-width: 768px) {
  .cat-bar {
    padding: 14px 0;
  }
}
.cat-bar--stuck {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  z-index: 30;
  border-bottom: 1px solid #E8DCC8;
  box-shadow: 0 4px 14px rgba(44, 36, 22, 0.04);
}
@media (min-width: 768px) {
  .cat-bar--stuck {
    top: 72px;
  }
}

.cat-chip {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #6B5B4A;
  background: white;
  border: 1px solid #F0E6D6;
  padding: 9px 18px;
  border-radius: 999px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.cat-chip:hover {
  border-color: #E8D5B7;
  color: #2C2416;
}
.cat-chip--active {
  background: #2C2416;
  border-color: #2C2416;
  color: white;
}
</style>
