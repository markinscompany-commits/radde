<template>
  <section id="reviews" ref="sectionRef" class="section-padding bg-sand-50 relative overflow-hidden">
    <div class="container">
      <!-- Header row: title left, rating widgets right -->
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
        <UiSectionHeader label="Отзывы гостей" title="Что говорят" accent="наши гости" align="left" />

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
                <span class="text-small text-sand-700 block mt-0.5">{{ yandexRating.count }} отзывов</span>
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
                <span class="text-small text-sand-700 block mt-0.5">{{ gisRating.count }} отзывов</span>
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

    <!-- Carousel — full width edge-to-edge, first card aligned with container.
         На моб (<lg) — нативный horizontal scroll с scroll-snap, без cloning/transform/autoplay.
         На lg+ — infinite-loop карусель со стрелками и точками. -->
    <div class="relative w-full" ref="carouselWrapRef">
      <div :class="isMobile ? 'mobile-scroll' : 'overflow-hidden'">
        <div
          ref="trackRef"
          class="flex gap-5"
          :class="[
            !isMobile && trackTransition ? 'track-animate' : '',
            isMobile ? 'mobile-track' : '',
          ]"
          :style="isMobile
            ? {}
            : { paddingLeft: containerPadding + 'px', transform: `translateX(-${trackOffset}px)` }"
        >
          <UiReviewCard
            v-for="(review, i) in (isMobile ? reviews : loopedReviews)"
            :key="'r' + i"
            :review="review"
            :width="cardWidth"
            class="mobile-card"
            @open="openReview"
          />
        </div>
      </div>
    </div>

    <!-- Bottom bar — на моб скрыт (нативный скролл сам индикатор) -->
    <div class="container hidden lg:block">
      <div class="flex items-center justify-between mt-6 px-1">
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
                  <span class="font-body text-4 font-600 text-sand-900 block">{{ activeReview.author }}</span>
                  <span class="font-body text-4 text-sand-700">{{ activeReview.date }}</span>
                </div>
              </div>

              <!-- Full text -->
              <p class="font-body text-4 text-sand-800 leading-relaxed whitespace-pre-line">{{ activeReview.fullText || activeReview.text }}</p>
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
const isMobile = ref(false)

// loopedReviews and cloneOffset are defined after the reviews array below

const yandexRating = reactive({
  score: 5.0,
  count: 294,
  reviewUrl: 'https://yandex.com/maps/-/CPSTAYNj',
})

const gisRating = reactive({
  score: 4.1,
  count: 7,
  reviewUrl: 'https://go.2gis.com/S1iUK',
})

