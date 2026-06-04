<template>
  <section id="about" ref="sectionRef" class="bg-sand-50 section-padding">
    <div class="container">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        <!-- Левая колонка (lg) / часть 1 (mobile): лейбл + заголовок + 1-й абзац -->
        <div ref="textRef" class="order-1">
          <UiSectionHeader label="О пансионате" align="left" class="mb-6">
            Реликтовый лес<br>
            <span class="section-title-accent">на высоте 1700 метров</span>
          </UiSectionHeader>
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
            <UiArrowLink :href="`${base}blog/about`" class="mb-10">Узнать больше о Радде</UiArrowLink>

            <!-- Цифры (lg) -->
            <div ref="statsRef" class="flex gap-6 sm:gap-10">
              <div>
                <span class="font-display font-500 text-sand-900 block leading-none" style="font-size: clamp(2rem, 4vw, 2.8rem)">12</span>
                <span class="text-small text-sand-700 mt-1 block">уютных номеров</span>
              </div>
              <div class="w-px bg-sand-200"></div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-display font-500 text-sand-900 leading-none" style="font-size: clamp(2rem, 4vw, 2.8rem)">5.0</span>
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
          <div
            class="aspect-5/6 rounded-3 overflow-hidden shadow-xl relative gallery-touch cursor-pointer"
            @click="openLightbox"
            @touchstart.passive="onTouchStart"
            @touchend="onTouchEnd"
          >
            <transition-group name="gallery">
              <UiPicture
                v-for="(src, idx) in galleryImages"
                v-show="currentSlide === idx"
                :key="src"
                :src="src"
                sizes="(min-width: 1024px) 50vw, 100vw"
                :alt="`Пансионат Радде — фото ${idx + 1}`"
                class="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                loading="lazy"
                draggable="false"
              />
            </transition-group>

            <!-- Лупа (как в блоке «Размещение»): тот же media-arrow в верхнем левом углу -->
            <div class="absolute top-4 left-4 z-10" @click.stop>
              <button @click="openLightbox" class="media-arrow" title="Открыть на весь экран" aria-label="Открыть фото на весь экран">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M7 4.5v5M4.5 7h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <!-- Bottom bar: arrows left, dots right (same as Rooms) -->
            <div class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3" @click.stop>
              <!-- Arrows (bottom-left) -->
              <div class="flex items-center gap-1.5">
                <button @click="prevSlide" class="media-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button @click="nextSlide" class="media-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
              <!-- Dots (bottom-right) -->
              <div class="flex items-center gap-1.5">
                <button
                  v-for="(_, idx) in galleryImages"
                  :key="idx"
                  @click="goToSlide(idx)"
                  class="media-dot"
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
          <UiArrowLink :href="`${base}blog/about`" class="mb-10">Узнать больше о Радде</UiArrowLink>

          <!-- Цифры (mobile) -->
          <div class="flex gap-6 sm:gap-10">
            <div>
              <span class="font-display font-500 text-sand-900 block leading-none" style="font-size: clamp(2rem, 4vw, 2.8rem)">12</span>
              <span class="text-small text-sand-700 mt-1 block">уютных номеров</span>
            </div>
            <div class="w-px bg-sand-200"></div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-display font-500 text-sand-900 leading-none" style="font-size: clamp(2rem, 4vw, 2.8rem)">5.0</span>
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

    <!-- Лайтбокс: фото на весь экран -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox" data-lenis-prevent>
          <button @click="closeLightbox" class="lightbox-close" aria-label="Закрыть">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <button @click="prevSlide" class="lightbox-arrow lightbox-arrow--prev" aria-label="Предыдущее фото">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <img :src="galleryImages[currentSlide]" :alt="`Пансионат Радде — фото ${currentSlide + 1}`" class="lightbox-img" @click.self="closeLightbox" />
          <button @click="nextSlide" class="lightbox-arrow lightbox-arrow--next" aria-label="Следующее фото">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div class="lightbox-dots">
            <button
              v-for="(_, idx) in galleryImages"
              :key="idx"
              @click="goToSlide(idx)"
              class="media-dot"
              :class="currentSlide === idx ? 'bg-white w-5' : 'bg-white/45 w-2'"
            ></button>
          </div>
        </div>
      </Transition>
    </Teleport>
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
  `${base}images/heroblock/1.jpg`,
  `${base}images/heroblock/2.jpg`,
  `${base}images/heroblock/3.jpg`,
  `${base}images/heroblock/4.jpg`,
  `${base}images/hero/hero-1.jpg`,
]

const currentSlide = ref(0)
const lightboxOpen = ref(false)
let slideInterval: ReturnType<typeof setInterval> | null = null

function openLightbox() {
  lightboxOpen.value = true
  stopAutoplay()
  document.body.style.overflow = 'hidden'
  useLenis().instance()?.stop()
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
  useLenis().instance()?.start()
  if (isVisible.value) startAutoplay()
}

function onLightboxKey(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') prevSlide()
  else if (e.key === 'ArrowRight') nextSlide()
}

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
  if (slideInterval || lightboxOpen.value) return
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

// Touch-свайп: переключение слайдов жестом влево/вправо в любой области фото
let touchStartX = 0
function onTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0]?.clientX ?? 0
}
function onTouchEnd(e: TouchEvent) {
  const endX = e.changedTouches[0]?.clientX ?? 0
  const dx = endX - touchStartX
  // ~30px — минимальная дистанция чтобы случайный тап не считался свайпом
  if (Math.abs(dx) < 30) return
  if (dx < 0) nextSlide()
  else prevSlide()
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

  window.addEventListener('keydown', onLightboxKey)
})

onUnmounted(() => {
  stopAutoplay()
  window.removeEventListener('keydown', onLightboxKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.gallery-enter-active,
.gallery-leave-active {
  transition: opacity 0.8s ease;
}
.gallery-enter-from { opacity: 0; }
.gallery-leave-to { opacity: 0; }

/* Кнопка-лупа в углу галереи */
.gallery-zoom-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2C2416;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.gallery-zoom-btn:hover {
  background: #fff;
  transform: scale(1.05);
}

/* Лайтбокс */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(20, 16, 10, 0.92);
  backdrop-filter: blur(6px);
}
.lightbox-img {
  max-width: min(92vw, 1400px);
  max-height: 88vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  user-select: none;
}
.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s;
}
.lightbox-close:hover { background: rgba(255, 255, 255, 0.24); }
.lightbox-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s;
}
.lightbox-arrow:hover { background: rgba(255, 255, 255, 0.22); }
.lightbox-arrow--prev { left: 16px; }
.lightbox-arrow--next { right: 16px; }
.lightbox-dots {
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 7px;
}
@media (max-width: 640px) {
  .lightbox-arrow { width: 40px; height: 40px; }
  .lightbox-arrow--prev { left: 6px; }
  .lightbox-arrow--next { right: 6px; }
}

.lightbox-enter-active { transition: opacity 0.25s ease; }
.lightbox-enter-active .lightbox-img { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from { opacity: 0; }
.lightbox-enter-from .lightbox-img { transform: scale(0.94); }
.lightbox-leave-to { opacity: 0; }
</style>
