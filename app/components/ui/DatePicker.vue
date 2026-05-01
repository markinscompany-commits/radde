<template>
  <div class="date-picker-wrap" ref="wrapRef">
    <div class="date-input" @click="open = !open">
      <span class="date-value" :class="{ 'date-placeholder': !modelValue }">
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
        <div v-if="open" class="cal-overlay" @click.self="open = false">
          <div class="cal-popup" :style="popupStyle" ref="popupRef">
            <!-- Header -->
            <div class="cal-header">
              <button @click="prevMonth" class="cal-nav">&larr;</button>
              <span class="cal-title">{{ monthName }} {{ year }}</span>
              <button @click="nextMonth" class="cal-nav">&rarr;</button>
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
                  'cal-selected': isSelected(day),
                  'cal-disabled': isDisabled(day),
                }"
                :disabled="isDisabled(day)"
                @click="selectDay(day)"
              >
                {{ day }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  minDate?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const wrapRef = ref<HTMLElement>()
const popupRef = ref<HTMLElement>()
const open = ref(false)
const popupStyle = ref<Record<string, string>>({})

const now = new Date()
const viewMonth = ref(props.modelValue ? new Date(props.modelValue).getMonth() : now.getMonth())
const viewYear = ref(props.modelValue ? new Date(props.modelValue).getFullYear() : now.getFullYear())

const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const monthName = computed(() => monthNames[viewMonth.value])
const year = computed(() => viewYear.value)

const daysInMonth = computed(() => {
  return new Date(viewYear.value, viewMonth.value + 1, 0).getDate()
})

const firstDayOffset = computed(() => {
  const day = new Date(viewYear.value, viewMonth.value, 1).getDay()
  return day === 0 ? 6 : day - 1 // Понедельник = 0
})

const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder || 'Выберите дату'
  const d = new Date(props.modelValue)
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
})

function isToday(day: number) {
  return day === now.getDate() && viewMonth.value === now.getMonth() && viewYear.value === now.getFullYear()
}

function isSelected(day: number) {
  if (!props.modelValue) return false
  const d = new Date(props.modelValue)
  return day === d.getDate() && viewMonth.value === d.getMonth() && viewYear.value === d.getFullYear()
}

function isDisabled(day: number) {
  if (!props.minDate) return false
  const date = new Date(viewYear.value, viewMonth.value, day)
  const min = new Date(props.minDate)
  min.setHours(0, 0, 0, 0)
  return date < min
}

function selectDay(day: number) {
  const y = viewYear.value
  const m = String(viewMonth.value + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  emit('update:modelValue', `${y}-${m}-${d}`)
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

// Позиционирование popup рядом с input
watch(open, (val) => {
  if (val && wrapRef.value) {
    const rect = wrapRef.value.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const showAbove = spaceBelow < 340

    popupStyle.value = {
      position: 'fixed',
      left: `${rect.left}px`,
      ...(showAbove
        ? { bottom: `${window.innerHeight - rect.top + 8}px` }
        : { top: `${rect.bottom + 8}px` }
      ),
      zIndex: '150',
    }
  }
})

// Закрыть при клике вне
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
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  height: 46px;
  padding: 0 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.date-input:hover {
  border-color: rgba(193, 127, 62, 0.35);
}
.date-value {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  color: white;
}
.date-placeholder {
  color: rgba(255, 255, 255, 0.55);
}
.date-icon {
  color: rgba(255, 255, 255, 0.55);
  flex-shrink: 0;
}

/* Overlay */
.cal-overlay {
  position: fixed;
  inset: 0;
  z-index: 150;
}

/* Popup */
.cal-popup {
  width: 280px;
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
  margin-bottom: 12px;
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
.cal-nav:hover {
  background: rgba(193, 127, 62, 0.2);
  color: #FAF6F0;
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
/* cal-weekdays — намеренное исключение из min 16px:
   подписи Пн/Вт/Ср... в календаре, иначе грид с числами раздувается */

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
  transition: all 0.15s;
}
/* cal-day — намеренное исключение из min 16px:
   календарь имеет ширину 280px, при 16px числа не помещаются в ячейки 7x7 */
.cal-day:hover:not(.cal-disabled):not(.cal-empty) {
  background: rgba(193, 127, 62, 0.2);
}
.cal-empty {
  cursor: default;
}
.cal-today {
  color: #C17F3E;
  font-weight: 700;
}
.cal-selected {
  background: #C17F3E !important;
  color: white !important;
  font-weight: 600;
}
.cal-disabled {
  color: rgba(250, 246, 240, 0.15);
  cursor: default;
}

/* Transition */
.cal-enter-active { transition: opacity 0.15s ease; }
.cal-leave-active { transition: opacity 0.1s ease; }
.cal-enter-from, .cal-leave-to { opacity: 0; }
</style>
