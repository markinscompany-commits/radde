<template>
  <section id="reviews" ref="sectionRef" class="py-24 md:py-32 bg-sand-50 relative overflow-hidden">
    <div class="container">
      <!-- Header row: title left, rating widgets right -->
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
        <div>
          <span class="text-label text-olive-600 mb-4 block">Отзывы гостей</span>
          <h2 ref="titleRef" class="text-h2 font-500 text-sand-900">
            Что говорят <span class="section-title-accent">наши гости</span>
          </h2>
        </div>

        <!-- Rating mini-widgets -->
        <div ref="widgetsRef" class="flex flex-col sm:flex-row gap-3">
          <!-- Yandex Maps -->
          <div class="rating-widget">
            <div class="flex items-center gap-3">
              <img :src="`${base}images/icon-yandex-maps.svg`" alt="Яндекс Карты" width="40" height="40" />
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-display font-500 text-sand-900" style="font-size: 1.4rem; line-height: 1">{{ yandexRating.score }}</span>
                  <div class="flex gap-0.5">
                    <span v-for="n in 5" :key="'y'+n" class="text-3" :class="n <= Math.round(yandexRating.score) ? 'text-amber-500' : 'text-sand-200'">&#9733;</span>
                  </div>
                </div>
                <span class="text-caption text-sand-500 block mt-0.5">{{ yandexRating.count }} отзывов</span>
              </div>
            </div>
            <a :href="yandexRating.reviewUrl" target="_blank" rel="noopener" class="rating-widget-btn">
              Оставить отзыв
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>

          <!-- 2GIS -->
          <div class="rating-widget">
            <div class="flex items-center gap-3">
              <img :src="`${base}images/icon-2gis.svg`" alt="2ГИС" width="40" height="40" />
              <div>
                <div class="flex items-center gap-1.5">
                  <span class="font-display font-500 text-sand-900" style="font-size: 1.4rem; line-height: 1">{{ gisRating.score }}</span>
                  <div class="flex gap-0.5">
                    <span v-for="n in 5" :key="'g'+n" class="text-3" :class="n <= Math.round(gisRating.score) ? 'text-amber-500' : 'text-sand-200'">&#9733;</span>
                  </div>
                </div>
                <span class="text-caption text-sand-500 block mt-0.5">{{ gisRating.count }} отзывов</span>
              </div>
            </div>
            <a :href="gisRating.reviewUrl" target="_blank" rel="noopener" class="rating-widget-btn">
              Оставить отзыв
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>
      </div>

    </div>

    <!-- Carousel — full width edge-to-edge, first card aligned with container -->
    <div class="relative w-full" ref="carouselWrapRef">
      <div class="overflow-hidden">
        <div ref="trackRef" class="flex gap-5" :class="trackTransition ? 'track-animate' : ''" :style="{ paddingLeft: containerPadding + 'px', transform: `translateX(-${trackOffset}px)` }">
            <div
              v-for="(review, i) in loopedReviews"
              :key="'r' + i"
              class="review-card flex-shrink-0"
              :style="{ width: cardWidth + 'px' }"
            >
              <!-- Source badge + stars -->
              <div class="flex items-center justify-between mb-4">
                <div class="review-source" :class="'review-source--' + review.source">
                  <img v-if="review.source === 'yandex'" :src="`${base}images/icon-yandex-maps.svg`" width="14" height="14" alt="" />
                  <img v-else-if="review.source === '2gis'" :src="`${base}images/icon-2gis.svg`" width="14" height="14" alt="" />
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612" /><path d="M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2" /></svg>
                  <span>{{ sourceLabel(review.source) }}</span>
                </div>
                <div class="flex gap-0.5">
                  <span v-for="n in 5" :key="n" class="text-3.5" :class="n <= review.rating ? 'text-amber-500' : 'text-sand-200'">&#9733;</span>
                </div>
              </div>

              <!-- Text (truncated) -->
              <p class="font-body text-3.5 text-sand-700 leading-relaxed mb-4 review-text">
                &laquo;{{ review.text }}&raquo;
              </p>

              <!-- Read more — left aligned -->
              <button v-if="review.fullText" @click="openReview(review)"
                      class="text-small font-600 text-amber-600 hover:text-amber-700 transition-colors bg-transparent border-none cursor-pointer p-0 mb-4 self-start">
                Подробнее
              </button>

              <!-- Author: avatar + name left, date right — all on one line -->
              <div class="mt-auto flex items-center justify-between pt-4 border-t border-sand-100">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                       :class="review.source === 'yandex' ? 'bg-red-50 text-red-400' : review.source === '2gis' ? 'bg-green-50 text-green-500' : 'bg-sand-200 text-sand-500'">
                    <span class="font-display font-500 text-3.5">{{ review.author[0] }}</span>
                  </div>
                  <span class="text-small font-600 text-sand-800">{{ review.author }}</span>
                </div>
                <span class="text-caption text-sand-500">{{ review.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Bottom bar -->
    <div class="container">
      <div class="flex items-center justify-between mt-6 px-1">
        <div class="flex items-center gap-1.5">
          <button @click="prev" class="carousel-arrow">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button @click="next" class="carousel-arrow">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            v-for="i in totalDots"
            :key="i"
            @click="goTo(i - 1)"
            class="carousel-dot"
            :class="activeDot === i - 1 ? 'bg-sand-800 w-5' : 'bg-sand-300 w-2'"
          ></button>
        </div>
      </div>
    </div>

    <!-- Review detail modal -->
    <Teleport to="body">
      <Transition name="review-modal">
        <div v-if="activeReview" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/60 backdrop-blur-sm" @click.self="closeReview">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-110 max-h-[90vh] overflow-y-auto shadow-2xl z-10 modal-body" data-lenis-prevent>
            <!-- Close -->
            <button @click="closeReview" class="sticky top-4 float-right mr-4 mt-4 w-9 h-9 rounded-full bg-sand-200/90 backdrop-blur-sm hover:bg-sand-300 flex items-center justify-center transition-colors z-30 border-none cursor-pointer" style="margin-bottom: -52px;">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>

            <div class="p-7 md:p-9">
              <!-- Source + stars -->
              <div class="flex items-center gap-3 mb-5">
                <div class="review-source" :class="'review-source--' + activeReview.source">
                  <img v-if="activeReview.source === 'yandex'" :src="`${base}images/icon-yandex-maps.svg`" width="14" height="14" alt="" />
                  <img v-else-if="activeReview.source === '2gis'" :src="`${base}images/icon-2gis.svg`" width="14" height="14" alt="" />
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612" /><path d="M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2" /></svg>
                  <span>{{ sourceLabel(activeReview.source) }}</span>
                </div>
                <div class="flex gap-0.5">
                  <span v-for="n in 5" :key="n" class="text-4" :class="n <= activeReview.rating ? 'text-amber-500' : 'text-sand-200'">&#9733;</span>
                </div>
              </div>

              <!-- Author block -->
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                     :class="activeReview.source === 'yandex' ? 'bg-red-50 text-red-400' : activeReview.source === '2gis' ? 'bg-green-50 text-green-500' : 'bg-sand-200 text-sand-500'">
                  <span class="font-display font-500 text-5">{{ activeReview.author[0] }}</span>
                </div>
                <div>
                  <span class="font-body text-3.5 font-600 text-sand-900 block">{{ activeReview.author }}</span>
                  <span class="font-body text-3 text-sand-400">{{ activeReview.date }}</span>
                </div>
              </div>

              <!-- Full text -->
              <p class="font-body text-3.5 text-sand-700 leading-relaxed whitespace-pre-line">{{ activeReview.fullText || activeReview.text }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)

interface Review {
  id: string
  source: 'yandex' | '2gis' | 'site'
  author: string
  rating: number
  date: string
  text: string
  fullText?: string
}

const titleRef = ref<HTMLElement>()
const widgetsRef = ref<HTMLElement>()
const carouselWrapRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()

const activeReview = ref<Review | null>(null)
const currentIndex = ref(0)
const cardWidth = ref(340)
const containerPadding = ref(20)
const trackOffset = ref(0)
const trackTransition = ref(true)
const gap = 20

// loopedReviews and cloneOffset are defined after the reviews array below

const yandexRating = reactive({
  score: 4.8,
  count: 47,
  reviewUrl: 'https://yandex.ru/maps/-/CDwXRG',
})

const gisRating = reactive({
  score: 4.7,
  count: 32,
  reviewUrl: 'https://go.2gis.com/S1iUK',
})

const reviews: Review[] = [
  {
    id: 'y1', source: 'yandex', author: 'Алина М.', rating: 5, date: 'Март 2026',
    text: 'Невероятное место! Тишина, чистый воздух, вкуснейшая еда. Дети были в восторге от прогулок по лесу. Обязательно вернёмся летом.',
    fullText: 'Невероятное место! Тишина, чистый воздух, вкуснейшая еда. Дети были в восторге от прогулок по лесу. Обязательно вернёмся летом.\n\nНомер был чистый и тёплый, несмотря на то что на улице было +5. Виды из окна — горы и лес, как на картинке. Завтрак — домашний хлеб, мёд, каша, яйца. Обед и ужин заказывали отдельно — порции огромные, всё свежее.\n\nОтдельное спасибо за организацию экскурсии на Гунибскую крепость. Гид был великолепный.',
  },
  {
    id: 'g1', source: '2gis', author: 'Руслан К.', rating: 5, date: 'Февраль 2026',
    text: 'Приехали на выходные и не хотели уезжать. Виды из окон просто космос. Персонал очень приветливый, как в гостях у друзей.',
    fullText: 'Приехали на выходные и не хотели уезжать. Виды из окон просто космос. Персонал очень приветливый, как в гостях у друзей.\n\nДорога из Махачкалы заняла 3.5 часа — серпантин красивый, но будьте готовы. Трансфер пансионат организовал.\n\nНомер люкс с балконом — вид на горы, утром просыпаешься и не веришь, что это реальность. Баня шикарная, берёзовые веники. Рекомендую!',
  },
  {
    id: 's1', source: 'site', author: 'Мария Д.', rating: 5, date: 'Январь 2026',
    text: 'Идеальное место для перезагрузки. Никакого шума, только птицы и ветер. Номер чистый и тёплый. Еда — отдельный восторг.',
    fullText: 'Идеальное место для перезагрузки. Никакого шума, только птицы и ветер. Номер чистый и тёплый. Еда — отдельный восторг.\n\nМы приезжали вдвоём с мужем на 5 дней в январе. Было прохладно, но в номере тепло. Каждый день гуляли по лесу, дышали горным воздухом. На третий день заказали конную прогулку — незабываемо.\n\nОсобенно хочу отметить кухню. Хинкал, чуду, свежий хлеб из тандыра — всё настоящее, домашнее. Такого в Москве не найдёшь.',
  },
  {
    id: 'y2', source: 'yandex', author: 'Тимур А.', rating: 4, date: 'Декабрь 2025',
    text: 'Очень красивое место. Горы, лес, свежий воздух. Хорошее соотношение цена-качество. Рекомендую для семейного отдыха.',
  },
  {
    id: 'g2', source: '2gis', author: 'Елена С.', rating: 5, date: 'Ноябрь 2025',
    text: 'Второй раз здесь и планируем третий. Это наше место силы. Дети обожают здешнюю природу, а мы — тишину и покой.',
    fullText: 'Второй раз здесь и планируем третий. Это наше место силы. Дети обожают здешнюю природу, а мы — тишину и покой.\n\nВ этот раз взяли VIP-номер с камином — вечером сидели у огня, пили чай из горных трав. Дети весь день на площадке, потом за ужином засыпали прямо за столом от свежего воздуха.\n\nЕдинственное — Wi-Fi иногда пропадает, но мы приехали отдыхать от интернета, так что нам даже понравилось.',
  },
  {
    id: 's2', source: 'site', author: 'Камиль Н.', rating: 5, date: 'Октябрь 2025',
    text: 'Привёз родителей из Москвы — они в восторге. Отец не хотел уезжать. Тишина, горы, настоящая дагестанская кухня.',
  },
  {
    id: 'y3', source: 'yandex', author: 'Ольга П.', rating: 5, date: 'Сентябрь 2025',
    text: 'Потрясающее место для тех, кто устал от города. Воздух — лечебный. Персонал заботливый. Завтраки великолепные.',
  },
  {
    id: 'g3', source: '2gis', author: 'Магомед Р.', rating: 4, date: 'Август 2025',
    text: 'Хороший пансионат в красивом месте. Номера чистые, еда вкусная. Дорога горная, но виды того стоят.',
  },
]

// Infinite loop: clone before + original + clone after
const loopedReviews = computed(() => [...reviews, ...reviews, ...reviews])
const cloneOffset = reviews.length

const visibleCount = computed(() => {
  if (!import.meta.client) return 3
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2
  return 3
})

// For dots: we cycle through original reviews count
const totalDots = computed(() => reviews.length)

function sourceLabel(source: string) {
  if (source === 'yandex') return 'Яндекс Карты'
  if (source === '2gis') return '2ГИС'
  return 'Сайт'
}

function updateCardWidth() {
  if (!carouselWrapRef.value) return
  const viewportWidth = window.innerWidth
  // Get exact content offset by finding a .container element on the page
  const containerEl = document.querySelector('.container') as HTMLElement
  if (containerEl) {
    const rect = containerEl.getBoundingClientRect()
    const cs = getComputedStyle(containerEl)
    const pl = parseFloat(cs.paddingLeft) || 0
    containerPadding.value = rect.left + pl
    const containerInnerWidth = rect.width - pl - (parseFloat(cs.paddingRight) || 0)
    cardWidth.value = (containerInnerWidth - gap * (visibleCount.value - 1)) / visibleCount.value
  } else {
    // Fallback: match .container class: max-w-1100px mx-auto px-5 md:px-8
    const px = viewportWidth >= 768 ? 32 : 20
    const maxW = 1100
    const cWidth = Math.min(viewportWidth, maxW + px * 2)
    containerPadding.value = (viewportWidth - cWidth) / 2 + px
    const availableWidth = cWidth - px * 2
    cardWidth.value = (availableWidth - gap * (visibleCount.value - 1)) / visibleCount.value
  }
}

let isJumping = false

function setOffset(index: number) {
  trackOffset.value = index * (cardWidth.value + gap)
}

function slideTo(index: number) {
  trackTransition.value = true
  currentIndex.value = index
  setOffset(index)
}

function instantJumpTo(index: number) {
  isJumping = true
  trackTransition.value = false
  currentIndex.value = index
  setOffset(index)
  // Force browser to apply the non-transition state before re-enabling
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      trackTransition.value = true
      isJumping = false
    })
  })
}

