<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="room" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/60 backdrop-blur-sm" @click.self="close">
        <div class="relative bg-sand-50 rounded-3 w-full max-w-180 max-h-[90vh] overflow-hidden shadow-2xl z-10 modal-body" data-lenis-prevent>
          <!-- Кнопка закрытия — absolute поверх корпуса, не зависит от скролла внутри -->
          <button @click="close" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-sand-200/90 backdrop-blur-sm hover:bg-sand-300 flex items-center justify-center transition-colors z-30 border-none cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>

          <!-- Скролл-обёртка: фото примыкает к верху корпуса (без видимого фона sand-50 над фото) -->
          <div class="modal-scroll max-h-[90vh] overflow-y-auto">
          <!-- Modal gallery -->
          <div class="relative aspect-16/9 overflow-hidden bg-sand-200 cursor-pointer"
               @click="openLightbox(photoIndex)">
            <UiPicture
              v-for="(src, pi) in room.images"
              :key="src"
              :src="src"
              sizes="(min-width: 768px) 720px, 100vw"
              :alt="`${room.name} — фото ${pi + 1}`"
              class="absolute inset-0 w-full h-full object-cover room-photo-transition"
              :class="photoIndex === pi ? 'opacity-100 z-2' : 'opacity-0 z-1'"
              loading="lazy"
              decoding="async"
            />
            <div class="absolute top-4 left-4 z-10" @click.stop>
              <button @click="openLightbox(photoIndex)"
                      class="media-arrow"
                      title="Открыть на весь экран">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M7 4.5v5M4.5 7h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3"
                 @click.stop>
              <div v-if="room.images.length > 1" class="flex items-center gap-1.5">
                <button @click="prevPhoto" class="media-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button @click="nextPhoto" class="media-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
              <div v-if="room.images.length > 1" class="flex items-center gap-1.5 ml-auto">
                <button v-for="(_, pi) in room.images" :key="pi"
                        @click="photoIndex = pi"
                        class="media-dot"
                        :class="photoIndex === pi ? 'bg-white w-5' : 'bg-white/50 w-2'">
                </button>
              </div>
            </div>
          </div>

          <div class="p-6 md:p-8">
            <h3 class="font-display font-500 text-7 text-sand-900 mb-4">{{ room.name }}</h3>

            <div class="flex flex-wrap gap-2 mb-6">
              <span class="rdm-spec">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M2 7h14M7 2v14" stroke="currentColor" stroke-width="1.3"/></svg>
                {{ room.area }} м²
              </span>
              <span class="rdm-spec">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="8" width="15" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3 8V6a3 3 0 016 0v2M9 8V6a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 11.5h15" stroke="currentColor" stroke-width="1.3"/></svg>
                {{ room.bed }}
              </span>
              <span class="rdm-spec">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5.5" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                до {{ room.guests }} гостей
              </span>
              <span class="rdm-spec">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><path d="M2 13c2-4 4.5-7 7-7s5 2 7 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M1 15h16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="13" cy="4" r="2" stroke="currentColor" stroke-width="1.3"/></svg>
                {{ room.view }}
              </span>
            </div>

            <p class="font-body text-4 text-sand-800 leading-relaxed mb-6">{{ room.fullDescription }}</p>

            <div v-if="room.note" class="flex items-start gap-2.5 bg-amber-400/8 border border-amber-400/20 rounded-2 px-4 py-3 mb-8">
              <svg class="flex-shrink-0 mt-0.5 text-amber-500" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              <span class="font-body text-4 text-amber-700 font-500">{{ room.note }}</span>
            </div>

            <!-- ========= ЦЕНЫ ПО СОСТАВУ ========= -->
            <section class="rdm-section">
              <div class="rdm-section__head">
                <h4 class="rdm-section__title">Цена за ночь</h4>
                <span v-if="hasLiveVariants" class="rdm-section__hint">по&nbsp;составу гостей · обновляется из&nbsp;PMS</span>
                <span v-else class="rdm-section__hint">от&nbsp;{{ fallbackPriceLabel }} ₽ · точная цена&nbsp;— на&nbsp;выбранные даты</span>
              </div>

              <div v-if="hasLiveVariants" class="rdm-slots">
                <div
                  v-for="(v, idx) in displayVariants"
                  :key="idx"
                  class="rdm-slot"
                  :class="{ 'rdm-slot--active': isActiveVariant(v) }"
                >
                  <div class="rdm-slot__people">
                    <span class="rdm-slot__icons" aria-hidden="true">
                      <svg v-for="i in v.adults" :key="`a${i}`" width="16" height="16" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="5.5" r="2.7" stroke="currentColor" stroke-width="1.4"/>
                        <path d="M3.2 16c0-3.2 2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                      </svg>
                      <svg v-for="i in v.children" :key="`c${i}`" width="13" height="13" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="5.5" r="2.4" stroke="currentColor" stroke-width="1.4"/>
                        <path d="M4 16c0-2.7 2.2-5 5-5s5 2.3 5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                      </svg>
                    </span>
                    <span class="rdm-slot__label">{{ formatComposition(v.adults, v.children) }}</span>
                  </div>
                  <span class="rdm-slot__price">{{ fmtPrice(v.price_per_night) }} ₽</span>
                </div>
              </div>

              <div v-else class="rdm-fallback-price">
                <span class="rdm-fallback-price__big">от {{ fallbackPriceLabel }} ₽</span>
                <span class="rdm-fallback-price__unit">/ ночь</span>
              </div>
            </section>

            <!-- ========= УЖЕ ВКЛЮЧЕНО ========= -->
            <section class="rdm-section">
              <div class="rdm-section__head">
                <h4 class="rdm-section__title">Уже включено в&nbsp;стоимость</h4>
                <span class="rdm-section__hint">платить отдельно не&nbsp;нужно</span>
              </div>
              <ul class="rdm-included">
                <li v-for="item in includedAmenities" :key="item.label">
                  <span class="rdm-included__icon" v-html="item.icon"></span>
                  <span class="rdm-included__text">
                    <span class="rdm-included__title">{{ item.label }}</span>
                    <span v-if="item.desc" class="rdm-included__desc">{{ item.desc }}</span>
                  </span>
                </li>
              </ul>
            </section>

            <!-- ========= ОТМЕНА И ПРЕДОПЛАТА ========= -->
            <section class="rdm-section">
              <div class="rdm-section__head">
                <h4 class="rdm-section__title">Отмена и&nbsp;предоплата</h4>
              </div>

              <div class="rdm-prepay">
                <div class="rdm-prepay__badge">15%</div>
                <div class="rdm-prepay__body">
                  <span class="rdm-prepay__title">Аванс 15% закрепит&nbsp;бронь сразу</span>
                  <span class="rdm-prepay__desc">Без&nbsp;звонков и&nbsp;ожидания подтверждения. Оплата проходит через защищённый платёжный шлюз. Остаток&nbsp;— наличными или&nbsp;переводом при&nbsp;заселении.</span>
                </div>
              </div>

              <ul class="rdm-cancel">
                <li>
                  <span class="rdm-cancel__when">Бесплатно</span>
                  <span class="rdm-cancel__cond">Отмена за&nbsp;<b>7&nbsp;дней</b> и&nbsp;раньше до&nbsp;заезда</span>
                </li>
                <li>
                  <span class="rdm-cancel__when rdm-cancel__when--mid">−1&nbsp;ночь</span>
                  <span class="rdm-cancel__cond">Отмена за&nbsp;<b>3–7&nbsp;дней</b>&nbsp;— удерживаем стоимость первой ночи</span>
                </li>
                <li>
                  <span class="rdm-cancel__when rdm-cancel__when--hard">Без&nbsp;возврата</span>
                  <span class="rdm-cancel__cond">Отмена менее чем за&nbsp;<b>3&nbsp;дня</b> или&nbsp;неявка</span>
                </li>
              </ul>

              <p class="rdm-cancel__note">При&nbsp;форс-мажоре (закрытие дорог, отмена авиарейсов, болезнь с&nbsp;подтверждением) пересмотрим условия индивидуально.</p>
            </section>
          </div>

          <!-- Sticky footer с кнопкой -->
          <div class="rdm-footer">
            <div class="rdm-footer__price">
              <span class="rdm-footer__price-amount">{{ footerPrice.amount }} ₽</span>
              <span class="rdm-footer__price-meta">{{ footerPrice.meta }}</span>
            </div>
            <button v-if="action === 'select'" type="button" class="rdm-footer__btn" @click="onSelect">
              {{ selectLabel || 'Выбрать номер' }}
            </button>
            <a v-else :href="bookHref" class="rdm-footer__btn">Забронировать</a>
          </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Fullscreen lightbox -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="lightbox.open" class="fixed inset-0 z-200 bg-black/95 flex items-center justify-center" @click.self="closeLightbox">
        <button @click="closeLightbox" class="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>

        <UiPicture
          :key="lightbox.index"
          :src="lightbox.images[lightbox.index]"
          sizes="90vw"
          :alt="`Фото ${lightbox.index + 1}`"
          class="max-w-[90vw] max-h-[90vh] object-contain select-none lightbox-img"
          @wheel.prevent="handleLightboxZoom"
          :style="{ transform: `scale(${lightbox.zoom})` }"
        />

        <button v-if="lightbox.images.length > 1"
                @click="lightboxPrev"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors z-20">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12 3L6 9l6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <button v-if="lightbox.images.length > 1"
                @click="lightboxNext"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors z-20">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 3l6 6-6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          <button v-for="(_, pi) in lightbox.images" :key="pi"
                  @click="lightbox.index = pi; lightbox.zoom = 1"
                  class="media-dot"
                  :class="lightbox.index === pi ? 'bg-white w-5' : 'bg-white/40 w-2'">
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { RoomDef } from '~/composables/useRooms'
import type { PriceVariant } from '~~/shared/bnovo'

