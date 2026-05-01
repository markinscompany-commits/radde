<template>
  <section id="location" class="py-20 md:py-26 bg-sand-50">
    <div class="container">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
        <div class="lg:flex-shrink-0 lg:max-w-[55%]">
          <span class="text-label text-olive-600 mb-4 block">Как добраться</span>
          <h2 ref="titleRef" class="text-h2 font-500 text-sand-900 whitespace-nowrap">
            Мы в&nbsp;самом сердце<br>
            <span class="section-title-accent">Гунибского района</span>
          </h2>
        </div>
        <!-- Actions -->
        <div ref="coordRef" class="flex items-center gap-3 flex-wrap lg:justify-end">
          <a href="https://yandex.ru/maps/-/CPfFnT2P" target="_blank" rel="noopener" class="loc-small-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18.5l-3-1.5-6 3v-13l6-3 6 3 6-3v7.5"/><path d="M9 4v13"/><path d="M15 7v5.5"/><circle cx="19" cy="18" r="3"/></svg>
            Открыть в навигаторе
          </a>
          <button @click="shareLocation" class="loc-share-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
            Поделиться
          </button>
        </div>
      </div>

      <!-- Map with scroll guard -->
      <div ref="mapWrapRef" class="relative rounded-3 overflow-hidden mb-10 shadow-lg map-frame">
        <iframe
          v-if="mapLoaded"
          src="https://yandex.ru/map-widget/v1/?ll=46.936568%2C42.394855&z=14&pt=46.936568%2C42.394855,pm2rdm"
          width="100%"
          style="border:0; display:block; width:100%; height:100%;"
          loading="lazy"
          title="Пансионат Радде на карте"
        ></iframe>
        <div v-else class="w-full bg-sand-200 flex items-center justify-center h-full">
          <span class="font-body text-4 text-sand-700">Загрузка карты...</span>
        </div>
        <div v-if="mapGuardVisible" class="map-guard" @click="dismissGuard" @mouseenter="mapHintVisible = true" @mouseleave="mapHintVisible = false" :class="mapHintVisible ? 'map-guard--hover' : ''">
          <span class="map-hint" :class="mapHintVisible ? 'opacity-100' : 'opacity-0'">
            Нажмите для управления картой
          </span>
        </div>
      </div>

      <!-- Route cards (no tabs, each opens modal) -->
      <div ref="routesRef" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="route in allRoutes" :key="route.id" class="route-card" @click="openRouteDetail(route)">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-2.5 flex items-center justify-center flex-shrink-0" :class="route.iconBg" v-html="route.icon"></div>
            <div class="flex-1 min-w-0">
              <h4 class="font-body text-4.5 font-600 text-sand-900 mb-1.5">{{ route.label }}</h4>
              <p class="text-small text-sand-700 leading-relaxed mb-3">{{ route.summary }}</p>
              <div class="flex flex-wrap items-center gap-3">
                <span v-if="route.time" class="flex items-center gap-1.5 text-small font-600 text-sand-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></svg>
                  {{ route.time }}
                </span>
              </div>
            </div>
            <svg class="text-sand-300 flex-shrink-0 mt-1" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </div>
      </div>

      <!-- Transfer CTA -->
      <div ref="ctaRef" class="mt-10 bg-amber-500/8 border border-amber-400/20 rounded-3 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h4 class="font-display font-500 text-sand-900 mb-1.5" style="font-size: clamp(1.1rem, 2vw, 1.4rem)">Организуем трансфер из аэропорта</h4>
          <p class="text-small text-sand-700">Напишите заранее — встретим с табличкой, опытный водитель знает горные дороги</p>
        </div>
        <button @click="showTransfer = true" class="btn-primary flex-shrink-0 whitespace-nowrap">Заказать трансфер</button>
      </div>

      <!-- Travel tips -->
      <div ref="tipsRef" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        <div v-for="tip in tips" :key="tip.title" class="tip-card">
          <div class="w-9 h-9 rounded-2 bg-olive-100 flex items-center justify-center text-olive-600 mb-3 flex-shrink-0" v-html="tip.icon"></div>
          <h5 class="text-body font-600 text-sand-800 mb-1">{{ tip.title }}</h5>
          <p class="text-small text-sand-700 leading-relaxed">{{ tip.text }}</p>
        </div>
      </div>
    </div>

    <!-- Route detail modal -->
    <Teleport to="body">
      <Transition name="loc-modal">
        <div v-if="detailRoute" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/60 backdrop-blur-sm" @click.self="closeRouteDetail">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-120 max-h-[90vh] overflow-y-auto shadow-2xl z-10 modal-body" data-lenis-prevent>
            <button @click="closeRouteDetail" class="sticky top-4 float-right mr-4 mt-4 w-9 h-9 rounded-full bg-sand-200/90 backdrop-blur-sm hover:bg-sand-300 flex items-center justify-center transition-colors z-30 border-none cursor-pointer" style="margin-bottom: -52px;">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
            <div class="p-7 md:p-9">
              <h3 class="font-display font-500 text-sand-900 mb-6 pr-12" style="font-size: clamp(1.3rem, 2.5vw, 1.6rem)">{{ detailRoute.title }}</h3>
              <div class="route-detail-content" v-html="detailRoute.detailsHtml"></div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Transfer modal -->
    <Teleport to="body">
      <Transition name="loc-modal">
        <div v-if="showTransfer" class="fixed inset-0 z-100 flex items-center justify-center p-5 bg-sand-900/60 backdrop-blur-sm" @click.self="closeTransfer">
          <div class="relative w-full max-w-100 bg-sand-50 rounded-3 shadow-2xl overflow-hidden modal-body" data-lenis-prevent>
            <button @click="closeTransfer" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-sand-200/90 hover:bg-sand-300 flex items-center justify-center transition-colors z-10 border-none cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
            <div v-if="!transferSuccess" class="px-7 md:px-9 pt-10 pb-8">
              <h2 class="font-display font-500 text-sand-900 mb-2" style="font-size: clamp(1.5rem, 3vw, 1.8rem)">Заявка на трансфер</h2>
              <p class="font-body text-4 text-sand-700 leading-relaxed mb-7">Укажите контакты и дату прилёта — мы свяжемся для уточнения деталей</p>
              <form @submit.prevent="submitTransfer" class="flex flex-col gap-4">
                <div>
                  <label class="label-light">Имя</label>
                  <input v-model="transferForm.name" type="text" placeholder="Как к вам обращаться" class="input-light" required />
                </div>
                <div>
                  <label class="label-light">Телефон</label>
                  <input :value="transferForm.phone" @input="handleTransferPhone" @keydown="phoneMaskKeydown" type="tel" placeholder="+7 (900) 000-00-00" class="input-light" required />
                </div>
                <div>
                  <label class="label-light">Дата и рейс <span class="text-sand-600 font-400">(необязательно)</span></label>
                  <input v-model="transferForm.flight" type="text" placeholder="Например: 15 мая, рейс S7 1234" class="input-light" />
                </div>
                <button type="submit" class="btn-primary w-full text-center py-3.5 mt-2" :disabled="transferSubmitting">
                  {{ transferSubmitting ? 'Отправляем...' : 'Отправить заявку' }}
                </button>
                <p class="text-small text-sand-700 text-center">
                  Нажимая кнопку, вы соглашаетесь с <a href="/privacy" class="text-sand-800 underline underline-offset-2 hover:text-amber-600 transition-colors">политикой конфиденциальности</a>
                </p>
              </form>
            </div>
            <div v-else class="px-7 md:px-9 pt-10 pb-8 flex flex-col items-center text-center">
              <div class="w-14 h-14 rounded-full bg-olive-100 text-olive-600 flex items-center justify-center mb-5">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M10 16.5L14.5 21L22 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <h2 class="font-display font-500 text-sand-900 mb-2" style="font-size: clamp(1.5rem, 3vw, 1.8rem)">Заявка отправлена</h2>
              <p class="font-body text-4 text-sand-700 mb-6">Спасибо, {{ transferForm.name }}! Мы свяжемся с вами для уточнения деталей трансфера.</p>
              <button @click="closeTransfer" class="btn-primary px-10 py-3.5">Закрыть</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