function checkBounds() {
  // After a slide animation completes, check if we need to silently reposition
  const realLen = reviews.length
  if (currentIndex.value >= cloneOffset + realLen) {
    // Went past the end of the real section — jump to equivalent position in real section
    instantJumpTo(currentIndex.value - realLen)
  } else if (currentIndex.value < cloneOffset) {
    // Went before the start of the real section — jump to equivalent position
    instantJumpTo(currentIndex.value + realLen)
  }
}

function next() {
  if (isJumping) return
  slideTo(currentIndex.value + 1)
  restartAutoplay()
}

function prev() {
  if (isJumping) return
  slideTo(currentIndex.value - 1)
  restartAutoplay()
}

function goTo(dotIndex: number) {
  if (isJumping) return
  slideTo(cloneOffset + dotIndex)
  restartAutoplay()
}

// Active dot index (wraps around to original reviews)
const activeDot = computed(() => ((currentIndex.value - cloneOffset) % reviews.length + reviews.length) % reviews.length)

let autoplayInterval: ReturnType<typeof setInterval> | null = null

function startAutoplay() {
  if (autoplayInterval) return
  autoplayInterval = setInterval(() => { next() }, 10000)
}

function stopAutoplay() {
  if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null }
}

function restartAutoplay() {
  stopAutoplay()
  if (isVisible.value) startAutoplay()
}

