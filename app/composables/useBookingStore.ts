/**
 * Глобальный стор бронирования: даты, гости, выбранный номер,
 * дополнительные услуги, контактные данные и комментарий.
 *
 * Состояние сохраняется в localStorage (`radde_booking_v1`) после каждого
 * изменения, чтобы данные не терялись при переходах между страницами,
 * закрытии вкладки и т.п.
 *
 * Payload для /api/booking собирается прямо на странице /booking,
 * формат — см. server/utils/schemas.ts (bookingSchema).
 */
import type { ExtraDef } from './useBookingExtras'
import type { RoomDef } from './useRooms'

export interface BookingExtraSelection {
  id: string
  /**
   * Количество услуг.
   *  - unit='session': сколько раз заказывают (1 экскурсия, 2 экскурсии…).
   *  - unit='night': сколько раз × nights.
   *  - unit='guest', perNight=false: сколько раз каждый участник получает услугу
   *    (например 2 конные прогулки).
   *  - unit='guest', perNight=true: множитель за ночь (обычно 1).
   */
  count: number
  /**
   * Только для extras с unit='guest': сколько гостей участвует.
   * По умолчанию — все гости (totalGuests).
   * Игнорируется для unit='night' и unit='session'.
   */
  people?: number
}

export interface BookingGuest {
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
}

export interface BookingMultiRoomItem {
  /** slug категории номера (vip/panorama/lux/standard) */
  id: string
  /** Сколько физических номеров этого типа */
  count: number
}

export interface BookingState {
  arrival: string
  departure: string
  adults: number
  children: number
  /** Возрасты детей (0-17), длина массива должна равняться `children`.
   *  Bnovo требует именно массив возрастов для правильного расчёта цены —
   *  на сайте показываем по одному селекту на каждого ребёнка. */
  childrenAges: number[]
  roomId: string | null
  /**
   * Мульти-номер выбор для большой компании. Если задан — используется вместо
   * `roomId`. UI и backend обрабатывают набор как один заказ из N номеров.
   * Null = одиночный режим, выбор через `roomId`.
   */
  multiRoom: BookingMultiRoomItem[] | null
  extras: BookingExtraSelection[]
  guest: BookingGuest
  comment: string
}

const STORAGE_KEY = 'radde_booking_v1'

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function plusDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function defaultState(): BookingState {
  const arrival = todayIso()
  return {
    arrival,
    departure: plusDays(arrival, 2),
    adults: 2,
    children: 0,
    childrenAges: [],
    roomId: null,
    multiRoom: null,
    extras: [],
    guest: { firstName: '', lastName: '', email: '', phone: '', city: '' },
    comment: '',
  }
}

function loadFromStorage(): BookingState {
  if (!import.meta.client) return defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<BookingState>
    const fallback = defaultState()
    // если в кэше прошедшая дата заезда — переписываем на сегодня
    const today = todayIso()
    let arrival = parsed.arrival || fallback.arrival
    if (arrival < today) arrival = today
    let departure = parsed.departure || fallback.departure
    if (departure <= arrival) departure = plusDays(arrival, 2)
    return {
      arrival,
      departure,
      adults: parsed.adults ?? fallback.adults,
      children: parsed.children ?? fallback.children,
      childrenAges: Array.isArray(parsed.childrenAges)
        ? parsed.childrenAges.filter((a: unknown): a is number => typeof a === 'number' && a >= 0 && a <= 17)
        : [],
      roomId: parsed.roomId ?? null,
      multiRoom: Array.isArray(parsed.multiRoom)
        ? parsed.multiRoom
            .filter((m): m is BookingMultiRoomItem =>
              !!m && typeof m.id === 'string' && typeof m.count === 'number' && m.count > 0,
            )
            .map(m => ({ id: m.id, count: m.count }))
        : null,
      extras: Array.isArray(parsed.extras)
        ? parsed.extras
            .filter(e => e && typeof e.id === 'string' && e.count > 0)
            .map(e => ({
              id: e.id,
              count: e.count,
              people: typeof e.people === 'number' && e.people > 0 ? e.people : undefined,
            }))
        : [],
      guest: { ...fallback.guest, ...(parsed.guest || {}) },
      comment: parsed.comment ?? '',
    }
  } catch {
    return defaultState()
  }
}

function saveToStorage(state: BookingState) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // переполнение / приватный режим — игнорируем
  }
}

/**
 * Singleton-стор. useState хранит состояние между переходами
 * между страницами, watch — синхронизирует в localStorage.
 */
