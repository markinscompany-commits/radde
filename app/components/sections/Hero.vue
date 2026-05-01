<template>
  <section class="hero-section relative overflow-hidden bg-sand-900">
    <!-- Фоновая фотография -->
    <img
      :src="heroImage"
      alt="Пансионат Радде — горы Дагестана"
      class="absolute inset-0 w-full h-full object-cover"
      fetchpriority="high"
    />
    <div class="absolute inset-0 bg-sand-900/70"></div>

    <!-- Заголовок: выше на мобильной (чтобы не уходил за форму бронирования), по центру на md+ -->
    <div class="hero-title-wrap absolute inset-0 z-10 flex items-start md:items-center justify-center text-center px-5 md:pt-0">
      <h1 ref="titleRef" class="font-display font-500 text-white hero-hidden max-w-1100px"
          style="font-size: clamp(2.2rem, 6vw, 4.4rem); line-height: 1.05">
        Пансионат Радде<br><span class="font-accent italic font-500 text-sand-300 text-[1.2em]">реликтовый лес, горы и&nbsp;гармония</span>
      </h1>
    </div>

    <!-- Content -->
    <div class="hero-content relative z-10 flex flex-col">
      <!-- Spacer to push booking form to bottom -->
      <div class="flex-1"></div>

      <!-- Форма бронирования -->
      <div class="px-5 md:px-8 pb-8 overflow-hidden">
        <div ref="bookingRef" class="max-w-1000px mx-auto bg-white/10 backdrop-blur-md border border-white/15 rounded-3 p-5 md:p-6" style="transform: translateY(140%)">
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 md:gap-4 items-end">

            <!-- Заезд -->
            <div class="md:col-span-2 lg:col-span-3">
              <label class="label-dark">Заезд</label>
              <UiDatePicker v-model="form.checkIn" :min-date="today" placeholder="Выберите дату" />
            </div>

            <!-- Выезд -->
            <div class="md:col-span-2 lg:col-span-3">
              <label class="label-dark">Выезд</label>
              <UiDatePicker v-model="form.checkOut" :min-date="checkOutMin" placeholder="Выберите дату" />
            </div>

            <!-- Взрослые -->
            <div class="md:col-span-1 lg:col-span-2">
              <label class="label-dark">Взрослые</label>
              <div class="counter-wrap">
                <button @click="form.adults = Math.max(1, form.adults - 1)" class="counter-btn" :disabled="form.adults <= 1">&minus;</button>
                <span class="counter-val">{{ form.adults }}</span>
                <button @click="form.adults = Math.min(10, form.adults + 1)" class="counter-btn">+</button>
              </div>
            </div>

            <!-- Дети -->
            <div class="md:col-span-1 lg:col-span-2">
              <label class="label-dark">Дети</label>
              <div class="counter-wrap">
                <button @click="form.children = Math.max(0, form.children - 1)" class="counter-btn" :disabled="form.children <= 0">&minus;</button>
                <span class="counter-val">{{ form.children }}</span>
                <button @click="form.children = Math.min(6, form.children + 1)" class="counter-btn">+</button>
              </div>
            </div>

            <!-- Кнопка -->
            <div class="col-span-2 md:col-span-2 lg:col-span-2">
              <button
                @click="handleBooking"
                class="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-body font-600 text-4 rounded-2 py-3.5 transition-all duration-300 shadow-lg shadow-amber-500/20 cursor-pointer border-none">
                Забронировать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'

const titleRef = ref<HTMLElement>()
const bookingRef = ref<HTMLElement>()

const heroImage = `${base}images/hero/hero-1.jpg?v=2`

const today = computed(() => new Date().toISOString().split('T')[0])

const form = reactive({
  checkIn: today.value,
  checkOut: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d.toISOString().split('T')[0] })(),
  adults: 2,
  children: 0,
})

const checkOutMin = computed(() => {
  if (!form.checkIn) return today.value
  const d = new Date(form.checkIn)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const nights = computed(() => {
  if (!form.checkIn || !form.checkOut) return 0
  const diff = new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

const nightsWord = computed(() => {
  const n = nights.value
  if (n % 10 === 1 && n % 100 !== 11) return 'ночь'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'ночи'
  return 'ночей'
})

watch(() => form.checkIn, (val) => {
  if (val && form.checkOut <= val) {
    const d = new Date(val)
    d.setDate(d.getDate() + 1)
    form.checkOut = d.toISOString().split('T')[0]
  }
})

function handleBooking() {
  // TODO: интеграция с Bnovo — пока неактивна
}

// Wait for preloader to finish before starting hero animations
const preloaderDone = inject<Ref<boolean>>('preloaderDone', ref(true))

function startHeroAnimations() {
  const { gsap } = useGsap()
  const tl = gsap.timeline()
  if (titleRef.value) tl.to(titleRef.value, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
  if (bookingRef.value) {
    tl.to(bookingRef.value, { y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.2')
  }
}

onMounted(() => {
  if (!import.meta.client) return

  if (preloaderDone.value) {
    startHeroAnimations()
  } else {
    watch(preloaderDone, (done) => {
      if (done) startHeroAnimations()
    })
  }
})
</script>

<style scoped>
.counter-wrap {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.counter-wrap:hover {
  border-color: rgba(193, 127, 62, 0.35);
}
.counter-btn {
  width: 40px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  font-weight: 300;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.counter-btn:hover:not(:disabled) {
  color: white;
  background: rgba(255, 255, 255, 0.08);
}
.counter-btn:disabled {
  opacity: 0.25;
  cursor: default;
}
.counter-val {
  flex: 1;
  text-align: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

/* Начальное состояние для GSAP — текст скрыт */
.hero-hidden {
  opacity: 0;
  transform: translateY(20px);
}

/* Высота Hero: фиксируем через CSS var --app-height, которую
   проставляет JS в app.vue один раз при загрузке (и при повороте).
   При скролле iOS Safari меняет 100vh, но --app-height остаётся
   стабильной — никакого прыжка. svh — fallback для современных
   браузеров без JS. 100vh — последний fallback (старые движки). */
.hero-section {
  min-height: 100vh;
  min-height: 100svh;
  min-height: var(--app-height, 100svh);
}
.hero-content {
  min-height: 100vh;
  min-height: 100svh;
  min-height: var(--app-height, 100svh);
}
.hero-title-wrap {
  padding-top: 20vh;
  padding-top: 20svh;
  padding-top: calc(var(--app-height, 100svh) * 0.2);
}
@media (min-width: 768px) {
  .hero-title-wrap {
    padding-top: 0;
  }
}
</style>