/**
 * Live-данные о доступности и ценах из PMS.
 * Передаются с /booking, где гость уже выбрал даты и состав. На главной
 * странице availability обычно null или это снимок «сегодня→завтра» для
 * 2 взрослых — модалка покажет fallback-цену.
 */
type AvailabilitySnapshot = {
  pricePerNight?: number | null
  priceVariants?: PriceVariant[]
  /** Сколько ночей выбрано — для расчёта итога в футере */
  nights?: number | null
  /** Текущий состав гостей (для подсветки активного слота) */
  adults?: number | null
  children?: number | null
} | null | undefined

const props = withDefaults(defineProps<{
  /** Если null — модалка закрыта */
  room: RoomDef | null
  /** 'select' — кнопка «Выбрать номер» эмитит select; 'book' — ссылка на /booking */
  action?: 'select' | 'book'
  /** Подпись на кнопке для action='select' */
  selectLabel?: string
  /** Live-цены/доступность из useAvailableRooms */
  availability?: AvailabilitySnapshot
}>(), {
  action: 'book',
  availability: null,
})

const emit = defineEmits<{
  close: []
  select: [room: RoomDef]
}>()

const base = useRuntimeConfig().app.baseURL || '/'
const bookHref = computed(() => props.room?.id ? `${base}booking?room=${props.room.id}` : `${base}booking`)