const { onInput: phoneMaskInput, onKeydown: phoneMaskKeydown } = usePhoneMask()

interface RouteCard {
  id: string
  label: string
  icon: string
  iconBg: string
  summary: string
  time: string
  title: string
  detailsHtml: string
}

const titleRef = ref<HTMLElement>()
const coordRef = ref<HTMLElement>()
const mapWrapRef = ref<HTMLElement>()
const routesRef = ref<HTMLElement>()
const ctaRef = ref<HTMLElement>()
const tipsRef = ref<HTMLElement>()

const mapLoaded = ref(false)
const mapGuardVisible = ref(true)
const mapHintVisible = ref(false)
const coordsCopied = ref(false)
const detailRoute = ref<RouteCard | null>(null)
const showTransfer = ref(false)
const transferSubmitting = ref(false)
const transferSuccess = ref(false)
const transferForm = reactive({ name: '', phone: '', flight: '' })

let mapGuardTimer: ReturnType<typeof setTimeout> | null = null

function dismissGuard() {
  mapGuardVisible.value = false
  // Re-show after 60s of no interaction
  if (mapGuardTimer) clearTimeout(mapGuardTimer)
  mapGuardTimer = setTimeout(() => { mapGuardVisible.value = true }, 60000)
}

function copyCoords() {
  navigator.clipboard?.writeText('42.394855, 46.936568')
  coordsCopied.value = true
  setTimeout(() => { coordsCopied.value = false }, 2000)
}

