<template>
  <div>
    <UiAppHeader solid @book="scrollToTop" />

    <!-- Hero strip -->
    <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-36 pb-8 md:pb-10">
      <img :src="`${base}images/hero/hero-1.jpg`" alt="" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-sand-900/82"></div>

      <div class="container relative z-10">
        <UiBreadcrumbs
          variant="dark"
          :items="[
            { label: 'Главная', href: base },
            { label: 'Бронирование' },
          ]"
          class="mb-5"
        />
        <div class="flex items-baseline justify-between gap-6 flex-wrap">
          <div>
            <span class="text-label text-amber-400 mb-3 block">Бронирование</span>
            <h1 class="text-h1 text-white">
              Ваш <span class="section-title-accent text-sand-300">отдых</span>
            </h1>
          </div>
          <p class="font-body text-4 text-white/70 max-w-110">
            Соберите бронь — менеджер свяжется с&nbsp;вами в&nbsp;течение 15&nbsp;минут, чтобы подтвердить детали.
          </p>
        </div>
      </div>
    </section>

    <!-- Checkout layout -->
    <section class="bg-sand-50 py-10 md:py-14">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          <!-- LEFT: form sections -->
          <div class="lg:col-span-8 space-y-5 md:space-y-6">

            <!-- ============ 1. DATES + GUESTS ============ -->
            <div class="checkout-card">
              <div class="checkout-head">
                <span class="checkout-num">1</span>
                <h2 class="checkout-title">Даты и&nbsp;гости</h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label class="label-light">Заезд</label>
                  <UiDatePicker v-model="state.arrival" variant="light" :min-date="todayIso" placeholder="Выберите дату" />
                </div>
                <div>
                  <label class="label-light">Выезд</label>
                  <UiDatePicker v-model="state.departure" variant="light" :min-date="checkOutMin" placeholder="Выберите дату" />
                </div>
                <div>
                  <label class="label-light">Взрослые</label>
                  <div class="counter-light">
                    <button type="button" @click="state.adults = Math.max(1, state.adults - 1)" class="counter-light__btn" :disabled="state.adults <= 1">&minus;</button>
                    <span class="counter-light__val">{{ state.adults }}</span>
                    <button type="button" @click="state.adults = Math.min(10, state.adults + 1)" class="counter-light__btn">+</button>
                  </div>
                </div>
                <div>
                  <label class="label-light">Дети <span class="text-3.5 text-sand-500 font-400">до 12 лет</span></label>
                  <div class="counter-light">
                    <button type="button" @click="state.children = Math.max(0, state.children - 1)" class="counter-light__btn" :disabled="state.children <= 0">&minus;</button>
                    <span class="counter-light__val">{{ state.children }}</span>
                    <button type="button" @click="state.children = Math.min(6, state.children + 1)" class="counter-light__btn">+</button>
                  </div>
                </div>
              </div>
              <div v-if="nights > 0" class="checkout-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 7v5l3 3"/></svg>
                <span>{{ formattedRange }} · <b>{{ nights }} {{ nightsWord }}</b> · {{ guestSummary }}</span>
              </div>
            </div>

            <!-- ============ 2. ROOM ============ -->
            <div class="checkout-card">
              <div class="checkout-head">
                <span class="checkout-num">2</span>
                <h2 class="checkout-title">Выберите <span class="section-title-accent text-amber-600">номер</span></h2>
              </div>

              <div v-if="!canShowRooms" class="checkout-empty">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>
                <span>Сначала выберите даты заезда и&nbsp;выезда</span>
              </div>

              <div v-else-if="availLoading" class="checkout-loading">
                <div class="quiz-spinner"></div>
                <span>Проверяем доступность номеров…</span>
              </div>

              <div v-else-if="availableRooms.length === 0" class="checkout-empty">
                Не удалось загрузить номера. Попробуйте обновить страницу.
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div
                  v-for="r in availableRooms"
                  :key="r.id"
                  class="room-pick"
                  :class="{
                    'room-pick--active': state.roomId === r.id,
                    'room-pick--unfit': !r.fitsGuests,
                  }"
                >
                  <div class="room-pick__photo">
                    <img :src="r.images[0]" :alt="r.name" loading="lazy" />
                    <span v-if="state.roomId === r.id" class="room-pick__check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="room-pick__avail" :class="r.availableCount <= 2 ? 'room-pick__avail--low' : ''">
                      <svg v-if="r.availableCount <= 2" width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                      Свободно: {{ r.availableCount }} из {{ r.totalCount }}
                    </span>
                  </div>
                  <div class="room-pick__body">
                    <div class="flex items-baseline justify-between gap-3 mb-2">
                      <h3 class="font-display font-500 text-sand-900 text-4.5">{{ r.name }}</h3>
                      <div class="text-right whitespace-nowrap">
                        <span class="font-display font-500 text-sand-900 text-4.5">{{ r.pricePerNight.toLocaleString('ru-RU') }} ₽</span>
                        <span class="block text-3 text-sand-600">/ ночь</span>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-1.5 mb-3">
                      <span class="spec-chip text-3.25! py-0.75! px-2!">{{ r.area }} м²</span>
                      <span class="spec-chip text-3.25! py-0.75! px-2!">{{ r.bed }}</span>
                      <span class="spec-chip text-3.25! py-0.75! px-2!">до {{ r.guests }} гостей</span>
                    </div>
                    <p v-if="!r.fitsGuests" class="text-3.25 text-amber-700 mb-3 flex items-start gap-1.5">
                      <svg class="flex-shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                      <span class="leading-snug">Только до&nbsp;{{ r.guests }} гостей. Менеджер предложит доплату за&nbsp;дополнительное место.</span>
                    </p>
                    <p v-else-if="r.note" class="text-3.25 text-amber-700 mb-3 flex items-start gap-1.5">
                      <svg class="flex-shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                      <span class="leading-snug">{{ r.note }}</span>
                    </p>
                    <div class="flex items-center justify-between gap-2 mt-auto pt-2">
                      <button type="button" class="room-pick__more" @click="detailRoom = r">
                        Подробнее
                      </button>
                      <button
                        type="button"
                        class="room-pick__select"
                        :class="state.roomId === r.id ? 'room-pick__select--active' : ''"
                        @click="selectRoom(r.id)"
                      >
                        <svg v-if="state.roomId === r.id" width="14" height="14" viewBox="0 0 24 24" fill="none" class="mr-1.5 inline-block"><path d="M5 12L10 17L19 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        {{ state.roomId === r.id ? 'Выбран' : 'Выбрать' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ============ 3. EXTRAS ============ -->
            <div class="checkout-card">
              <div class="checkout-head">
                <span class="checkout-num">3</span>
                <h2 class="checkout-title">Дополнительные <span class="section-title-accent text-amber-600">услуги</span></h2>
                <span class="checkout-optional">необязательно</span>
              </div>
              <p class="text-3.75 text-sand-700 mb-4 leading-snug">Завтрак, Wi-Fi, парковка и&nbsp;горный воздух уже включены — добавьте только то, что захотите попробовать сверху.</p>

              <div class="flex flex-wrap gap-2 mb-4">
                <button
                  v-for="cat in extraCategories"
                  :key="cat.id"
                  type="button"
                  class="extra-tab"
                  :class="extraTab === cat.id ? 'extra-tab--active' : ''"
                  @click="extraTab = cat.id"
                >
                  {{ cat.label }}
                  <span v-if="categoryAddedCount(cat.id) > 0" class="extra-tab__badge">{{ categoryAddedCount(cat.id) }}</span>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="extra in visibleExtras"
                  :key="extra.id"
                  class="extra-card"
                  :class="getExtraCount(extra.id) > 0 ? 'extra-card--active' : ''"
                >
                  <div class="extra-card__icon" v-html="extra.icon"></div>
                  <div class="extra-card__body">
                    <h4 class="font-display font-500 text-sand-900 text-4 mb-1">{{ extra.title }}</h4>
                    <p class="text-3.5 text-sand-700 leading-snug mb-3 line-clamp-2">{{ extra.description }}</p>
                    <div class="flex items-end justify-between gap-2 flex-wrap">
                      <div>
                        <span class="font-display font-500 text-sand-900 text-4">{{ extra.price }}</span>
                        <span class="text-3.25 text-sand-600 ml-1">{{ extra.unitLabel }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          v-if="extra.fullDescription"
                          type="button"
                          class="extra-card__more"
                          @click="detailExtra = extra"
                        >Подробнее</button>
                        <div v-if="getExtraCount(extra.id) > 0" class="counter-light counter-light--sm">
                          <button type="button" @click="setExtraCount(extra.id, getExtraCount(extra.id) - 1)" class="counter-light__btn">&minus;</button>
                          <span class="counter-light__val">{{ getExtraCount(extra.id) }}</span>
                          <button type="button" @click="setExtraCount(extra.id, getExtraCount(extra.id) + 1)" class="counter-light__btn">+</button>
                        </div>
                        <button v-else type="button" class="extra-card__add" @click="setExtraCount(extra.id, 1)">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="inline-block"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                          Добавить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ============ 4. CONTACTS ============ -->
            <div class="checkout-card">
              <div class="checkout-head">
                <span class="checkout-num">4</span>
                <h2 class="checkout-title">Контакты</h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label class="label-light">Имя <span class="text-amber-600">*</span></label>
                  <input v-model="state.guest.firstName" type="text" placeholder="Имя" class="input-light" />
                </div>
                <div>
                  <label class="label-light">Фамилия</label>
                  <input v-model="state.guest.lastName" type="text" placeholder="Фамилия" class="input-light" />
                </div>
                <div>
                  <label class="label-light">Телефон <span class="text-amber-600">*</span></label>
                  <input :value="state.guest.phone" @input="handlePhone" @keydown="phoneMaskKeydown" type="tel" placeholder="+7 (900) 000-00-00" class="input-light" />
                </div>
                <div>
                  <label class="label-light">Email</label>
                  <input v-model="state.guest.email" type="email" placeholder="you@example.com" class="input-light" />
                </div>
                <div class="md:col-span-2">
                  <label class="label-light">Пожелания и&nbsp;комментарий <span class="text-sand-500">(необязательно)</span></label>
                  <textarea v-model="state.comment" placeholder="Время заезда, диета, нужен трансфер из аэропорта…" rows="2" class="input-light textarea-light"></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: sticky summary -->
          <aside class="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div class="summary-card">
              <h3 class="summary-card__title">Ваша бронь</h3>

              <!-- Dates -->
              <div class="summary-block">
                <div class="summary-row">
                  <span class="summary-label">Даты</span>
                  <span class="summary-value">{{ formattedRange }}</span>
                </div>
                <div v-if="nights > 0" class="summary-row">
                  <span class="summary-label">Длительность</span>
                  <span class="summary-value">{{ nights }} {{ nightsWord }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Гости</span>
                  <span class="summary-value">{{ guestSummary }}</span>
                </div>
              </div>

              <!-- Room -->
              <div v-if="selectedAvailable" class="summary-block summary-block--bordered">
                <div class="summary-line">
                  <div class="flex-1 min-w-0">
                    <div class="font-body font-600 text-sand-900 text-4 mb-0.5 truncate">{{ selectedAvailable.name }}</div>
                    <div class="text-3.25 text-sand-600">{{ selectedAvailable.pricePerNight.toLocaleString('ru-RU') }} ₽ × {{ Math.max(1, nights) }} {{ nightsWord }}</div>
                  </div>
                  <span class="summary-amount">{{ totals.roomTotal.toLocaleString('ru-RU') }} ₽</span>
                </div>
              </div>
              <div v-else class="summary-block summary-block--bordered">
                <span class="text-3.5 text-sand-600 italic">Номер ещё не выбран</span>
              </div>

              <!-- Extras -->
              <div v-if="summaryExtras.length > 0" class="summary-block summary-block--bordered">
                <div v-for="line in summaryExtras" :key="line.id" class="summary-line">
                  <div class="flex-1 min-w-0">
                    <div class="font-body text-3.75 text-sand-900 truncate">{{ line.title }}</div>
                    <div class="text-3 text-sand-600">{{ line.formula }}</div>
                  </div>
                  <span class="summary-amount">{{ line.amount.toLocaleString('ru-RU') }} ₽</span>
                </div>
              </div>

              <!-- Total -->
              <div class="summary-total">
                <span class="font-body text-4 text-sand-700">Итого</span>
                <span class="font-display font-500 text-sand-900 text-7">{{ totals.total.toLocaleString('ru-RU') }} ₽</span>
              </div>
              <p class="text-3.25 text-sand-600 mb-4 leading-snug">
                Окончательная стоимость подтверждается менеджером после проверки доступности номера на&nbsp;выбранные даты.
              </p>

              <button
                type="button"
                class="btn-primary w-full py-3.5 text-4"
                :disabled="submitting"
                @click="submit"
              >
                {{ submitting ? 'Отправляем…' : 'Отправить заявку' }}
              </button>

              <p class="text-3.25 text-sand-700 mt-3 leading-snug text-center">
                Нажимая «Отправить», вы соглашаетесь с
                <a :href="`${base}privacy`" class="text-sand-900 underline underline-offset-2 hover:text-amber-600 transition-colors">политикой конфиденциальности</a>
              </p>

              <button
                v-if="hasAnySelection"
                type="button"
                class="reset-link"
                @click="resetAll"
              >
                Очистить и&nbsp;начать заново
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Mobile sticky bottom bar -->
    <div v-if="totals.total > 0" class="mobile-bar lg:hidden">
      <div class="mobile-bar__inner">
        <div>
          <div class="text-3.25 text-sand-600 leading-tight">Итого{{ nights > 0 ? ` за ${nights} ${nightsWord}` : '' }}</div>
          <div class="font-display font-500 text-sand-900 text-5.5 leading-tight">{{ totals.total.toLocaleString('ru-RU') }} ₽</div>
        </div>
        <button type="button" class="btn-primary !py-3 !px-5" :disabled="submitting" @click="submit">
          {{ submitting ? 'Отправляем…' : 'Отправить' }}
        </button>
      </div>
    </div>

    <!-- Room details modal -->
    <UiRoomDetailsModal
      :room="detailRoom"
      action="select"
      select-label="Выбрать этот номер"
      @close="detailRoom = null"
      @select="r => { selectRoom(r.id); detailRoom = null }"
    />

    <!-- Extra details modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="detailExtra" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/60 backdrop-blur-sm" @click.self="detailExtra = null">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-130 max-h-[90vh] overflow-y-auto shadow-2xl modal-body" data-lenis-prevent>
            <div class="px-7 md:px-9 pt-7 pb-5 border-b border-sand-200">
              <div class="flex items-center gap-4">
                <div class="modal-icon-wrap flex-shrink-0" v-html="detailExtra.icon"></div>
                <h3 class="flex-1 font-display font-500 text-sand-900 min-w-0" style="font-size: clamp(1.4rem, 3vw, 1.7rem)">{{ detailExtra.title }}</h3>
                <button @click="detailExtra = null" class="flex-shrink-0 w-9 h-9 rounded-full bg-sand-200/90 hover:bg-sand-300 flex items-center justify-center transition-colors border-none cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
            <div class="px-7 md:px-9 py-6">
              <p class="font-body text-4 text-sand-800 leading-relaxed">{{ detailExtra.fullDescription || detailExtra.description }}</p>
            </div>
            <div class="px-7 md:px-9 py-5 border-t border-sand-200 flex items-center justify-between bg-sand-100/50 gap-3 flex-wrap">
              <div>
                <span class="font-display font-500 text-sand-900" style="font-size: clamp(1.2rem, 2vw, 1.5rem)">{{ detailExtra.price }}</span>
                <span class="text-small text-sand-600 ml-1">{{ detailExtra.unitLabel }}</span>
              </div>
              <button
                type="button"
                class="btn-primary"
                @click="addExtraFromModal"
              >
                {{ getExtraCount(detailExtra.id) > 0 ? 'Уже добавлено' : 'Добавить к брони' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <UiSiteFooter />
  </div>
</template>

<script setup lang="ts">
import type { ExtraDef } from '~/composables/useBookingExtras'

const base = useRuntimeConfig().app.baseURL || '/'
const route = useRoute()

useHead({
  title: 'Бронирование — Радде',
  meta: [
    { name: 'description', content: 'Соберите свой отдых в пансионате Радде: даты, номер, услуги. Менеджер подтвердит бронь в течение 15 минут.' },
    { name: 'robots', content: 'noindex, follow' },
  ],
})

const extras = useBookingExtras()
const { state, nights, setRoom, setExtraCount, getExtraCount, reset } = useBookingStore()
const { onInput: phoneMaskInput, onKeydown: phoneMaskKeydown } = usePhoneMask()
const toast = useToast()

const todayIso = computed(() => new Date().toISOString().slice(0, 10))
const checkOutMin = computed(() => {
  const a = state.value.arrival || todayIso.value
  const d = new Date(a)
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
})

watch(() => state.value.arrival, (val) => {
  if (val && state.value.departure && state.value.departure <= val) {
    const d = new Date(val)
    d.setDate(d.getDate() + 1)
    state.value.departure = d.toISOString().slice(0, 10)
  }
})

// ----- Availability -----
const adultsRef = computed(() => state.value.adults)
const childrenRef = computed(() => state.value.children)
const arrivalRef = computed(() => state.value.arrival)
const departureRef = computed(() => state.value.departure)

const canShowRooms = computed(() => !!state.value.arrival && !!state.value.departure && nights.value > 0)

const { rooms: availableRooms, loading: availLoading } = useAvailableRooms({
  arrival: arrivalRef,
  departure: departureRef,
  adults: adultsRef,
  children: childrenRef,
})

const selectedAvailable = computed(() => availableRooms.value.find(r => r.id === state.value.roomId))

function selectRoom(id: string) {
  setRoom(state.value.roomId === id ? null : id)
}

// ----- Pre-select from URL -----
onMounted(() => {
  const roomId = route.query.room
  if (typeof roomId === 'string') setRoom(roomId)
  const extraId = route.query.extra
  if (typeof extraId === 'string' && extras.find(e => e.id === extraId)) {
    if (getExtraCount(extraId) === 0) setExtraCount(extraId, 1)
  }
})

// ----- Extras -----
const extraCategories = [
  { id: 'all', label: 'Все' },
  { id: 'food', label: 'Питание' },
  { id: 'active', label: 'Активный отдых' },
  { id: 'wellness', label: 'Оздоровление' },
  { id: 'service', label: 'Сервис' },
] as const
type ExtraCatId = typeof extraCategories[number]['id']
const extraTab = ref<ExtraCatId>('all')

const visibleExtras = computed(() => {
  if (extraTab.value === 'all') return extras
  return extras.filter(e => e.category === extraTab.value)
})

function categoryAddedCount(catId: ExtraCatId): number {
  if (catId === 'all') return state.value.extras.length
  const ids = new Set(extras.filter(e => e.category === catId).map(e => e.id))
  return state.value.extras.filter(s => ids.has(s.id)).length
}

const detailExtra = ref<ExtraDef | null>(null)
function addExtraFromModal() {
  if (!detailExtra.value) return
  if (getExtraCount(detailExtra.value.id) === 0) setExtraCount(detailExtra.value.id, 1)
  detailExtra.value = null
}

// ----- Room modal -----
const detailRoom = ref<typeof availableRooms.value[0] | null>(null)

// ----- Phone -----
function handlePhone(e: Event) {
  state.value.guest.phone = phoneMaskInput(e)
}

// ----- Format helpers -----
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()} ${months[d.getMonth()]}`
}
const formattedRange = computed(() => `${formatDate(state.value.arrival)} — ${formatDate(state.value.departure)}`)
const nightsWord = computed(() => {
  const n = nights.value
  if (n % 10 === 1 && n % 100 !== 11) return 'ночь'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'ночи'
  return 'ночей'
})
const guestSummary = computed(() => {
  const a = state.value.adults
  const c = state.value.children
  const aWord = a % 10 === 1 && a % 100 !== 11 ? 'взрослый' : 'взрослых'
  const parts = [`${a} ${aWord}`]
  if (c > 0) {
    const cWord = c % 10 === 1 && c % 100 !== 11 ? 'ребёнок' : ([2, 3, 4].includes(c % 10) && ![12, 13, 14].includes(c % 100) ? 'ребёнка' : 'детей')
    parts.push(`${c} ${cWord}`)
  }
  return parts.join(' + ')
})

// ----- Totals -----
const totals = computed(() => {
  const room = selectedAvailable.value
  const n = Math.max(1, nights.value)
  const roomTotal = room ? room.pricePerNight * n : 0
  let extrasTotal = 0
  for (const sel of state.value.extras) {
    const meta = extras.find(e => e.id === sel.id)
    if (!meta) continue
    extrasTotal += extraSubtotal(meta, sel.count, state.value.adults, n)
  }
  return { roomTotal, extrasTotal, total: roomTotal + extrasTotal }
})

const summaryExtras = computed(() => {
  return state.value.extras
    .map(sel => {
      const meta = extras.find(e => e.id === sel.id)
      if (!meta) return null
      const n = Math.max(1, nights.value)
      const amount = extraSubtotal(meta, sel.count, state.value.adults, n)
      let formula = ''
      switch (meta.unit) {
        case 'guest':
          formula = `${meta.priceValue.toLocaleString('ru-RU')} × ${state.value.adults} × ${n}`
          if (sel.count > 1) formula = `${sel.count} × ` + formula
          break
        case 'night':
          formula = `${meta.priceValue.toLocaleString('ru-RU')} × ${n} ${nightsWord.value}`
          if (sel.count > 1) formula = `${sel.count} × ` + formula
          break
        case 'session':
          formula = sel.count > 1 ? `${meta.priceValue.toLocaleString('ru-RU')} × ${sel.count}` : `${meta.priceValue.toLocaleString('ru-RU')} ₽`
          break
      }
      return { id: meta.id, title: meta.title, formula, amount }
    })
    .filter((x): x is { id: string; title: string; formula: string; amount: number } => x !== null)
})

const hasAnySelection = computed(() =>
  !!state.value.roomId
  || state.value.extras.length > 0
  || state.value.guest.firstName
  || state.value.guest.phone
  || state.value.comment,
)

// ----- Submit -----
const submitting = ref(false)

async function submit() {
  if (!state.value.arrival || !state.value.departure || nights.value <= 0) {
    toast.error('Укажите даты заезда и выезда')
    scrollToTop()
    return
  }
  if (!state.value.roomId) {
    toast.error('Выберите номер')
    scrollToSection('room')
    return
  }
  if (!state.value.guest.firstName.trim()) {
    toast.error('Укажите имя')
    scrollToSection('contacts')
    return
  }
  if (state.value.guest.phone.replace(/\D/g, '').length < 11) {
    toast.error('Укажите корректный телефон')
    scrollToSection('contacts')
    return
  }

  submitting.value = true

  const room = selectedAvailable.value
  const payload = {
    arrival: state.value.arrival,
    departure: state.value.departure,
    rooms: [{
      room_type_id: room?.bnovoRoomTypeId ?? null,
      rate_id: room?.bnovoRateId ?? null,
      guests: [{ adults: state.value.adults, children: state.value.children }],
    }],
    guest: {
      first_name: state.value.guest.firstName,
      last_name: state.value.guest.lastName,
      email: state.value.guest.email,
      phone: state.value.guest.phone,
    },
    extras: state.value.extras.map(sel => {
      const meta = extras.find(e => e.id === sel.id)
      return { id: meta?.bnovoServiceId ?? null, slug: sel.id, count: sel.count }
    }),
    comment: state.value.comment,
    total_estimate: totals.value.total,
  }
  // eslint-disable-next-line no-console
  console.log('[booking] outgoing payload', payload)

  if (import.meta.client) {
    try {
      localStorage.setItem('radde_booking_last', JSON.stringify({
        firstName: state.value.guest.firstName,
        phone: state.value.guest.phone,
      }))
    } catch { /* ignore */ }
  }

  await new Promise(resolve => setTimeout(resolve, 800))

  state.value.roomId = null
  state.value.extras = []
  state.value.comment = ''

  window.location.href = `${base}booking/success`
}

function resetAll() {
  reset()
  scrollToTop()
}

function scrollToTop() {
  if (!import.meta.client) return
  const lenis = useLenis().instance()
  if (lenis) lenis.scrollTo(0, { duration: 0.6 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToSection(_id: 'room' | 'contacts') {
  // scroll к началу формы — секции рядом, в одном экране
  scrollToTop()
}
</script>

<style scoped>
/* ======== CHECKOUT CARD ======== */
.checkout-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(44, 36, 22, 0.03);
}
@media (min-width: 768px) { .checkout-card { padding: 24px; } }

.checkout-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
@media (min-width: 768px) { .checkout-head { margin-bottom: 18px; } }
.checkout-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C17F3E, #A0653A);
  color: white;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(193, 127, 62, 0.25);
}
.checkout-title {
  flex: 1;
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: #2C2416;
  line-height: 1.2;
  margin: 0;
}
@media (min-width: 768px) { .checkout-title { font-size: 22px; } }
.checkout-optional {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #9A8B73;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.checkout-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #F0E6D6;
  color: #5C6B3A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
}
.checkout-empty,
.checkout-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 36px 16px;
  text-align: center;
  color: #6B5B4A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14.5px;
}
.checkout-empty svg { color: #B5A88E; }
.quiz-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #F0E6D6;
  border-top-color: #C17F3E;
  border-radius: 50%;
  animation: quiz-spin 0.8s linear infinite;
}
@keyframes quiz-spin { to { transform: rotate(360deg); } }

/* ======== LIGHT COUNTER ======== */
.counter-light {
  display: flex;
  align-items: center;
  background: white;
  border: 1.5px solid #E0D5C8;
  border-radius: 8px;
  overflow: hidden;
  height: 46px;
  transition: border-color 0.2s;
}
.counter-light:hover { border-color: #C17F3E; }
.counter-light--sm { border-width: 1px; border-radius: 7px; height: 32px; }
.counter-light__btn {
  width: 44px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B5B4A;
  font-size: 18px;
  font-weight: 600;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.counter-light--sm .counter-light__btn { width: 30px; font-size: 14px; }
.counter-light__btn:hover:not(:disabled) {
  color: #2C2416;
  background: #FAF6F0;
}
.counter-light__btn:disabled { opacity: 0.3; cursor: default; }
.counter-light__val {
  flex: 1;
  text-align: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2C2416;
  min-width: 28px;
  padding: 0 4px;
}

/* ======== TEXTAREA ======== */
.textarea-light {
  height: auto !important;
  min-height: 84px;
  padding: 12px 16px !important;
  resize: vertical;
  line-height: 1.5;
}

/* ======== ROOM PICK CARDS ======== */
.room-pick {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.room-pick:hover {
  border-color: #D4BC96;
  box-shadow: 0 6px 16px rgba(44, 36, 22, 0.06);
}
.room-pick--active {
  border-color: #C17F3E;
  box-shadow: 0 8px 18px rgba(193, 127, 62, 0.18);
}
.room-pick--unfit { opacity: 0.85; }
.room-pick__photo {
  position: relative;
  aspect-ratio: 16 / 10;
  background: #F0E6D6;
  overflow: hidden;
}
.room-pick__photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.room-pick:hover .room-pick__photo img { transform: scale(1.04); }
.room-pick__check {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #C17F3E;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(193, 127, 62, 0.4);
}
.room-pick__avail {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(44, 36, 22, 0.85);
  backdrop-filter: blur(4px);
  color: white;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
}
.room-pick__avail--low {
  background: rgba(193, 127, 62, 0.92);
}
.room-pick__body {
  padding: 14px 16px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.room-pick__more {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B5B4A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 6px 0;
  transition: color 0.2s;
}
.room-pick__more:hover { color: #C17F3E; }
.room-pick__select {
  display: inline-flex;
  align-items: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #2C2416;
  background: white;
  border: 1.5px solid #C17F3E;
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.room-pick__select:hover {
  background: #C17F3E;
  color: white;
}
.room-pick__select--active,
.room-pick__select--active:hover {
  background: #5C6B3A;
  border-color: #5C6B3A;
  color: white;
}

/* ======== EXTRA CATEGORY TABS ======== */
.extra-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #6B5B4A;
  background: transparent;
  border: 1.5px solid #E0D5C8;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
}
@media (min-width: 640px) { .extra-tab { font-size: 14px; padding: 7px 14px; } }
.extra-tab:hover { border-color: #C17F3E; }
.extra-tab--active {
  background: #2C2416;
  border-color: #2C2416;
  color: #FAF6F0;
}
.extra-tab__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #C17F3E;
  color: white;
  font-size: 11px;
  font-weight: 700;
}

/* ======== EXTRA CARDS (compact) ======== */
.extra-card {
  display: flex;
  gap: 12px;
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 12px;
  padding: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.extra-card--active {
  border-color: #C17F3E;
  box-shadow: 0 4px 12px rgba(193, 127, 62, 0.1);
}
.extra-card__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #F4F6EE, #E8ECDC);
  color: #5B7A3A;
  display: flex;
  align-items: center;
  justify-content: center;
}
.extra-card__icon :deep(svg) { width: 20px; height: 20px; }
.extra-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.extra-card__more {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B5B4A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 0;
  transition: color 0.2s;
}
.extra-card__more:hover { color: #C17F3E; }
.extra-card__add {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #C17F3E;
  background: transparent;
  border: 1.5px solid #E0D5C8;
  border-radius: 7px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.extra-card__add:hover {
  background: #C17F3E;
  border-color: #C17F3E;
  color: white;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ======== SUMMARY CARD ======== */
.summary-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(44, 36, 22, 0.06);
}
@media (min-width: 768px) { .summary-card { padding: 24px; } }
.summary-card__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: #2C2416;
  margin: 0 0 14px;
}
.summary-block {
  padding-bottom: 12px;
}
.summary-block--bordered {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #E8DCC8;
}
.summary-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  padding: 3px 0;
}
.summary-label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: #6B5B4A;
}
.summary-value {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2C2416;
  text-align: right;
}
.summary-line {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 3px 0;
}
.summary-amount {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  color: #2C2416;
  white-space: nowrap;
  flex-shrink: 0;
}
.summary-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 2px solid #F0E6D6;
  margin-bottom: 4px;
}

.reset-link {
  display: block;
  margin: 14px auto 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9A8B73;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.reset-link:hover { color: #2C2416; }

/* ======== MOBILE BAR ======== */
.mobile-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: white;
  border-top: 1px solid #E8DCC8;
  box-shadow: 0 -8px 24px rgba(44, 36, 22, 0.08);
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0));
}
.mobile-bar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

/* ======== MODAL ======== */
.modal-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #F4F6EE, #E8ECDC);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5B7A3A;
  flex-shrink: 0;
}
.modal-enter-active { transition: opacity 0.3s ease; }
.modal-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-leave-active > div:last-child { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from { opacity: 0; }
.modal-enter-from > div:last-child { opacity: 0; transform: scale(0.95) translateY(10px); }
.modal-leave-to { opacity: 0; }
.modal-leave-to > div:last-child { opacity: 0; transform: scale(0.97); }
</style>