const photoIndex = ref(0)
const lightbox = reactive({
  open: false,
  images: [] as string[],
  index: 0,
  zoom: 1,
})

const bodyLock = useBodyLock()

/**
 * PMS иногда отдаёт несколько подкатегорий с одинаковым составом гостей,
 * но разной ценой (например VIP «обычный» и VIP «премиум» оба для 1 взрослого).
 * Гостю показываем по одной строке на состав — берём минимальную цену
 * (Bnovo при бронировании автоматически выберет дешёвый вариант).
 */
const displayVariants = computed<PriceVariant[]>(() => {
  const raw = props.availability?.priceVariants ?? []
  const byKey = new Map<string, PriceVariant>()
  for (const v of raw) {
    const key = `${v.adults}-${v.children}`
    const existing = byKey.get(key)
    if (!existing || v.price_per_night < existing.price_per_night) {
      byKey.set(key, v)
    }
  }
  return [...byKey.values()].sort(
    (a, b) =>
      (a.adults + a.children) - (b.adults + b.children) ||
      a.price_per_night - b.price_per_night,
  )
})
const hasLiveVariants = computed(() => displayVariants.value.length > 0)

const fallbackPriceLabel = computed(() => props.room?.price ?? '—')

function formatComposition(adults: number, children: number): string {
  const parts: string[] = []
  if (adults > 0) parts.push(`${adults} ${pluralize(adults, ['взрослый', 'взрослых', 'взрослых'])}`)
  if (children > 0) parts.push(`${children} ${pluralize(children, ['ребёнок', 'ребёнка', 'детей'])}`)
  return parts.join(' + ')
}