async function shareLocation() {
  const shareData = {
    title: 'Пансионат Радде',
    text: 'Пансионат Радде — отдых в горах Дагестана на высоте 1700 метров',
    url: 'https://yandex.ru/maps/-/CPfFnT2P',
  }
  if (navigator.share) {
    await navigator.share(shareData).catch(() => {})
  } else {
    navigator.clipboard?.writeText(shareData.url)
    coordsCopied.value = true
    setTimeout(() => { coordsCopied.value = false }, 2000)
  }
}

function handleTransferPhone(e: Event) {
  transferForm.phone = phoneMaskInput(e)
}

async function submitTransfer() {
  if (!transferForm.name || !transferForm.phone) return
  transferSubmitting.value = true
  await new Promise(r => setTimeout(r, 1200))
  transferSubmitting.value = false
  transferSuccess.value = true
}

function closeTransfer() {
  showTransfer.value = false
  transferSuccess.value = false
  document.body.style.overflow = ''
  useLenis().instance()?.start()
}

watch(showTransfer, (v) => {
  if (v) {
    transferSuccess.value = false
    document.body.style.overflow = 'hidden'
    useLenis().instance()?.stop()
  }
})

const ic = 'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'

const allRoutes: RouteCard[] = [
  {
    id: 'airport', label: 'Из аэропорта',
    icon: `<svg ${ic}><path d="M15.157 11.81l4.83 1.295a2 2 0 1 1-1.036 3.863l-14.489-3.882-1.345-6.572 2.898.776 1.414 2.45 2.898.776-.12-7.279 2.898.777 2.052 7.797"/><path d="M3 21h18"/></svg>`,
    iconBg: 'bg-blue-50 text-blue-500',
    summary: 'Рейсы из Москвы и Петербурга, далее такси или трансфер до пансионата.',
    time: '', title: 'Из аэропорта Махачкалы',
    detailsHtml: `<h4>Авиарейсы в Махачкалу</h4><ul><li>Из Москвы (SVO, VKO, DME): Аэрофлот, S7, Победа, Россия — ~2ч 20мин</li><li>Из Санкт-Петербурга: ~2ч 40мин</li><li>Код аэропорта: MCX / URML</li></ul><h4>Из аэропорта до Гуниба</h4><ul><li>Яндекс Такси (тариф «Межгород»): 3–3.5 часа</li><li>Трансфер через пансионат: водитель встречает с табличкой</li><li>Маршрутка: аэропорт → Северная автостанция → маршрутка до Гуниба (с пересадкой)</li></ul><div class="route-warning">Забронируйте трансфер заранее — в горах Яндекс Такси может не найти машину сразу.</div><h4>Альтернатива: поезд</h4><p>Поезд из Москвы до Махачкалы — ~40 часов (вокзал Махачкала-1), далее такси или маршрутка.</p>`,
  },
  {
    id: 'car', label: 'На автомобиле',
    icon: `<svg ${ic}><path d="M5 17a2 2 0 104 0 2 2 0 00-4 0"/><path d="M15 17a2 2 0 104 0 2 2 0 00-4 0"/><path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 012 2v4h-2m-4 0h-6m-6-6h15m-6 0v-5"/></svg>`,
    iconBg: 'bg-amber-50 text-amber-600',
    summary: 'По трассе Р217 через Буйнакск. Заправьтесь до Гуниба — там заправки нет.',
    time: '', title: 'На своём автомобиле',
    detailsHtml: `<h4>Пошаговый маршрут</h4><ol><li><strong>Махачкала → Буйнакск</strong> (трасса Р217)<br>Заправки по пути. Обязательно заправьтесь — в Гунибе заправки нет!</li><li><strong>Буйнакск → Унцукуль</strong> (трасса Р167)<br>По пути: самый длинный автотоннель России (~4 км), Ирганайское водохранилище, Гунибская ГЭС.</li><li><strong>Поворот у с. Унцукуль → Гуниб</strong><br>Последние 10 км — горный серпантин. Скорость 20–30 км/ч. Дорога асфальтированная, проходима на легковом авто.</li><li><strong>Гуниб → Верхний Гуниб → Пансионат Радде</strong></li></ol><h4>Навигация</h4><ul><li>Яндекс Навигатор и Google Maps корректно ведут</li><li>Координаты: 42.394855, 46.936568</li><li>Искать: «Пансионат Радде» или «Верхний Гуниб»</li></ul><div class="route-warning">На серпантине встречаются животные — коровы, овцы, лошади. Тормозите плавно. Зимой нужны цепи или полный привод.</div>`,
  },
  {
    id: 'bus', label: 'Маршрутка',
    icon: `<svg ${ic}><path d="M6 17a2 2 0 104 0 2 2 0 00-4 0"/><path d="M14 17a2 2 0 104 0 2 2 0 00-4 0"/><path d="M4 17h-2v-11a1 1 0 011-1h14a5 5 0 015 5v7h-2m-4 0h-4m-8-6h16m-10-4h4"/></svg>`,
    iconBg: 'bg-olive-100 text-olive-600',
    summary: 'С Северной автостанции Махачкалы ежедневно с утра.',
    time: '', title: 'Маршрутка из Махачкалы',
    detailsHtml: `<h4>Отправление</h4><ul><li>Северная автостанция, пр. Акушинского, 100</li><li>Маршрутки до Гуниба — ежедневно, с раннего утра (~6:30–9:00)</li><li>Расписание нефиксированное — уходят по наполнению</li></ul><h4>Время в пути</h4><ul><li>Прямая маршрутка: около 3 часов</li><li>С пересадкой: Махачкала → Буйнакск (~1.5 ч) → Гуниб (~2 ч)</li></ul><div class="route-warning">Конечная остановка — с. Гуниб (центр). До пансионата ещё 2–3 км — можем забрать. Не все маршрутки идут до Верхнего Гуниба — уточняйте у водителя.</div>`,
  },
  {
    id: 'taxi', label: 'Такси / Трансфер',
    icon: `<svg ${ic}><path d="M5 17a2 2 0 104 0 2 2 0 00-4 0"/><path d="M15 17a2 2 0 104 0 2 2 0 00-4 0"/><path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 012 2v4h-2m-4 0h-6m-6-6h15m-6 0v-5"/><path d="M9 5l1-2h4l1 2"/></svg>`,
    iconBg: 'bg-red-50 text-red-400',
    summary: 'Яндекс Такси, местные службы или трансфер через пансионат.',
    time: '', title: 'Такси и трансфер',
    detailsHtml: `<h4>Яндекс Такси</h4><ul><li>Работает в Махачкале, тариф «Межгород»</li><li>В горах приложение может не найти машину сразу — водители связываются по телефону</li></ul><h4>Местные службы такси</h4><ul><li>Такси «Гуниб»: +7 (8722) 51-55-77</li><li>Дополнительный: +7 (963) 429-05-55</li><li>Знают дорогу, регулярно ездят по маршруту</li></ul><h4>Трансфер через пансионат</h4><ul><li>Бронировать минимум за сутки</li><li>Встреча с табличкой в аэропорту</li><li>Детское кресло по запросу</li><li>Комфортный автомобиль, опытный водитель</li></ul>`,
  },
]