// Реальные отзывы с Яндекс Карт (oid 97116534116) и 2ГИС (firm 70000001075382268),
// собраны 04.06.2026. Оставлены адекватные с оценкой 4–5. Тексты — как у авторов.
const reviews: Review[] = [
  {
    id: 'y1', source: 'yandex', author: 'Ума А.', rating: 5, date: 'Май 2026',
    text: 'Нам всё понравилось! Номер чистый, питание разнообразное, атмосфера комфортная, персонал приветливый, на территории детская площадка.',
    fullText: 'Нам все понравилось 😍👍 Номер был чистый, питание разнообразное, атмосфера комфортная, персонал приветливый, на территории есть детская площадка. Ездим 3 год подряд, всем довольны, отличный отдых от городской суеты. Свежий воздух, красивый вид, дети были в восторге ❤️',
  },
  {
    id: 'y2', source: 'yandex', author: 'Ольга С.', rating: 5, date: 'Декабрь 2025',
    text: 'Просто супер место — красиво, чисто, уютно. Снимали люкс с видом на горы, это класс. Заказывали ужин — очень вкусно, завтрак включён.',
    fullText: 'Просто супер место, красиво, чисто, уютно. Снимали люкс с видом на горы, это просто класс. Номер большой, уютный и чистый. Кровать большая и удобная. Заказывали ужин, очень вкусно. Завтрак включён, отличный. Есть всё необходимое для отдыха.',
  },
  {
    id: 'y3', source: 'yandex', author: 'Анастасия Т.', rating: 5, date: 'Декабрь 2025',
    text: 'Уютный по-домашнему комфортабельный отель, пожалуй, самый комфортабельный в этом районе. Завтраки, обеды и ужины — всё очень вкусно.',
    fullText: 'Уютный по-домашнему комфортабельный отель. Пожалуй, в этом районе самый комфортабельный. В стоимость были включены завтраки, обеды и ужины, всё очень вкусно, приготовлено хозяюшками с любовью из местных продуктов — молоко, сыр, хлеб на высшем уровне. Первое место, которое мы встречаем, когда, если не наелся, подкладывают)) Большое спасибо за комфорт и чудесный отдых!',
  },
  {
    id: 'g1', source: '2gis', author: 'Зухра', rating: 5, date: 'Ноябрь 2025',
    text: 'Прекрасное душевное место! Отзывчивый и внимательный персонал, вкусные завтраки, чистота в номерах. В шаговой доступности лес.',
    fullText: 'Прекрасное душевное место! Отзывчивый и внимательный персонал, вкусные завтраки, чистота в номерах, есть всё необходимое. В шаговой доступности лес. Магазинов тут нет, берите всё необходимое с собой. Осенью в номере было очень тепло, к нашему приезду нам включили обогреватель.',
  },
  {
    id: 'y4', source: 'yandex', author: 'Екатерина К.', rating: 5, date: 'Май 2025',
    text: 'Как будто были у друзей в гостях. Жили в панорамном люксе на 3-м этаже, вид отличный. Особо отмечу хозяев — очень отзывчивые.',
    fullText: 'У нас осталось чудесное впечатление в целом. Как будто были у друзей в гостях. Жили в панорамном люксе на 3-м этаже. Всё работало. Вид отличный. Особо отмечу хозяев и сотрудников. Очень отзывчивые, доброжелательные. Еда... Наслаждались каждым приёмом пищи, хоть и простой, но разнообразной и вкусной. Блинчики великолепные. Также есть хороший кофе, пироги, мороженое. В общем, быть голодным сложно. Всегда есть доступ к чаю. Территория большая, есть смотровые места, беседка.',
  },
  {
    id: 'y5', source: 'yandex', author: 'Шамиль Х.', rating: 5, date: 'Январь 2025',
    text: 'Отдыхаем семьёй в Радде больше 20 лет! Отличное расположение, уютные номера, целебный воздух соснового бора.',
    fullText: 'Отдыхаем семьёй в Радде больше 20 лет!! Отличное расположение, уютные номера, вид из окна 👍🏻 и целебный воздух соснового бора!!! Большая огороженная территория, оборудована беседками и качелями, есть детская зона и мангал. Качественное и полезное питание. Круглогодичный приём отдыхающих!',
  },
  {
    id: 'y6', source: 'yandex', author: 'Елизавета Г.', rating: 5, date: 'Апрель 2025',
    text: 'Потрясающее место, уютный камерный отель с прекрасными видами и вкусными завтраками. Проводили свадебную церемонию — все гости в восторге.',
    fullText: 'Потрясающее место, уютный камерный отель с прекрасными видами, особенным воздухом, вкусными здоровыми завтраками! Останавливались в октябре большой компанией для проведения свадебной церемонии. Все гости были в восторге. Совершенно особенное место! Огромное спасибо гостеприимным отзывчивым владельцам 🤍',
  },
  {
    id: 'g2', source: '2gis', author: 'Валерия', rating: 5, date: 'Январь 2025',
    text: 'Приезжала с семьёй, с маленькими детьми — нам всё понравилось. Персонал очень заботливый, номера уютные, место бесподобное.',
    fullText: 'Приезжала с семьёй, с маленькими детьми, нам всё понравилось. Персонал очень заботливый, номера уютные, место бесподобное. Отдохнули всей душой. Приедем обязательно весной ❤️',
  },
  {
    id: 'y7', source: 'yandex', author: 'Юлия С.', rating: 5, date: 'Март 2025',
    text: 'Отличный отель! Очень вкусная своя кухня, дружелюбный персонал. Шикарный вид, мангалы и беседки на территории, удобно подниматься в горы.',
    fullText: 'Отличный отель! Очень вкусная своя кухня, дружелюбный и идущий навстречу персонал. Шикарный вид, мангалы/беседки на территории. Очень удобно подниматься в горы, близко. Номера уютные, снимали два друг напротив друга на третьем этаже. Если нужно — дают камин. Ванная и туалет общие, но всё чистенько.',
  },
  {
    id: 'y8', source: 'yandex', author: 'Наталья', rating: 5, date: 'Май 2025',
    text: 'Прекрасный гостевой дом в заповедном месте! Спокойная уютная атмосфера, приятный номер с видом на горы (VIP на 4 этаже). Замечательный воздух.',
    fullText: 'Прекрасный гостевой дом в заповедном месте! Спокойная, уютная атмосфера, приятный номер с красивым видом на горы (останавливались в номере VIP на 4 этаже). Учтите, что нужно подняться по крутым лестницам с чемоданом, но это того стоит. Вокруг прекрасная территория. Нурмагомед отвечает на все вопросы и все просьбы, спасибо большое за радушный приём! Замечательные окрестности и воздух!',
  },
  {
    id: 'g3', source: '2gis', author: 'Н. Ц.', rating: 5, date: 'Август 2024',
    text: 'Останавливались на 3 дня в августе. Приветливые, отзывчивые хозяева, большая зелёная территория, сытные завтраки и тишина в горах.',
    fullText: 'Останавливались на 3 дня в августе 2024, приветливые, отзывчивые хозяева, большая зелёная территория, сытные завтраки и тишина в горах.',
  },
  {
    id: 'y9', source: 'yandex', author: 'Александра С.', rating: 5, date: 'Июнь 2025',
    text: 'Очень домашнее место. Закрытая территория, чудесный воздух. Кормили невероятной едой — простой, но удивительного качества, хлеб пекут сами.',
    fullText: 'Хорошее какое-то очень домашнее место. Закрытая территория, чудесный воздух. Пьянящий просто. Все были очень добродушные и всё время меня кормили невероятной едой. Еда вроде бы простая — масло, хлеб, сыр, сметана, помидоры — но удивительного качества. Хлеб, например, домашний, его пекут в отеле, а сметана густая и без кислинки, как сливочный сыр 😊 На территории лавочки-качели, шиповник и зелень. С лавочек чудесный вид.',
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
  isMobile.value = viewportWidth < 1024
  if (isMobile.value) {
    // Native horizontal scroll: каждая карточка ~85% ширины экрана,
    // кусочек следующей виден — намёк на скролл
    cardWidth.value = Math.round(viewportWidth * 0.85)
    containerPadding.value = 20
    return
  }
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
  if (isMobile.value) {
    // На моб — нативный скролл со scroll-snap. Двигаем scrollLeft, snap
    // сам выровняет к ближайшей карточке. Если пользователь касается экрана —
    // тач-пауза, чтобы не вырывать скролл.
    autoplayInterval = setInterval(() => {
      const wrap = trackRef.value?.parentElement
      if (!wrap) return
      const step = cardWidth.value + gap
      const max = wrap.scrollWidth - wrap.clientWidth
      const next = wrap.scrollLeft + step
      wrap.scrollTo({ left: next > max - 4 ? 0 : next, behavior: 'smooth' })
    }, 5000)
    return
  }
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
  font-size: 16px;
  font-weight: 600;
  color: #6B5B4A;
  background: #FAF6F0;
  border: 1px solid #E8D5B7;
  border-radius: 8px;
  padding: 8px 16px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}
.rating-widget-btn:hover {
  background: #F0E6D6;
  border-color: #D4BC96;
  color: #6B5B4A;
}

/* review-source bleed — модалка использует те же классы, что и UiReviewCard */
.review-source {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 999px;
  letter-spacing: 0.01em;
}
.review-source--yandex { background: #FFF0EE; color: #CC3326; }
.review-source--2gis { background: #EEFBEE; color: #2D8A30; }
.review-source--site { background: #F4F6EE; color: #5B7A3A; }

/* Track animation */
.track-animate {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile native horizontal scroll with snap */
.mobile-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 20px;
  scrollbar-width: none;
}
.mobile-scroll::-webkit-scrollbar {
  display: none;
}
.mobile-track {
  padding: 0 20px;
}
.mobile-track > .mobile-card {
  scroll-snap-align: start;
  flex-shrink: 0;
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