function pluralize(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1]
  return forms[2]
}

function isActiveVariant(v: PriceVariant): boolean {
  const a = props.availability?.adults
  const c = props.availability?.children
  if (typeof a !== 'number' || typeof c !== 'number') return false
  return v.adults === a && v.children === c
}

const footerPrice = computed(() => {
  const av = props.availability
  if (av && typeof av.pricePerNight === 'number' && av.pricePerNight > 0) {
    if (av.nights && av.nights > 1) {
      const total = av.pricePerNight * av.nights
      return {
        amount: fmtPrice(total),
        meta: `${fmtPrice(av.pricePerNight)} ₽ × ${av.nights} ${pluralize(av.nights, ['ночь', 'ночи', 'ночей'])}`,
      }
    }
    return {
      amount: fmtPrice(av.pricePerNight),
      meta: '/ ночь · цена на выбранные даты',
    }
  }
  return {
    amount: `от ${fallbackPriceLabel.value}`,
    meta: '/ ночь · уточняется при выборе дат',
  }
})

// Округляем дробные цены при отображении (PMS отдаёт точные float'ы для
// per-night, расчёт total делается умножением → итог точный, без потери копеек).
function fmtPrice(n: number): string {
  return Math.round(n).toLocaleString('ru-RU')
}

const includedAmenities = [
  {
    label: 'Завтрак',
    desc: 'Каши, выпечка, сыры, чай из горных трав',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13h16a8 8 0 0 1 -8 8a8 8 0 0 1 -8 -8" /><path d="M5 13a7 7 0 0 1 14 0" /><path d="M19 13h2" /><path d="M3 13h2" /><path d="M12 4v-1" /><path d="M9 6c-1 -1 -1 -2 0 -3" /><path d="M15 6c-1 -1 -1 -2 0 -3" /></svg>',
  },
  {
    label: 'Wi-Fi',
    desc: 'Стабильно, хватает на видеозвонки',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18l.01 0" /><path d="M9.172 15.172a4 4 0 0 1 5.656 0" /><path d="M6.343 12.343a8 8 0 0 1 11.314 0" /><path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0" /></svg>',
  },
  {
    label: 'Парковка',
    desc: 'Закрытая, видеонаблюдение круглосуточно',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 16v-8h4a2 2 0 0 1 0 4h-4" /></svg>',
  },
  {
    label: 'Отопление',
    desc: 'Зимой в номере тепло, можно регулировать',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l0 1.5" /><path d="M12 19.5l0 1.5" /><path d="M3 12l1.5 0" /><path d="M19.5 12l1.5 0" /><path d="M5.6 5.6l1.1 1.1" /><path d="M17.3 17.3l1.1 1.1" /><path d="M5.6 18.4l1.1 -1.1" /><path d="M17.3 6.7l1.1 -1.1" /><circle cx="12" cy="12" r="3" /></svg>',
  },
  {
    label: 'Бельё и полотенца',
    desc: 'Свежий комплект при заселении и каждые 3 дня',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l3 -1l4 1l4 -1l4 1l3 -1v13l-3 1l-4 -1l-4 1l-4 -1l-3 1z" /><path d="M6 6v14" /><path d="M10 7v13" /><path d="M14 7v13" /><path d="M18 6v14" /></svg>',
  },
  {
    label: 'Горный воздух',
    desc: '1 800 м над уровнем моря, реликтовый лес',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19l4 -6l3 4l4 -7l7 9z" /><circle cx="7" cy="6" r="2" /></svg>',
  },
]

