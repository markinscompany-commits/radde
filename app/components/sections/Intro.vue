<template>
  <section id="about" ref="sectionRef" class="bg-sand-50 py-20 md:py-26">
    <div class="container">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        <!-- Левая колонка (lg) / часть 1 (mobile): лейбл + заголовок + 1-й абзац -->
        <div ref="textRef" class="order-1">
          <span class="text-label text-olive-600 mb-4 block">О пансионате</span>
          <h2 class="text-h2 font-500 text-sand-900 mb-6">
            Реликтовый лес<br>
            <span class="section-title-accent">на высоте 1700 метров</span>
          </h2>
          <p class="text-body-lg text-sand-700 mb-6 lg:mb-6">
            Пансионат Радде расположен в природном парке «Верхний Гуниб» —
            одном из самых живописных уголков Дагестана.
          </p>
          <!-- Остальной текст: на lg здесь же; на мобильной — после галереи (см. ниже) -->
          <div class="hidden lg:block">
            <p class="text-body text-sand-700 mb-6">
              Здесь растёт реликтовая берёза Радде — эндемик Кавказа, занесённый в Красную книгу.
            </p>
            <p class="text-body text-sand-700 mb-8">
              Тёплое горское гостеприимство, чистейший горный воздух, панорамные виды,
              домашняя кухня и полное единение с природой — лучший выбор для семейного
              отдыха и перезагрузки.
            </p>
            <a href="/blog/about" class="inline-flex items-center gap-2 font-body text-4 font-600 text-amber-600 hover:text-amber-700 transition-colors mb-10">
              Узнать больше о Радде
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>

            <!-- Цифры (lg) -->
            <div ref="statsRef" class="flex gap-6 sm:gap-10">
              <div>
                <span class="font-display font-500 text-sand-900 block leading-none" style="font-size: clamp(2rem, 4vw, 2.8rem)">12</span>
                <span class="text-small text-sand-700 mt-1 block">уютных номеров</span>
              </div>
              <div class="w-px bg-sand-200"></div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-display font-500 text-sand-900 leading-none" style="font-size: clamp(2rem, 4vw, 2.8rem)">4.8</span>
                  <div class="flex gap-0.5 mt-1">
                    <span v-for="n in 5" :key="'lg'+n" class="text-4.5" :class="n <= 5 ? 'text-amber-500' : 'text-sand-200'">&#9733;</span>
                  </div>
                </div>
                <span class="text-small text-sand-700 mt-1 block">рейтинг на Яндекс Картах</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Галерея — на lg справа, на mobile между абзацами -->
        <div ref="imageRef" class="relative order-2">
          <div class="aspect-5/6 rounded-3 overflow-hidden shadow-xl relative">
            <transition-group name="gallery">
              <img
                v-for="(src, idx) in galleryImages"
                v-show="currentSlide === idx"
                :key="src"
                :src="src"
                :alt="`Пансионат Радде — фото ${idx + 1}`"
                class="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </transition-group>

            <!-- Bottom bar: arrows left, dots right (same as Rooms) -->
            <div class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3">
              <!-- Arrows (bottom-left) -->
              <div class="flex items-center gap-1.5">
                <button @click="prevSlide" class="gallery-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button @click="nextSlide" class="gallery-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
              <!-- Dots (bottom-right) -->
              <div class="flex items-center gap-1.5">
                <button
                  v-for="(_, idx) in galleryImages"
                  :key="idx"
                  @click="goToSlide(idx)"
                  class="gallery-dot"
                  :class="currentSlide === idx ? 'bg-white w-5' : 'bg-white/50 w-2'"
                ></button>
              </div>
            </div>
          </div>
          <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-olive-100 rounded-3 -z-1"></div>
          <div class="absolute -top-4 -right-4 w-16 h-16 bg-amber-400/20 rounded-full -z-1"></div>
        </div>

        <!-- Mobile-only: остальные абзацы + ссылка + цифры (после галереи) -->
        <div class="order-3 lg:hidden">
          <p class="text-body text-sand-700 mb-6">
            Здесь растёт реликтовая берёза Радде — эндемик Кавказа, занесённый в Красную книгу.
          </p>
          <p class="text-body text-sand-700 mb-8">
            Тёплое горское гостеприимство, чистейший горный воздух, панорамные виды,
            домашняя кухня и полное единение с природой — лучший выбор для семейного
            отдыха и перезагрузки.
          </p>
          <a href="/blog/about" class="inline-flex items-center gap-2 font-body text-4 font-600 text-amber-600 hover:text-amber-700 transition-colors mb-10">
            Узнать больше о Радде
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>

          <!-- Цифры (mobile) -->
          <div class="flex gap-6 sm:gap-10">
            <div>
              <span class="font-display font-500 text-sand-900 block leading-none" style="font-size: clamp(2rem, 4vw, 2.8rem)">12</span>
              <span class="text-small text-sand-700 mt-1 block">уютных номеров</span>
            </div>
            <div class="w-px bg-sand-200"></div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-display font-500 text-sand-900 leading-none" style="font-size: clamp(2rem, 4vw, 2.8rem)">4.8</span>
                <div class="flex gap-0.5 mt-1">
                  <span v-for="n in 5" :key="'m'+n" class="text-4.5" :class="n <= 5 ? 'text-amber-500' : 'text-sand-200'">&#9733;</span>
                </div>
              </div>
              <span class="text-small text-sand-700 mt-1 block">рейтинг на Яндекс Картах</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'

const sectionRef = ref<HTMLElement>()
const textRef = ref<HTMLElement>()
const imageRef = ref<HTMLElement>()
const statsRef = ref<HTMLElement>()
const isVisible = ref(false)

const galleryImages = [
  `${base}images/hero/hero-2.jpg`,
  `${base}images/hero/hero-3.jpg`,
  `${base}images/hero/hero-4.jpg`,
  `${base}images/hero/hero-1.jpg`,
]

const currentSlide = ref(0)
let slideInterval: ReturnType<typeof setInterval> | null = null

function goToSlide(idx: number) {
  currentSlide.value = idx
  restartInterval()
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % galleryImages.length
  restartInterval()
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + galleryImages.length) % galleryImages.length
  restartInterval()
}

function startAutoplay() {
  if (slideInterval) return
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % galleryImages.length
  }, 3000)
}

function stopAutoplay() {
  if (slideInterval) { clearInterval(slideInterval); slideInterval = null }
}

function restartInterval() {
  stopAutoplay()
  if (isVisible.value) startAutoplay()
}

onMounted(() => {
  if (!import.meta.client) return

  // Autoplay only when visible
  const observer = new IntersectionObserver(([entry]) => {
    isVisible.value = entry.isIntersecting
    if (entry.isIntersecting) startAutoplay()
    else stopAutoplay()
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
  onUnmounted(() => observer.disconnect())

})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.gallery-enter-active,
.gallery-leave-active {
  transition: opacity 0.8s ease;
}
.gallery-enter-from { opacity: 0; }
.gallery-leave-to { opacity: 0; }

/* Arrow buttons — same as Rooms */
.gallery-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.gallery-arrow:hover {
  background: rgba(0, 0, 0, 0.6);
}

/* Dot indicators — same as Rooms */
.gallery-dot {
  height: 8px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}
</style>
