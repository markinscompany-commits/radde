<template>
  <section id="blog" ref="sectionRef" class="py-20 md:py-26 bg-sand-100">
    <!-- Header in container -->
    <div class="container">
      <div class="mb-12">
        <span class="text-label text-olive-600 mb-4 block">Блог</span>
        <div class="flex items-center justify-between">
          <h2 ref="titleRef" class="text-h2 font-500 text-sand-900">
            Полезное <span class="section-title-accent">о Радде</span>
          </h2>
          <a href="/blog" class="hidden md:inline-flex items-center gap-2 font-body text-4 font-600 text-amber-600 hover:text-amber-700 transition-colors">
          Все статьи
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        </div>
      </div>
    </div>

    <!-- Carousel — edge-to-edge -->
    <div class="relative w-full" ref="carouselWrapRef">
      <div class="overflow-hidden">
        <div ref="trackRef" class="flex gap-6 blog-track-animate will-change-transform" :style="{ paddingLeft: containerPad + 'px', transform: `translateX(-${trackOffset}px)` }">
          <a
            v-for="(post, i) in posts"
            :key="'p' + i"
            :href="post.href"
            class="blog-card flex-shrink-0 group"
            :style="{ width: cardWidth + 'px' }"
          >
            <!-- Photo -->
            <div class="blog-card-img">
              <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" loading="lazy" decoding="async" />
              <!-- Category badge -->
              <span class="blog-badge">{{ post.category }}</span>
            </div>
            <!-- Content -->
            <div class="p-5 flex flex-col flex-1">
              <h3 class="font-display font-500 text-sand-900 mb-2 leading-snug group-hover:text-amber-700 transition-colors" style="font-size: clamp(1.05rem, 1.8vw, 1.25rem)">{{ post.title }}</h3>
              <p class="text-small text-sand-700 leading-relaxed blog-excerpt mb-4">{{ post.excerpt }}</p>
              <div class="mt-auto flex items-center justify-between">
                <span class="text-small text-sand-700">{{ post.readTime }}</span>
                <span class="text-small font-600 text-amber-600 group-hover:text-amber-700 transition-colors flex items-center gap-1">
                  Читать
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom bar: arrows left, dots right -->
    <div class="container">
      <div class="flex items-center justify-between mt-8">
        <div class="flex items-center gap-1.5">
          <button @click="prev" class="blog-arrow">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button @click="next" class="blog-arrow">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            v-for="i in totalDots"
            :key="i"
            @click="goTo(i - 1)"
            class="blog-dot"
            :class="currentIndex === i - 1 ? 'bg-sand-800 w-5' : 'bg-sand-300 w-2'"
          ></button>
        </div>
      </div>

      <!-- Mobile: все статьи -->
      <div class="mt-8 text-center md:hidden">
        <a href="/blog" class="btn-secondary inline-flex items-center gap-2">
          Все статьи
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'

const sectionRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const carouselWrapRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()

const currentIndex = ref(0)
const cardWidth = ref(360)
const containerPad = ref(20)
const trackOffset = ref(0)
const gap = 24

const posts = [
  {
    title: 'Как добраться до пансионата Радде',
    excerpt: 'Подробная инструкция: маршруты из Махачкалы, трансфер, что учесть в дороге по горному серпантину.',
    category: 'Путешествие',
    readTime: '5 мин чтения',
    image: `${base}images/hero/hero-3.jpg`,
    href: '/blog/kak-dobratsya',
  },
  {
    title: 'Достопримечательности Гунибского района',
    excerpt: 'Гунибская крепость, водопады, каньоны и другие места, которые стоит посетить рядом с Радде.',
    category: 'Что посмотреть',
    readTime: '7 мин чтения',
    image: `${base}images/usp/landmarks/1.jpg`,
    href: '/blog/dostoprimechatelnosti',
  },
  {
    title: 'Семейный отдых в горах Дагестана',
    excerpt: 'Чем заняться с детьми, безопасность, питание и всё, что нужно знать для комфортного отдыха всей семьёй.',
    category: 'Семейный отдых',
    readTime: '6 мин чтения',
    image: `${base}images/usp/nature/1.jpg`,
    href: '/blog/semeynyy-otdyh',
  },
  {
    title: 'Дагестанская кухня: что попробовать в Гунибе',
    excerpt: 'Хинкал, чуду, курзе, урбеч — гид по блюдам, которые нужно попробовать во время отдыха в горах.',
    category: 'Гастрономия',
    readTime: '4 мин чтения',
    image: `${base}images/usp/food/1.jpg`,
    href: '/blog/dagestanskaya-kuhnya',
  },
  {
    title: 'Зимний Дагестан: стоит ли ехать?',
    excerpt: 'Снежные горы, тёплые номера, баня и тишина. Почему зима — лучшее время для перезагрузки в Радде.',
    category: 'Сезоны',
    readTime: '5 мин чтения',
    image: `${base}images/hero/hero-1.jpg`,
    href: '/blog/zimniy-dagestan',
  },
  {
    title: 'Конные прогулки по реликтовому лесу',
    excerpt: 'Как проходит прогулка верхом, что нужно знать новичкам и почему это главное впечатление от Гуниба.',
    category: 'Активности',
    readTime: '4 мин чтения',
    image: `${base}images/hero/hero-4.jpg`,
    href: '/blog/konnye-progulki',
  },
]