watch(() => props.room, (val, prev) => {
  if (val && val !== prev) {
    photoIndex.value = 0
    if (import.meta.client) {
      bodyLock.lock()
      useLenis().instance()?.stop()
    }
  } else if (!val && prev) {
    if (import.meta.client) {
      bodyLock.unlock()
      useLenis().instance()?.start()
    }
  }
})

function close() { emit('close') }

function onSelect() {
  if (props.room) emit('select', props.room)
}

function nextPhoto() {
  if (!props.room) return
  photoIndex.value = (photoIndex.value + 1) % props.room.images.length
}
function prevPhoto() {
  if (!props.room) return
  photoIndex.value = (photoIndex.value - 1 + props.room.images.length) % props.room.images.length
}

function openLightbox(startIndex: number) {
  if (!props.room) return
  lightbox.images = props.room.images
  lightbox.index = startIndex
  lightbox.zoom = 1
  lightbox.open = true
  // body уже залочен (модалка номера открыта) — но lock count учтёт повторный вызов
  if (import.meta.client) {
    bodyLock.lock()
    useLenis().instance()?.stop()
  }
}

function closeLightbox() {
  lightbox.open = false
  if (import.meta.client) {
    bodyLock.unlock()
    if (!props.room) useLenis().instance()?.start()
  }
}

function lightboxNext() {
  lightbox.index = (lightbox.index + 1) % lightbox.images.length
  lightbox.zoom = 1
}
function lightboxPrev() {
  lightbox.index = (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length
  lightbox.zoom = 1
}

function handleLightboxZoom(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -0.15 : 0.15
  lightbox.zoom = Math.min(3, Math.max(0.5, lightbox.zoom + delta))
}

if (import.meta.client) {
  const onKey = (e: KeyboardEvent) => {
    if (lightbox.open) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') lightboxPrev()
      if (e.key === 'ArrowRight') lightboxNext()
    } else if (props.room && e.key === 'Escape') {
      close()
    }
  }
  onMounted(() => document.addEventListener('keydown', onKey))
  onUnmounted(() => document.removeEventListener('keydown', onKey))
}
</script>

<style scoped>
.room-photo-transition { transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.lightbox-img { transition: transform 0.2s ease; }

.lightbox-enter-active { transition: opacity 0.3s ease; }
.lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }

.modal-enter-active { transition: opacity 0.3s ease; }
.modal-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-leave-active > div:last-child { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from { opacity: 0; }
.modal-enter-from > div:last-child { opacity: 0; transform: scale(0.95) translateY(10px); }
.modal-leave-to { opacity: 0; }
.modal-leave-to > div:last-child { opacity: 0; transform: scale(0.97); }

/* ===== spec chips (4 параметра номера) ===== */
.rdm-spec {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  color: #4A3F2E;
  background: #FAF6F0;
  border: 1px solid #E8DCC8;
  border-radius: 999px;
  padding: 5px 12px;
}
.rdm-spec svg { color: #8B6F47; flex-shrink: 0; }

/* ===== generic section header ===== */
.rdm-section { margin-bottom: 24px; }
.rdm-section:last-of-type { margin-bottom: 0; }
.rdm-section__head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #E8DCC8;
}
.rdm-section__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 17px;
  color: #2C2416;
  margin: 0;
}
.rdm-section__hint {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  color: #8B7E6A;
}