export function useBookingStore() {
  const state = useState<BookingState>('booking-store', () => defaultState())

  // На клиенте догружаем из localStorage один раз и подключаем автосохранение
  const hydrated = useState<boolean>('booking-store-hydrated', () => false)
  if (import.meta.client && !hydrated.value) {
    hydrated.value = true
    const loaded = loadFromStorage()
    state.value = loaded
    // flush: 'sync' — чтобы localStorage обновлялся сразу после мутации,
    // а не на следующем тике. Иначе при window.location.href сразу после
    // setQuery() данные не успевают сохраниться.
    watch(state, (val) => saveToStorage(val), { deep: true, flush: 'sync' })
  }

  // Производные значения
  const nights = computed(() => {
    const a = new Date(state.value.arrival)
    const d = new Date(state.value.departure)
    const diff = d.getTime() - a.getTime()
    return Math.max(0, Math.round(diff / 86400000))
  })

  // ----- мутаторы -----

  function setQuery(q: { arrival: string; departure: string; adults: number; children: number }) {
    state.value.arrival = q.arrival
    state.value.departure = q.departure
    state.value.adults = q.adults
    state.value.children = q.children
  }

  function setRoom(id: string | null) {
    state.value.roomId = id
    // Одиночный и мульти-номер выбор взаимоисключаются — выбор одного зануляет другой.
    if (id) state.value.multiRoom = null
  }

  function setMultiRoom(items: BookingMultiRoomItem[] | null) {
    state.value.multiRoom = items && items.length > 0 ? items.map(m => ({ ...m })) : null
    if (state.value.multiRoom) state.value.roomId = null
  }

  function setExtraCount(id: string, count: number, opts?: { people?: number }) {
    const idx = state.value.extras.findIndex(e => e.id === id)
    if (count <= 0) {
      if (idx >= 0) state.value.extras.splice(idx, 1)
      return
    }
    if (idx >= 0) {
      state.value.extras[idx]!.count = count
      if (typeof opts?.people === 'number') state.value.extras[idx]!.people = opts.people
    } else {
      state.value.extras.push({ id, count, people: opts?.people })
    }
  }

  function getExtraCount(id: string): number {
    return state.value.extras.find(e => e.id === id)?.count || 0
  }

  function getExtraPeople(id: string, fallback: number): number {
    const p = state.value.extras.find(e => e.id === id)?.people
    return typeof p === 'number' && p > 0 ? p : fallback
  }

  function setExtraPeople(id: string, people: number) {
    const sel = state.value.extras.find(e => e.id === id)
    if (sel) sel.people = Math.max(1, people)
  }

  function clearExtras() {
    state.value.extras = []
  }

  function reset() {
    state.value = defaultState()
  }

  return {
    state,
    nights,
    setQuery,
    setRoom,
    setMultiRoom,
    setExtraCount,
    getExtraCount,
    getExtraPeople,
    setExtraPeople,
    clearExtras,
    reset,
  }
}

// ----- расчёт стоимости -----

/**
 * Эффективное число участников guest-extra. Если `people` не задан — по умолчанию
 * все гости. Иначе берём указанное число, ограниченное сверху общим составом.
 */
export function extraGuestPeople(sel: BookingExtraSelection, totalGuests: number): number {
  if (typeof sel.people === 'number' && sel.people > 0) {
    return Math.min(sel.people, Math.max(1, totalGuests))
  }
  return Math.max(1, totalGuests)
}

export function extraSubtotal(
  extra: ExtraDef,
  sel: BookingExtraSelection,
  totalGuests: number,
  nights: number,
): number {
  if (sel.count <= 0) return 0
  switch (extra.unit) {
    case 'guest': {
      const people = extraGuestPeople(sel, totalGuests)
      const perNightMul = extra.perNight ? Math.max(1, nights) : 1
      return extra.priceValue * people * sel.count * perNightMul
    }
    case 'night':
      return extra.priceValue * sel.count * Math.max(1, nights)
    case 'session':
    default:
      return extra.priceValue * sel.count
  }
}

export function calculateTotal(
  state: BookingState,
  room: RoomDef | undefined,
  extrasMeta: ExtraDef[],
  nights: number,
): { roomTotal: number; extrasTotal: number; total: number } {
  const roomTotal = room ? room.priceValue * Math.max(1, nights) : 0
  let extrasTotal = 0
  const totalGuests = state.adults + state.children
  for (const sel of state.extras) {
    const meta = extrasMeta.find(e => e.id === sel.id)
    if (!meta) continue
    extrasTotal += extraSubtotal(meta, sel, totalGuests, nights)
  }
  return { roomTotal, extrasTotal, total: roomTotal + extrasTotal }
}

