<template>
  <div>
    <UiAppHeader solid @book="scrollToTop" />

    <!-- Hero strip -->
    <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-40 pb-10 md:pb-14">
      <img
        :src="`${base}images/hero/hero-1.jpg`"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-sand-900/82"></div>

      <div class="container relative z-10">
        <div class="max-w-180">
          <span class="text-label text-amber-400 mb-4 block">Бронирование</span>
          <h1 class="text-h1 text-white mb-5">
            Соберите свой <span class="section-title-accent text-sand-300">отдых</span>
          </h1>
          <p class="text-body-lg text-white/75 max-w-130">
            Выберите даты, номер и нужные услуги — мы свяжемся в&nbsp;течение 15&nbsp;минут, чтобы подтвердить бронь и&nbsp;ответить на&nbsp;вопросы.
          </p>
        </div>
      </div>
    </section>

    <!-- Success screen -->
    <section v-if="isSuccess" class="bg-sand-50 section-padding">
      <div class="container">
        <div class="max-w-150 mx-auto text-center">
          <div class="w-16 h-16 mx-auto rounded-full bg-olive-100 text-olive-600 flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M10 16.5L14.5 21L22 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h2 class="text-h2 text-sand-900 mb-4">Заявка <span class="section-title-accent">отправлена</span></h2>
          <p class="text-body-lg text-sand-700 mb-8">
            Спасибо, {{ state.guest.firstName }}! Мы свяжемся с&nbsp;вами по&nbsp;номеру {{ state.guest.phone }} в&nbsp;течение 15&nbsp;минут, чтобы подтвердить бронь.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <a :href="base" class="btn-secondary">На главную</a>
            <button type="button" class="btn-primary" @click="bookAnother">Новая бронь</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Form -->
    <template v-else>
      <!-- Dates + guests panel (dark) -->
      <section class="relative bg-sand-900 py-10 md:py-14">
        <div class="container">
          <div class="max-w-1000px mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-3 p-5 md:p-7">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 md:gap-4 items-end">
              <div class="md:col-span-2 lg:col-span-3">
                <label class="label-dark">Заезд</label>
                <UiDatePicker v-model="state.arrival" :min-date="todayIso" placeholder="Выберите дату" />
              </div>
              <div class="md:col-span-2 lg:col-span-3">
                <label class="label-dark">Выезд</label>
                <UiDatePicker v-model="state.departure" :min-date="checkOutMin" placeholder="Выберите дату" />
              </div>
              <div class="md:col-span-1 lg:col-span-3">
                <label class="label-dark">Взрослые</label>
                <div class="counter-wrap">
                  <button type="button" @click="state.adults = Math.max(1, state.adults - 1)" class="counter-btn" :disabled="state.adults <= 1">&minus;</button>
                  <span class="counter-val">{{ state.adults }}</span>
                  <button type="button" @click="state.adults = Math.min(10, state.adults + 1)" class="counter-btn">+</button>
                </div>
              </div>
              <div class="md:col-span-1 lg:col-span-3">
                <label class="label-dark">Дети</label>
                <div class="counter-wrap">
                  <button type="button" @click="state.children = Math.max(0, state.children - 1)" class="counter-btn" :disabled="state.children <= 0">&minus;</button>
                  <span class="counter-val">{{ state.children }}</span>
                  <button type="button" @click="state.children = Math.min(6, state.children + 1)" class="counter-btn">+</button>
                </div>
              </div>
            </div>

            <div class="mt-5 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80">
              <span class="font-body text-4">{{ formattedRange }}</span>
              <span v-if="nights > 0" class="text-amber-400 font-body text-4 font-600">{{ nights }} {{ nightsWord }}</span>
              <span class="font-body text-4">{{ guestSummary }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Main form -->
      <section class="bg-sand-50 section-padding">
        <div class="container">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

            <!-- LEFT: form sections -->
            <div class="lg:col-span-2 space-y-14">

              <!-- Step 1: Room -->
              <div>
                <UiSectionHeader label="Шаг 1" align="left" title="Выберите" accent="номер" class="mb-7" />

                <div v-if="rooms.length === 0" class="text-sand-700">Номера временно недоступны</div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    v-for="room in rooms"
                    :key="room.id"
                    type="button"
                    class="room-pick"
                    :class="state.roomId === room.id ? 'room-pick--active' : ''"
                    @click="selectRoom(room.id)"
                  >
                    <div class="room-pick__photo">
                      <img :src="room.images[0]" :alt="room.name" loading="lazy" />
                      <span class="room-pick__check" v-if="state.roomId === room.id">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </span>
                    </div>
                    <div class="room-pick__body">
                      <div class="flex items-baseline justify-between gap-3 mb-2">
                        <h3 class="font-display font-500 text-sand-900 text-5">{{ room.name }}</h3>
                        <span class="font-display font-500 text-sand-900 text-4.5 whitespace-nowrap">от {{ room.price }} ₽</span>
                      </div>
                      <p class="text-small text-sand-700 leading-snug mb-3 room-pick__desc">{{ room.description }}</p>
                      <div class="flex flex-wrap gap-1.5">
                        <span class="spec-chip text-3.5! py-1! px-2.5!">{{ room.area }} м²</span>
                        <span class="spec-chip text-3.5! py-1! px-2.5!">{{ room.bed }}</span>
                        <span class="spec-chip text-3.5! py-1! px-2.5!">до {{ room.guests }} гостей</span>
                      </div>
                      <div v-if="room.note" class="text-3.5 text-amber-700 mt-3 flex items-start gap-1.5">
                        <svg class="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                        <span class="leading-snug">{{ room.note }}</span>
                      </div>
                    </div>
                  </button>
                </div>

                <p v-if="capacityWarning" class="mt-4 flex items-start gap-2 text-amber-700 text-4">
                  <svg class="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                  <span>{{ capacityWarning }}</span>
                </p>
              </div>

              <!-- Step 2: Extras -->
              <div>
                <UiSectionHeader label="Шаг 2" align="left" title="Добавьте" accent="услуги" class="mb-3" />
                <p class="font-body text-4 text-sand-700 mb-7 max-w-130">Завтрак, Wi-Fi, парковка и&nbsp;горный воздух уже включены — добавьте только то, что захотите попробовать сверху.</p>

                <div class="flex flex-wrap gap-2 mb-6">
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
                      <div class="flex items-start justify-between gap-3 mb-1">
                        <h4 class="font-display font-500 text-sand-900 text-4.5">{{ extra.title }}</h4>
                      </div>
                      <p class="text-small text-sand-700 leading-snug mb-3">{{ extra.description }}</p>
                      <div class="flex items-end justify-between gap-3 flex-wrap">
                        <div>
                          <span class="font-display font-500 text-sand-900 text-4.5">{{ extra.price }}</span>
                          <span class="text-small text-sand-600 ml-1">{{ extra.unitLabel }}</span>
                        </div>
                        <div v-if="getExtraCount(extra.id) > 0" class="counter-wrap counter-wrap--light">
                          <button type="button" @click="setExtraCount(extra.id, getExtraCount(extra.id) - 1)" class="counter-btn counter-btn--light">&minus;</button>
                          <span class="counter-val counter-val--light">{{ getExtraCount(extra.id) }}</span>
                          <button type="button" @click="setExtraCount(extra.id, getExtraCount(extra.id) + 1)" class="counter-btn counter-btn--light">+</button>
                        </div>
                        <button v-else type="button" class="btn-secondary !py-2 !px-4 !text-3.5" @click="setExtraCount(extra.id, 1)">
                          Добавить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Guest info -->
              <div>
                <UiSectionHeader label="Шаг 3" align="left" title="Кто" accent="бронирует" class="mb-7" />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="label-light">Имя <span class="text-amber-600">*</span></label>
                    <input v-model="state.guest.firstName" type="text" placeholder="Имя" class="input-light" required />
                  </div>
                  <div>
                    <label class="label-light">Фамилия</label>
                    <input v-model="state.guest.lastName" type="text" placeholder="Фамилия" class="input-light" />
                  </div>
                  <div>
                    <label class="label-light">Телефон <span class="text-amber-600">*</span></label>
                    <input :value="state.guest.phone" @input="handlePhone" @keydown="phoneMaskKeydown" type="tel" placeholder="+7 (900) 000-00-00" class="input-light" required />
                  </div>
                  <div>
                    <label class="label-light">Email</label>
                    <input v-model="state.guest.email" type="email" placeholder="you@example.com" class="input-light" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="label-light">Пожелания и&nbsp;комментарий <span class="text-sand-500">(необязательно)</span></label>
                    <textarea v-model="state.comment" placeholder="Время заезда, диета, нужен трансфер из аэропорта…" rows="3" class="input-light" style="height:auto;min-height:100px;padding:12px 16px;resize:vertical;line-height:1.5"></textarea>
                  </div>
                </div>

                <p class="text-small text-sand-700 mt-5 leading-relaxed">
                  Нажимая «Отправить заявку», вы соглашаетесь с
                  <a :href="`${base}privacy`" class="text-sand-900 underline underline-offset-2 hover:text-amber-600 transition-colors">политикой конфиденциальности</a>.
                </p>
              </div>

            </div>

            <!-- RIGHT: summary sidebar -->
            <aside class="lg:col-span-1">
              <div class="summary-card lg:sticky" :style="{ top: '6.5rem' }">
                <h3 class="font-display font-500 text-sand-900 text-5.5 mb-5">Ваша бронь</h3>

                <!-- Dates -->
                <div class="summary-row">
                  <span class="summary-label">Даты</span>
                  <div class="summary-value">
                    <div>{{ formattedRange }}</div>
                    <div class="text-small text-sand-600 mt-0.5" v-if="nights > 0">{{ nights }} {{ nightsWord }}</div>
                  </div>
                </div>

                <!-- Guests -->
                <div class="summary-row">
                  <span class="summary-label">Гости</span>
                  <span class="summary-value">{{ guestSummary }}</span>
                </div>

                <div class="summary-divider"></div>

                <!-- Room -->
                <div v-if="selectedRoom" class="summary-line">
                  <div>
                    <div class="font-body font-600 text-sand-900 text-4">{{ selectedRoom.name }}</div>
                    <div class="text-small text-sand-600">
                      {{ selectedRoom.priceValue.toLocaleString('ru-RU') }} ₽ × {{ Math.max(1, nights) }} {{ nightsWord }}
                    </div>
                  </div>
                  <span class="summary-amount">{{ totals.roomTotal.toLocaleString('ru-RU') }} ₽</span>
                </div>
                <div v-else class="text-small text-sand-600 italic mb-3">Выберите номер</div>

                <!-- Extras -->
                <div v-for="line in summaryExtras" :key="line.id" class="summary-line">
                  <div>
                    <div class="font-body text-4 text-sand-900">{{ line.title }}</div>
                    <div class="text-small text-sand-600">{{ line.formula }}</div>
                  </div>
                  <span class="summary-amount">{{ line.amount.toLocaleString('ru-RU') }} ₽</span>
                </div>

                <div class="summary-divider"></div>

                <!-- Total -->
                <div class="flex items-baseline justify-between mb-1">
                  <span class="font-body text-4 text-sand-700">Итого</span>
                  <span class="font-display font-500 text-sand-900 text-7">{{ totals.total.toLocaleString('ru-RU') }} ₽</span>
                </div>
                <p class="text-small text-sand-600 mb-5 leading-snug">
                  Окончательная стоимость подтверждается менеджером после проверки доступности номера на&nbsp;выбранные даты.
                </p>

                <button
                  type="button"
                  class="btn-primary w-full py-4 text-4"
                  :disabled="!canSubmit || submitting"
                  @click="submit"
                >
                  {{ submitting ? 'Отправляем…' : 'Отправить заявку' }}
                </button>
                <p v-if="errorMessage" class="text-small text-amber-700 mt-3 leading-snug">{{ errorMessage }}</p>

                <button
                  v-if="hasAnySelection"
                  type="button"
                  class="block mx-auto mt-4 text-small text-sand-600 hover:text-sand-900 bg-transparent border-none cursor-pointer"
                  @click="resetAll"
                >
                  Очистить и начать заново
                </button>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </template>

    <UiSiteFooter />
  </div>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
const route = useRoute()

useHead({
  title: 'Бронирование — Радде',
  meta: [
    { name: 'description', content: 'Соберите свой отдых в пансионате Радде: даты, номер, услуги. Менеджер подтвердит бронь в течение 15 минут.' },
    { name: 'robots', content: 'noindex, follow' },
  ],
})

const rooms = useRooms()
const extras = useBookingExtras()
const { state, nights, setRoom, setExtraCount, getExtraCount, reset } = useBookingStore()
const { onInput: phoneMaskInput, onKeydown: phoneMaskKeydown } = usePhoneMask()

const todayIso = computed(() => new Date().toISOString().slice(0, 10))

const checkOutMin = computed(() => {
  const a = state.value.arrival || todayIso.value
  const d = new Date(a)
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
})

// Если заезд стал >= выезда — двигаем выезд на +1
watch(() => state.value.arrival, (val) => {
  if (val && state.value.departure && state.value.departure <= val) {
    const d = new Date(val)
    d.setDate(d.getDate() + 1)
    state.value.departure = d.toISOString().slice(0, 10)
  }
})

// Запрос с другой страницы — ?room=vip&extra=lunch
onMounted(() => {
  const roomId = route.query.room
  if (typeof roomId === 'string' && rooms.find(r => r.id === roomId)) {
    setRoom(roomId)
  }
  const extraId = route.query.extra
  if (typeof extraId === 'string' && extras.find(e => e.id === extraId)) {
    if (getExtraCount(extraId) === 0) setExtraCount(extraId, 1)
  }
})

const selectedRoom = computed(() => rooms.find(r => r.id === state.value.roomId))

function selectRoom(id: string) {
  setRoom(state.value.roomId === id ? null : id)
}

const capacityWarning = computed(() => {
  const r = selectedRoom.value
  if (!r) return ''
  const total = state.value.adults + state.value.children
  if (total > r.guests) {
    return `«${r.name}» рассчитан на ${r.guests} гостей, а вы выбрали ${total}. Менеджер предложит подходящий вариант или доплату за дополнительное место.`
  }
  return ''
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

// ----- Phone -----

function handlePhone(e: Event) {
  state.value.guest.phone = phoneMaskInput(e)
}

// ----- Summary -----

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

const totals = computed(() => calculateTotal(state.value, selectedRoom.value, extras, Math.max(1, nights.value)))

const summaryExtras = computed(() => {
  return state.value.extras
    .map(sel => {
      const meta = extras.find(e => e.id === sel.id)
      if (!meta) return null
      const amount = extraSubtotal(meta, sel.count, state.value.adults, Math.max(1, nights.value))
      let formula = ''
      switch (meta.unit) {
        case 'guest':
          formula = `${meta.priceValue.toLocaleString('ru-RU')} ₽ × ${state.value.adults} чел × ${Math.max(1, nights.value)} ${nightsWord.value}`
          if (sel.count > 1) formula = `${sel.count} × ` + formula
          break
        case 'night':
          formula = `${meta.priceValue.toLocaleString('ru-RU')} ₽ × ${Math.max(1, nights.value)} ${nightsWord.value}`
          if (sel.count > 1) formula = `${sel.count} × ` + formula
          break
        case 'session':
          formula = sel.count > 1 ? `${meta.priceValue.toLocaleString('ru-RU')} ₽ × ${sel.count}` : `${meta.priceValue.toLocaleString('ru-RU')} ₽`
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
const isSuccess = ref(false)
const errorMessage = ref('')

const canSubmit = computed(() => {
  return !!state.value.roomId
    && !!state.value.guest.firstName.trim()
    && state.value.guest.phone.replace(/\D/g, '').length >= 11
    && nights.value > 0
})

async function submit() {
  errorMessage.value = ''
  if (!state.value.roomId) {
    errorMessage.value = 'Выберите номер на шаге 1.'
    return
  }
  if (!state.value.guest.firstName.trim()) {
    errorMessage.value = 'Укажите имя на шаге 3.'
    return
  }
  if (state.value.guest.phone.replace(/\D/g, '').length < 11) {
    errorMessage.value = 'Укажите корректный телефон на шаге 3.'
    return
  }
  if (nights.value <= 0) {
    errorMessage.value = 'Дата выезда должна быть позже даты заезда.'
    return
  }

  submitting.value = true
  // Готовим payload в формате Bnovo. Когда клиент пришлёт lcode + API-ключ —
  // здесь будет fetch к Bnovo POST /bookings (или к нашему серверу-проксю).
  // Пока: имитация и логирование, заявка приходит как лид.
  const payload = toBnovoPayload(state.value, selectedRoom.value, extras)
  // eslint-disable-next-line no-console
  console.log('[booking] outgoing payload', payload)
  await new Promise(resolve => setTimeout(resolve, 1200))
  submitting.value = false
  isSuccess.value = true
  // Сохраняем имя для «Спасибо», но extras+room сбрасываем,
  // чтобы пользователь, начав заново, не отправил то же дважды.
  // Контактные поля оставляем — вдруг понадобится повторно.
}

function bookAnother() {
  isSuccess.value = false
  state.value.roomId = null
  state.value.extras = []
  state.value.comment = ''
  scrollToTop()
}

function resetAll() {
  reset()
  errorMessage.value = ''
  scrollToTop()
}

function scrollToTop() {
  if (!import.meta.client) return
  const lenis = useLenis().instance()
  if (lenis) lenis.scrollTo(0, { duration: 0.8 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* ---- Counters (dark) — те же стили, что и в Hero, чтобы выглядело родным ---- */
.counter-wrap {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.counter-wrap:hover { border-color: rgba(193, 127, 62, 0.35); }
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
.counter-btn:disabled { opacity: 0.25; cursor: default; }
.counter-val {
  flex: 1;
  text-align: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

/* ---- Counter (light) — для сетки услуг ---- */
.counter-wrap--light {
  background: white;
  border: 1px solid #E0D5C8;
}
.counter-wrap--light:hover { border-color: #C17F3E; }
.counter-btn--light {
  width: 36px;
  height: 36px;
  color: #6B5B4A;
  font-size: 16px;
  font-weight: 600;
}
.counter-btn--light:hover:not(:disabled) {
  color: #2C2416;
  background: #FAF6F0;
}
.counter-val--light {
  min-width: 32px;
  flex: none;
  color: #2C2416;
  font-size: 16px;
  padding: 0 8px;
}

/* ---- Room pick cards ---- */
.room-pick {
  display: flex;
  flex-direction: column;
  text-align: left;
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  padding: 0;
}
.room-pick:hover {
  border-color: #D4BC96;
  box-shadow: 0 8px 24px rgba(44, 36, 22, 0.06);
}
.room-pick--active {
  border-color: #C17F3E;
  box-shadow: 0 12px 28px rgba(193, 127, 62, 0.18);
}
.room-pick__photo {
  position: relative;
  aspect-ratio: 16 / 9;
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
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #C17F3E;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(193, 127, 62, 0.4);
}
.room-pick__body {
  padding: 18px 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.room-pick__desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ---- Extra category tabs ---- */
.extra-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #6B5B4A;
  background: transparent;
  border: 1.5px solid #E0D5C8;
  border-radius: 999px;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.2s;
}
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
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: #C17F3E;
  color: white;
  font-size: 12px;
  font-weight: 700;
}
.extra-tab--active .extra-tab__badge {
  background: #C17F3E;
}

/* ---- Extra cards ---- */
.extra-card {
  display: flex;
  gap: 14px;
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 14px;
  padding: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.extra-card--active {
  border-color: #C17F3E;
  box-shadow: 0 8px 18px rgba(193, 127, 62, 0.12);
}
.extra-card__icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #F4F6EE, #E8ECDC);
  color: #5B7A3A;
  display: flex;
  align-items: center;
  justify-content: center;
}
.extra-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ---- Summary card ---- */
.summary-card {
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(44, 36, 22, 0.06);
}
@media (min-width: 1024px) {
  .summary-card { padding: 28px; }
}
.summary-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
}
.summary-label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  color: #6B5B4A;
}
.summary-value {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2C2416;
  text-align: right;
}
.summary-divider {
  height: 1px;
  background: #F0E6D6;
  margin: 14px 0;
}
.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}
.summary-amount {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2C2416;
  white-space: nowrap;
}
</style>
