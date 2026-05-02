/**
 * Глобальный стор бронирования: даты, гости, выбранный номер,
 * дополнительные услуги, контактные данные и комментарий.
 *
 * Состояние сохраняется в localStorage (`radde_booking_v1`) после каждого
 * изменения, чтобы данные не терялись при переходах между страницами,
 * закрытии вкладки и т.п.
 *
 * Структура совместима с Bnovo API v2 (POST /bookings):
 *   - arrival / departure → строки YYYY-MM-DD
 *   - rooms[]: { room_type_id, rate_id, guests: [{ adults, children }] }
 *   - guest: { first_name, last_name, email, phone }
 *   - extras: [{ id: bnovoServiceId, count }]
 *   - comment, source_id
 *
 * `toBnovoPayload(state)` собирает готовый body. До того как клиент
 * пришлёт lcode + маппинг номеров на bnovoRoomTypeId/RateId, payload
 * остаётся «черновиком» (поля null) и отправляется как лид.
 */
import type { ExtraDef } from './useBookingExtras'
import type { RoomDef } from './useRooms'

export interface BookingExtraSelection {
  id: string
  count: number
}

export interface BookingGuest {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface BookingState {
  arrival: string
  departure: string
  adults: number
  children: number
  roomId: string | null
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
    roomId: null,
    extras: [],
    guest: { firstName: '', lastName: '', email: '', phone: '' },
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
      roomId: parsed.roomId ?? null,
      extras: Array.isArray(parsed.extras) ? parsed.extras.filter(e => e && typeof e.id === 'string' && e.count > 0) : [],
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
  }

  function setExtraCount(id: string, count: number) {
    const idx = state.value.extras.findIndex(e => e.id === id)
    if (count <= 0) {
      if (idx >= 0) state.value.extras.splice(idx, 1)
      return
    }
    if (idx >= 0) state.value.extras[idx]!.count = count
    else state.value.extras.push({ id, count })
  }

  function getExtraCount(id: string): number {
    return state.value.extras.find(e => e.id === id)?.count || 0
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
    setExtraCount,
    getExtraCount,
    clearExtras,
    reset,
  }
}

// ----- расчёт стоимости -----

export function extraSubtotal(extra: ExtraDef, count: number, adults: number, nights: number): number {
  if (count <= 0) return 0
  switch (extra.unit) {
    case 'guest': return extra.priceValue * count * Math.max(1, adults) * Math.max(1, nights)
    case 'night': return extra.priceValue * count * Math.max(1, nights)
    case 'session':
    default: return extra.priceValue * count
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
  for (const sel of state.extras) {
    const meta = extrasMeta.find(e => e.id === sel.id)
    if (!meta) continue
    extrasTotal += extraSubtotal(meta, sel.count, state.adults, nights)
  }
  return { roomTotal, extrasTotal, total: roomTotal + extrasTotal }
}

// ----- маппинг под Bnovo -----

export interface BnovoBookingPayload {
  arrival: string
  departure: string
  rooms: Array<{
    room_type_id: number | null
    rate_id: number | null
    guests: Array<{ adults: number; children: number }>
  }>
  guest: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
  extras: Array<{ id: number | null; slug: string; count: number }>
  comment: string
}

export function toBnovoPayload(
  state: BookingState,
  room: RoomDef | undefined,
  extrasMeta: ExtraDef[],
): BnovoBookingPayload {
  return {
    arrival: state.arrival,
    departure: state.departure,
    rooms: [
      {
        room_type_id: room?.bnovoRoomTypeId ?? null,
        rate_id: room?.bnovoRateId ?? null,
        guests: [{ adults: state.adults, children: state.children }],
      },
    ],
    guest: {
      first_name: state.guest.firstName,
      last_name: state.guest.lastName,
      email: state.guest.email,
      phone: state.guest.phone,
    },
    extras: state.extras.map(sel => {
      const meta = extrasMeta.find(e => e.id === sel.id)
      return { id: meta?.bnovoServiceId ?? null, slug: sel.id, count: sel.count }
    }),
    comment: state.comment,
  }
}
