<template>
  <section id="blog" ref="sectionRef" class="section-padding bg-sand-100">
    <!-- Header in container -->
    <div class="container">
      <UiSectionHeader label="Блог" align="left" class="mb-12">
        <template #default>
          Полезное <span class="section-title-accent">о Радде</span>
        </template>
        <template #actions>
          <UiArrowLink :href="`${base}blog`" class="hidden md:inline-flex">Все статьи</UiArrowLink>
        </template>
      </UiSectionHeader>
    </div>

    <!-- Carousel — edge-to-edge -->
    <div class="relative w-full" ref="carouselWrapRef">
      <div class="overflow-hidden">
        <div ref="trackRef" class="flex gap-6 blog-track-animate will-change-transform" :style="{ paddingLeft: containerPad + 'px', transform: `translateX(-${trackOffset}px)` }">
          <UiBlogCard
            v-for="(post, i) in cards"
            :key="'p' + i"
            :post="post"
            :width="cardWidth"
          />
        </div>
      </div>
    </div>

    <!-- Bottom bar: arrows left, dots right -->
    <div class="container">
      <div class="flex items-center justify-between mt-8">
        <div class="flex items-center gap-1.5">
          <button @click="prev" class="media-arrow media-arrow--light">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button @click="next" class="media-arrow media-arrow--light">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            v-for="i in totalDots"
            :key="i"
            @click="goTo(i - 1)"
            class="media-dot"
            :class="currentIndex === i - 1 ? 'bg-sand-800 w-5' : 'bg-sand-300 w-2'"
          ></button>
        </div>
      </div>

      <!-- Mobile: все статьи -->
      <div class="mt-8 text-center md:hidden">
        <a :href="`${base}blog`" class="btn-secondary inline-flex items-center gap-2">
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
const carouselWrapRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()

const currentIndex = ref(0)
const cardWidth = ref(360)
const containerPad = ref(20)
const trackOffset = ref(0)
const gap = 24

const { posts } = useBlogPosts()
const cards = computed(() => posts.map((p) => ({
  title: p.title,
  excerpt: p.excerpt,
  category: p.category,
  readTime: p.readTime,
  image: p.image,
  href: `${base}blog/${p.slug}`,
})))

const visibleCount = computed(() => {
  if (!import.meta.client) return 3
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2
  return 3
})

const maxIndex = computed(() => Math.max(0, cards.value.length - visibleCount.value))
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
.blog-track-animate {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