function openReview(review: Review) {
  activeReview.value = review
  document.body.style.overflow = 'hidden'
  useLenis().instance()?.stop()
  history.replaceState(null, '', `#review-${review.id}`)
}

function closeReview() {
  activeReview.value = null
  document.body.style.overflow = ''
  useLenis().instance()?.start()
  history.replaceState(null, '', window.location.pathname)
}

onMounted(() => {
  if (!import.meta.client) return

  updateCardWidth()

  // Start at the real first item (after the prepended clones)
  instantJumpTo(cloneOffset)

  window.addEventListener('resize', () => {
    updateCardWidth()
    setOffset(currentIndex.value)
  })

  // Listen for transition end to silently reposition if needed
  trackRef.value?.addEventListener('transitionend', checkBounds)

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

  const hash = window.location.hash
  if (hash.startsWith('#review-')) {
    const id = hash.replace('#review-', '')
    const found = reviews.find(r => r.id === id)
    if (found) setTimeout(() => openReview(found), 500)
  }
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.rating-widget {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 220px;
  box-shadow: 0 2px 8px rgba(44, 36, 22, 0.04);
}

.rating-widget-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #8B6F47;
  background: #FAF6F0;
  border: 1px solid #E8D5B7;
  border-radius: 8px;
  padding: 7px 14px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}
.rating-widget-btn:hover {
  background: #F0E6D6;
  border-color: #D4BC96;
  color: #6B5B4A;
}

.review-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(44, 36, 22, 0.03);
}

.review-text {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-source {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.01em;
}
.review-source--yandex { background: #FFF0EE; color: #CC3326; }
.review-source--2gis { background: #EEFBEE; color: #2D8A30; }
.review-source--site { background: #F4F6EE; color: #5B7A3A; }

/* Arrows — same style as room/intro galleries */
.carousel-arrow {
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
.carousel-arrow:hover {
  background: rgba(44, 36, 22, 0.12);
  color: #2C2416;
}

/* Track animation */
.track-animate {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dots — same as rooms/intro */
.carousel-dot {
  height: 8px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

/* Modal transition */
.review-modal-enter-active { transition: opacity 0.3s ease; }
.review-modal-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.review-modal-leave-active { transition: opacity 0.2s ease; }
.review-modal-leave-active > div:last-child { transition: transform 0.2s ease, opacity 0.2s ease; }
.review-modal-enter-from { opacity: 0; }
.review-modal-enter-from > div:last-child { opacity: 0; transform: scale(0.95) translateY(10px); }
.review-modal-leave-to { opacity: 0; }
.review-modal-leave-to > div:last-child { opacity: 0; transform: scale(0.97); }
</style>
