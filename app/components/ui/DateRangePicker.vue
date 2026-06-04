<template>
  <div class="date-picker-wrap" ref="wrapRef">
    <div class="date-input" :class="`date-input--${variant}`" @click="open = !open">
      <span class="date-value" :class="{ 'date-placeholder': !modelStart && !modelEnd }">
        {{ displayValue }}
      </span>
      <svg class="date-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2.5" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/>
        <path d="M1 6.5h14" stroke="currentColor" stroke-width="1.2"/>
        <path d="M5 1v3M11 1v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
    </div>

    <Teleport to="body">
      <Transition name="cal">
        <div v-if="open" class="cal-overlay" @click.self="close">
          <div class="cal-popup" :style="popupStyle" ref="popupRef">
            <!-- Header -->
            <div class="cal-header">
              <button @click="prevMonth" class="cal-nav" aria-label="Предыдущий месяц">&larr;</button>
              <span class="cal-title">{{ monthName }} {{ year }}</span>
              <button @click="nextMonth" class="cal-nav" aria-label="Следующий месяц">&rarr;</button>
            </div>

            <!-- Подсказка статуса выбора -->
            <div class="cal-hint">
              <template v-if="!pendingStart && !modelStart">Выберите дату <b>заезда</b></template>
              <template v-else-if="pendingStart && !pendingEnd">Теперь выберите дату <b>выезда</b></template>
              <template v-else>{{ nightsLabel }}</template>
            </div>

            <!-- Weekdays -->
            <div class="cal-weekdays">
              <span v-for="d in weekdays" :key="d">{{ d }}</span>
            </div>

            <!-- Days -->
            <div class="cal-days">
              <span v-for="blank in firstDayOffset" :key="'b'+blank" class="cal-day cal-empty"></span>
              <button
                v-for="day in daysInMonth"
                :key="day"
                class="cal-day"
                :class="{
                  'cal-today': isToday(day),
                  'cal-start': isStart(day),
                  'cal-end': isEnd(day),
                  'cal-in-range': isInRange(day),
                  'cal-disabled': isDisabled(day),
                }"
                :disabled="isDisabled(day)"
                @click="selectDay(day)"
                @pointerenter.passive="onPointerEnter($event, day)"
              >
                {{ day }}
              </button>
            </div>

            <!-- Reset link, если уже выбрана хоть одна граница -->
            <div v-if="modelStart || pendingStart" class="cal-footer">
              <button type="button" class="cal-reset" @click="resetSelection">Сбросить</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// Объединённый range-picker для «Заезд → Выезд»: один календарь, два клика.
// 1-й клик ставит дату заезда, 2-й — выезда (если она > заезда), иначе
// trigger'ит reset и текущий клик становится новой датой заезда.
//
// Состояние:
//   pendingStart — выбранная пользователем дата заезда в этом сеансе, ещё не
//   подтверждённая полным интервалом. Подтверждаем (emit обоим) только когда
//   выбрана дата выезда.
//   Если открыли picker с уже сохранёнными start/end — pendingStart=start,
//   pendingEnd=end. Изменение — двух-кликовый цикл.
const props = withDefaults(defineProps<{
  /** ISO YYYY-MM-DD — дата заезда */
  modelStart: string
  /** ISO YYYY-MM-DD — дата выезда */
  modelEnd: string
  /** Минимальная дата заезда (обычно today). ISO. */
  minDate?: string
  placeholder?: string
  variant?: 'dark' | 'light'
}>(), {
  variant: 'dark',
  placeholder: 'Выберите даты',
})

const emit = defineEmits<{
  'update:modelStart': [value: string]
  'update:modelEnd': [value: string]
}>()

const wrapRef = ref<HTMLElement>()
const popupRef = ref<HTMLElement>()
const open = ref(false)
const popupStyle = ref<Record<string, string>>({})

// Промежуточный state — пока выбираем диапазон, не дёргаем v-model на каждый клик.
const pendingStart = ref<string>('')
const pendingEnd = ref<string>('')
// Подсветка hover'ом при выборе даты выезда.
const hovered = ref<string>('')

const now = new Date()
const initialDate = props.modelStart || props.minDate || isoFromDate(now)
const viewMonth = ref(new Date(initialDate).getMonth())
const viewYear = ref(new Date(initialDate).getFullYear())

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]
const monthNamesGenitive = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]
const monthShort = [
  'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
]

const monthName = computed(() => monthNames[viewMonth.value])
const year = computed(() => viewYear.value)
const daysInMonth = computed(() => new Date(viewYear.value, viewMonth.value + 1, 0).getDate())
const firstDayOffset = computed(() => {
  const day = new Date(viewYear.value, viewMonth.value, 1).getDay()
  return day === 0 ? 6 : day - 1 // ПН = 0
})

function isoFromDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function isoOfCell(day: number): string {
  return `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function isToday(day: number) {
  return day === now.getDate() && viewMonth.value === now.getMonth() && viewYear.value === now.getFullYear()
}
function isStart(day: number) {
  const iso = isoOfCell(day)
  return iso === (pendingStart.value || props.modelStart)
}
function isEnd(day: number) {
  const iso = isoOfCell(day)
  // Если уже выбран pendingEnd — он. Если только pendingStart — подсветим
  // hovered как «потенциальный end» для preview.
  if (pendingEnd.value) return iso === pendingEnd.value
  if (pendingStart.value && hovered.value && hovered.value > pendingStart.value) return iso === hovered.value
  return iso === props.modelEnd && !pendingStart.value
}
function isInRange(day: number) {
  const iso = isoOfCell(day)
  const start = pendingStart.value || (pendingEnd.value ? '' : props.modelStart)
  // Текущий end либо подтверждённый, либо hovered.
  const end = pendingEnd.value || (hovered.value && pendingStart.value && hovered.value > pendingStart.value
    ? hovered.value
    : (pendingStart.value ? '' : props.modelEnd))
  if (!start || !end) return false
  return iso > start && iso < end
}
function isDisabled(day: number) {
  const iso = isoOfCell(day)
  if (props.minDate && iso < props.minDate) return true
  return false
}

function selectDay(day: number) {
  const iso = isoOfCell(day)
  if (isDisabled(day)) return
  if (!pendingStart.value) {
    // Первый клик в новом сеансе выбора
    pendingStart.value = iso
    pendingEnd.value = ''
    hovered.value = ''
    return
  }
  if (pendingStart.value && !pendingEnd.value) {
    // Второй клик: ставим end если позже start, иначе обновляем start
    if (iso > pendingStart.value) {
      pendingEnd.value = iso
      commit()
    } else {
      pendingStart.value = iso
    }
    return
  }
  // Если уже выбран и start и end — это «третий клик», начинаем новый выбор
  pendingStart.value = iso
  pendingEnd.value = ''
  hovered.value = ''
}

function hoverDay(day: number) {
  if (!pendingStart.value || pendingEnd.value) {
    hovered.value = ''
    return
  }
  hovered.value = isoOfCell(day)
}

// Preview-подсветка диапазона работает только для мыши: на touch у нас нет
// настоящего hover'а, и mouseenter+mouseleave срабатывают вместе с tap'ом —
// это создаёт «приклеившийся» preview между первым и вторым тапом. Делаем
// через pointerenter с проверкой pointerType, чтобы touch-устройства не
// вызывали hoverDay вовсе.
function onPointerEnter(e: PointerEvent, day: number) {
  if (e.pointerType !== 'mouse') return
  hoverDay(day)
}

function commit() {
  // Эмитим обе границы и закрываем popup.
  emit('update:modelStart', pendingStart.value)
  emit('update:modelEnd', pendingEnd.value)
  // Через nextTick закрываем — даём v-model дойти до родителя.
  setTimeout(() => { open.value = false }, 80)
}

function resetSelection() {
  pendingStart.value = ''
  pendingEnd.value = ''
  hovered.value = ''
}

function close() {
  open.value = false
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}
function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

// Подгоняем pending под текущие v-model при открытии (чтобы первый клик
// в новом сеансе не «продолжал» прошлый выбор и не оставлял preview).
watch(open, (val) => {
  if (val) {
    pendingStart.value = props.modelStart || ''
    pendingEnd.value = props.modelEnd || ''
    hovered.value = ''
    // Прыгаем календарём на месяц start'а (или текущий)
    const ref = props.modelStart || props.minDate || isoFromDate(now)
    const d = new Date(ref)
    viewMonth.value = d.getMonth()
    viewYear.value = d.getFullYear()
  }
})

// Кол-во ночей в выбранном/подсвечиваемом периоде — для UX-подсказки.
const nightsLabel = computed(() => {
  const start = pendingStart.value
  const end = pendingEnd.value || (pendingStart.value && hovered.value && hovered.value > pendingStart.value ? hovered.value : '')
  if (!start || !end) return ''
  const n = Math.round((Date.parse(end) - Date.parse(start)) / 86400000)
  if (n <= 0) return ''
  return `${n} ${pluralNights(n)}`
})
function pluralNights(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'ночь'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'ночи'
  return 'ночей'
}

// Inline-display в инпуте: «16–23 мая 2026», «28 апр — 3 мая 2026», и т.д.
const displayValue = computed(() => {
  const s = props.modelStart
  const e = props.modelEnd
  if (!s) return props.placeholder
  if (!e) {
    const d = new Date(s)
    return `${d.getDate()} ${monthNamesGenitive[d.getMonth()]} ${d.getFullYear()} — выберите выезд`
  }
  const ds = new Date(s)
  const de = new Date(e)
  if (ds.getFullYear() === de.getFullYear() && ds.getMonth() === de.getMonth()) {
    return `${ds.getDate()}–${de.getDate()} ${monthNamesGenitive[ds.getMonth()]} ${ds.getFullYear()}`
  }
  if (ds.getFullYear() === de.getFullYear()) {
    return `${ds.getDate()} ${monthShort[ds.getMonth()]} — ${de.getDate()} ${monthShort[de.getMonth()]} ${ds.getFullYear()}`
  }
  return `${ds.getDate()} ${monthShort[ds.getMonth()]} ${ds.getFullYear()} — ${de.getDate()} ${monthShort[de.getMonth()]} ${de.getFullYear()}`
})

// Позиционирование popup'а (как в одиночном picker'е).
watch(open, (val) => {
  if (val && wrapRef.value) {
    const rect = wrapRef.value.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const showAbove = spaceBelow < 380
    const popupWidth = 300
    const margin = 8
    const minLeft = margin
    const maxLeft = Math.max(margin, window.innerWidth - popupWidth - margin)
    const clampedLeft = Math.min(Math.max(rect.left, minLeft), maxLeft)
    popupStyle.value = {
      position: 'fixed',
      left: `${clampedLeft}px`,
      ...(showAbove
        ? { bottom: `${window.innerHeight - rect.top + 8}px` }
        : { top: `${rect.bottom + 8}px` }
      ),
      zIndex: '150',
    }
  }
})

// Закрытие по клику вне
onMounted(() => {
  if (!import.meta.client) return
  const handler = (e: Event) => {
    if (open.value && wrapRef.value && !wrapRef.value.contains(e.target as Node) && popupRef.value && !popupRef.value.contains(e.target as Node)) {
      open.value = false
    }
  }
  document.addEventListener('mousedown', handler)
  onUnmounted(() => document.removeEventListener('mousedown', handler))
})
</script>

<style scoped>
.date-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  height: 46px;
  padding: 0 14px;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  gap: 10px;
}

.date-input--dark {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.date-input--dark:hover { border-color: rgba(193, 127, 62, 0.35); }
.date-input--dark .date-value { color: white; }
.date-input--dark .date-placeholder { color: rgba(255, 255, 255, 0.55); }
.date-input--dark .date-icon { color: rgba(255, 255, 255, 0.55); }

.date-input--light {
  background: white;
  border: 1.5px solid #E0D5C8;
}
.date-input--light:hover { border-color: #C17F3E; }
.date-input--light .date-value { color: #2C2416; }
.date-input--light .date-placeholder { color: #9A8B73; }
.date-input--light .date-icon { color: #9A8B73; }

.date-value {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.date-icon { flex-shrink: 0; }

.cal-overlay {
  position: fixed;
  inset: 0;
  z-index: 150;
}

.cal-popup {
  width: 300px;
  background: #2C2416;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

.cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.cal-title {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #FAF6F0;
}
.cal-nav {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(250, 246, 240, 0.7);
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
.cal-nav:hover { background: rgba(193, 127, 62, 0.2); color: #FAF6F0; }

.cal-hint {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  color: rgba(250, 246, 240, 0.6);
  margin-bottom: 8px;
  text-align: center;
  min-height: 18px;
}
.cal-hint b {
  color: #E5C089;
  font-weight: 600;
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  margin-bottom: 4px;
}
.cal-weekdays span {
  text-align: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: rgba(250, 246, 240, 0.55);
  padding: 4px 0;
}

.cal-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.cal-day {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: #FAF6F0;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
  position: relative;
}
.cal-day:hover:not(.cal-disabled):not(.cal-empty) {
  background: rgba(193, 127, 62, 0.22);
}
.cal-empty { cursor: default; }
.cal-today { color: #C17F3E; font-weight: 700; }
.cal-in-range {
  background: rgba(193, 127, 62, 0.28);
  border-radius: 0;
}
.cal-start, .cal-end {
  background: #C17F3E !important;
  color: white !important;
  font-weight: 600;
  border-radius: 8px;
}
.cal-disabled { color: rgba(250, 246, 240, 0.15); cursor: default; }

.cal-footer {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
}
.cal-reset {
  background: transparent;
  border: none;
  color: rgba(250, 246, 240, 0.6);
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.15s;
}
.cal-reset:hover { color: #E5C089; }

.cal-enter-active { transition: opacity 0.15s ease; }
.cal-leave-active { transition: opacity 0.1s ease; }
.cal-enter-from, .cal-leave-to { opacity: 0; }
</style>
