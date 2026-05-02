<template>
  <div>
    <UiAppHeader solid @book="showBooking = true" />

    <!-- Hero strip -->
    <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-40 pb-16 md:pb-20">
      <img
        :src="`${base}images/hero/hero-2.jpg`"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-sand-900/80"></div>

      <div class="container relative z-10">
        <span class="text-label text-amber-400 mb-4 block">Блог</span>
        <h1 class="text-h1 text-white mb-5 max-w-200">
          Полезное <span class="section-title-accent">о Радде</span>
        </h1>
        <p class="text-body-lg text-white/75 max-w-150">
          Маршруты по Гунибскому району, гид по дагестанской кухне, советы по семейному отдыху в горах и истории про реликтовый лес. Всё, что помогает спланировать поездку и сделать её ярче.
        </p>
      </div>
    </section>

    <!-- About card + Категории -->
    <section class="bg-sand-50 pt-12 md:pt-16">
      <div class="container">
        <!-- About: отдельная карточка-баннер -->
        <a :href="`${base}blog/about`" class="about-card group block mb-10 md:mb-14">
          <div class="about-card-media">
            <img :src="`${base}images/hero/hero-1.jpg`" alt="Пансионат Радде" />
            <div class="about-card-overlay"></div>
          </div>
          <div class="about-card-body">
            <span class="text-label text-amber-400 mb-3 block">О пансионате</span>
            <h2 class="text-h2 text-white mb-4">
              Что такое <span class="section-title-accent">Радде</span>
            </h2>
            <p class="text-body-lg text-white/80 mb-6 max-w-130">
              История пансионата, реликтовый лес на 1700 метрах, философия гостеприимства и подробно о номерах, кухне и активностях.
            </p>
            <span class="inline-flex items-center gap-2 font-body font-600 text-amber-400 group-hover:text-white transition-colors">
              Читать
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
        </a>

        <!-- Категории -->
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
    </section>

    <!-- Сетка статей -->
    <section class="bg-sand-50 pb-20 md:pb-26 pt-8 md:pt-10">
      <div class="container">
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

const ALL = 'Все статьи'
const categories = computed(() => [ALL, ...Array.from(new Set(posts.map((p) => p.category)))])
const activeCat = ref(ALL)

const filtered = computed(() => {
  const list = activeCat.value === ALL ? posts : posts.filter((p) => p.category === activeCat.value)
  return list.map((p) => ({
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    readTime: p.readTime,
    image: p.image,
    href: `${base}blog/${p.slug}`,
  }))
})

useHead({
  title: 'Блог — Пансионат Радде',
  meta: [
    { name: 'description', content: 'Статьи о пансионате Радде, маршрутах по Гунибскому району, дагестанской кухне и семейном отдыхе в горах.' },
  ],
})
</script>

<style scoped>
.about-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  overflow: hidden;
  text-decoration: none;
  min-height: 360px;
  isolation: isolate;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.about-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(44, 36, 22, 0.12);
}

.about-card-media {
  position: absolute;
  inset: 0;
  z-index: -1;
}
.about-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.about-card:hover .about-card-media img {
  transform: scale(1.03);
}
.about-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(44, 36, 22, 0.88) 0%, rgba(44, 36, 22, 0.62) 60%, rgba(44, 36, 22, 0.4) 100%);
}

.about-card-body {
  padding: 36px 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1;
  min-height: 360px;
}

@media (min-width: 768px) {
  .about-card-body {
    padding: 56px 48px;
    min-height: 380px;
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