const tips = [
  {
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18l.01 0"/><path d="M9.172 15.172a4 4 0 015.656 0"/><path d="M6.343 12.343a8 8 0 0111.314 0"/><path d="M3.515 9.515c4.686-4.687 12.284-4.687 17 0"/></svg>`,
    title: 'Связь',
    text: 'МТС и Мегафон работают. Скачайте офлайн-карты заранее.',
  },
  {
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"/><path d="M16 3v4M8 3v4M4 11h16"/></svg>`,
    title: 'Деньги',
    text: 'Возьмите 2–5 тыс. ₽ наличными — в горах карты не везде.',
  },
  {
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18v-6a6 6 0 016-6h2a6 6 0 016 6v6a3 3 0 01-3 3h-8a3 3 0 01-3-3"/><path d="M10 6v-1a2 2 0 114 0v1"/><path d="M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4"/><path d="M11 10h2"/></svg>`,
    title: 'Одежда',
    text: 'Даже летом вечером прохладно — берите тёплый слой и ветровку.',
  },
  {
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    title: '3 часа в пути',
    text: 'От Махачкалы до пансионата — около трёх часов на машине.',
  },
]

function openRouteDetail(route: RouteCard) {
  detailRoute.value = route
  document.body.style.overflow = 'hidden'
  useLenis().instance()?.stop()
}