const visibleCount = computed(() => {
  if (!import.meta.client) return 3
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2
  return 3
})

const maxIndex = computed(() => Math.max(0, posts.length - visibleCount.value))
const totalDots = computed(() => maxIndex.value + 1)

function updateSizes() {
  const containerEl = document.querySelector('.container') as HTMLElement
  if (containerEl) {
    const rect = containerEl.getBoundingClientRect()
    const cs = getComputedStyle(containerEl)
    const pl = parseFloat(cs.paddingLeft) || 0
    containerPad.value = rect.left + pl
    const innerW = rect.width - pl - (parseFloat(cs.paddingRight) || 0)
    cardWidth.value = (innerW - gap * (visibleCount.value - 1)) / visibleCount.value
  }
}

function slideTo(index: number) {
  currentIndex.value = Math.max(0, Math.min(index, maxIndex.value))
  trackOffset.value = currentIndex.value * (cardWidth.value + gap)
}

function next() {
  if (currentIndex.value >= maxIndex.value) slideTo(0)
  else slideTo(currentIndex.value + 1)
  restartAutoplay()
}

function prev() {
  if (currentIndex.value <= 0) slideTo(maxIndex.value)
  else slideTo(currentIndex.value - 1)
  restartAutoplay()
}

function goTo(i: number) { slideTo(i); restartAutoplay() }

let autoplayInterval: ReturnType<typeof setInterval> | null = null
const isVisible = ref(false)

function startAutoplay() {
  if (autoplayInterval) return
  autoplayInterval = setInterval(() => { next() }, 8000)
}

function stopAutoplay() {
  if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null }
}

function restartAutoplay() {
  stopAutoplay()
  if (isVisible.value) startAutoplay()
}

onMounted(() => {
  if (!import.meta.client) return

  updateSizes()

  window.addEventListener('resize', () => { updateSizes(); slideTo(currentIndex.value) })

  // Autoplay only when visible
  const observer = new IntersectionObserver(([entry]) => {
    isVisible.value = entry.isIntersecting
    if (entry.isIntersecting) startAutoplay()
    else stopAutoplay()
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
  onUnmounted(() => observer.disconnect())

  carouselWrapRef.value?.addEventListener('mouseenter', () => stopAutoplay())
  carouselWrapRef.value?.addEventListener('mouseleave', () => { if (isVisible.value) startAutoplay() })

})

onUnmounted(() => {
  if (autoplayInterval) clearInterval(autoplayInterval)
})
</script>

<style scoped>
.blog-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
.blog-card:hover {
  border-color: #E8D5B7;
  box-shadow: 0 8px 30px rgba(44, 36, 22, 0.08);
}

.blog-card-img {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}
.blog-card-img img {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  transform: translateZ(0);
}
.blog-card:hover .blog-card-img img {
  transform: scale(1.04);
}

.blog-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: rgba(44, 36, 22, 0.85);
  /* no backdrop-filter for performance */
  padding: 5px 12px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}
/* blog-badge — намеренное исключение из min 16px:
   мини-бейдж категории на фото, иначе занимает половину снимка */

.blog-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-track-animate {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(44, 36, 22, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B5B4A;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.blog-arrow:hover {
  background: rgba(44, 36, 22, 0.12);
  color: #2C2416;
}

.blog-dot {
  height: 8px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}
</style>