/* ===== price slots (live из PMS) ===== */
.rdm-slots {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
@media (min-width: 560px) { .rdm-slots { grid-template-columns: 1fr 1fr; } }
.rdm-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  background: white;
  border: 1px solid #EFE5D2;
  border-radius: 12px;
  transition: border-color 0.18s, background 0.18s, transform 0.18s;
}
.rdm-slot:hover { border-color: #C9B68F; }
.rdm-slot--active {
  border-color: #C17F3E;
  background: #FFF6E8;
  box-shadow: 0 0 0 3px rgba(193, 127, 62, 0.12);
}
.rdm-slot__people {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.rdm-slot__icons {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #8B6F47;
  flex-shrink: 0;
}
.rdm-slot__label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  color: #2C2416;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rdm-slot__price {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #2C2416;
  white-space: nowrap;
}
.rdm-slot--active .rdm-slot__price { color: #B5783A; }

.rdm-fallback-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 12px 14px;
  background: white;
  border: 1px dashed #D6CDBE;
  border-radius: 12px;
}
.rdm-fallback-price__big {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 22px;
  color: #2C2416;
}
.rdm-fallback-price__unit {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  color: #6B5B4A;
}

/* ===== «уже включено» список ===== */
.rdm-included {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
@media (min-width: 560px) { .rdm-included { grid-template-columns: 1fr 1fr; } }
.rdm-included li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #F4F6EE;
  border: 1px solid rgba(91, 122, 58, 0.18);
  border-radius: 10px;
}
.rdm-included__icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: white;
  color: #5B7A3A;
  border: 1px solid rgba(91, 122, 58, 0.22);
}
.rdm-included__text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.rdm-included__title {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2C2416;
}
.rdm-included__desc {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  color: #6B5B4A;
  line-height: 1.4;
}

/* ===== аванс 15% ===== */
.rdm-prepay {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #FFF6E8, #FBE8C9);
  border: 1px solid #E8C887;
  border-radius: 12px;
  margin-bottom: 14px;
}
.rdm-prepay__badge {
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: #C17F3E;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 18px;
  box-shadow: 0 6px 14px rgba(193, 127, 62, 0.32);
}
.rdm-prepay__body { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.rdm-prepay__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 15px;
  color: #2C2416;
}
.rdm-prepay__desc {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: #4A3F2E;
  line-height: 1.45;
}

/* ===== условия отмены ===== */
.rdm-cancel {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rdm-cancel li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  background: white;
  border: 1px solid #EFE5D2;
  border-radius: 10px;
}
.rdm-cancel__when {
  flex-shrink: 0;
  min-width: 100px;
  text-align: center;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(91, 122, 58, 0.16);
  color: #3D5424;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
}
.rdm-cancel__when--mid { background: rgba(193, 127, 62, 0.18); color: #8C5520; }
.rdm-cancel__when--hard { background: rgba(181, 72, 58, 0.16); color: #8E2A20; }
.rdm-cancel__cond {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  color: #4A3F2E;
  line-height: 1.4;
}
.rdm-cancel__cond b { font-weight: 600; color: #2C2416; }
.rdm-cancel__note {
  margin: 10px 0 0;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  color: #6B5B4A;
  line-height: 1.45;
}

/* ===== sticky footer внутри модалки ===== */
.rdm-footer {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 24px;
  background: rgba(250, 245, 235, 0.97);
  backdrop-filter: blur(8px);
  border-top: 1px solid #E8DCC8;
  z-index: 5;
}
@media (min-width: 768px) { .rdm-footer { padding: 16px 32px; } }
.rdm-footer__price { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.rdm-footer__price-amount {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 22px;
  color: #2C2416;
}
.rdm-footer__price-meta {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  color: #6B5B4A;
}
.rdm-footer__btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  color: white;
  background: #C17F3E;
  border: 1.5px solid #C17F3E;
  border-radius: 10px;
  padding: 11px 22px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}
.rdm-footer__btn:hover {
  background: #A86A2D;
  border-color: #A86A2D;
}
</style>