function closeRouteDetail() {
  detailRoute.value = null
  document.body.style.overflow = ''
  useLenis().instance()?.start()
}

onMounted(() => {
  if (!import.meta.client) return

  // Lazy load map when section enters viewport
  if (mapWrapRef.value) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        mapLoaded.value = true
        observer.disconnect()
      }
    }, { rootMargin: '200px' })
    observer.observe(mapWrapRef.value)
  }
})
</script>

<style scoped>
.map-frame {
  height: 320px;
}
@media (min-width: 768px) {
  .map-frame {
    height: 380px;
  }
}
@media (min-width: 1024px) {
  .map-frame {
    height: 420px;
  }
}

.map-hint {
  background: rgba(44, 36, 22, 0.85);
  color: #FAF6F0;
  padding: 10px 20px;
  border-radius: 10px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 500;
  pointer-events: none;
  transition: opacity 0.25s;
}

.loc-small-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #6B5B4A;
  background: #FAF6F0;
  border: 1px solid #E8D5B7;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}
.loc-small-btn:hover {
  background: #F0E6D6;
  border-color: #C1A376;
  color: #2C2416;
}

.loc-share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: #C17F3E;
  border: 1px solid #A66B32;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.loc-share-btn:hover {
  background: #A66B32;
}

.map-guard {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease;
}
.map-guard--hover {
  background: rgba(0, 0, 0, 0.45);
}

.route-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 14px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}
@media (min-width: 640px) {
  .route-card {
    padding: 20px;
  }
}
.route-card:hover {
  border-color: #E8D5B7;
  box-shadow: 0 4px 16px rgba(44, 36, 22, 0.06);
}

.tip-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 14px;
  padding: 16px;
}
@media (min-width: 640px) {
  .tip-card {
    padding: 20px;
  }
}

/* Route detail modal content styling */
:deep(.route-detail-content) h4 {
  font-family: 'Manrope', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.15rem;
  color: #2C2416;
  margin: 1.5rem 0 0.5rem;
}
:deep(.route-detail-content) h4:first-child {
  margin-top: 0;
}
:deep(.route-detail-content) ul,
:deep(.route-detail-content) ol {
  padding-left: 1.2rem;
  margin: 0 0 0.5rem;
}
:deep(.route-detail-content) li {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  color: #4A3F30;
  line-height: 1.6;
  margin-bottom: 6px;
}
:deep(.route-detail-content) p {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  color: #4A3F30;
  line-height: 1.6;
  margin: 0.5rem 0;
}
:deep(.route-detail-content) strong {
  color: #2C2416;
  font-weight: 600;
}
:deep(.route-detail-content) .route-warning {
  background: rgba(212, 148, 74, 0.1);
  border: 1px solid rgba(212, 148, 74, 0.25);
  border-radius: 10px;
  padding: 14px 18px;
  margin: 1rem 0;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #8B5728;
  line-height: 1.5;
}

.loc-modal-enter-active { transition: opacity 0.3s ease; }
.loc-modal-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.loc-modal-leave-active { transition: opacity 0.2s ease; }
.loc-modal-leave-active > div:last-child { transition: transform 0.2s ease, opacity 0.2s ease; }
.loc-modal-enter-from { opacity: 0; }
.loc-modal-enter-from > div:last-child { opacity: 0; transform: scale(0.95) translateY(10px); }
.loc-modal-leave-to { opacity: 0; }
.loc-modal-leave-to > div:last-child { opacity: 0; transform: scale(0.97); }
</style>
