/**
 * Доступные номера на выбранные даты + кол-во гостей.
 *
 * Сейчас возвращает реалистичный mock — структура совпадает с тем, что вернёт
 * реальный Bnovo `/api/v2/availability` (см. radde/Bnovo API — справочник).
 * Когда клиент пришлёт API-ключ + lcode, заменим внутренности fetchAvailability()
 * на $fetch к нашему Nuxt-server-route, прокидывающему запрос в Bnovo.
 *
 * Доступность псевдо-случайная, но детерминированная по дате заезда + id типа,
 * чтобы при перезагрузке страницы в один день цифры не прыгали.
 */
import type { RoomDef } from './useRooms'

export interface AvailableRoom extends RoomDef {
  /** Сколько номеров этого типа свободно на выбранные даты */
  availableCount: number
  /** Общее кол-во номеров этого типа в фонде */
  totalCount: number
  /** Цена за ночь на выбранные даты (может отличаться от базовой по сезону) */
  pricePerNight: number
  /** Подходит ли номер под выбранное кол-во гостей */
  fitsGuests: boolean
}

const TOTAL_BY_TYPE: Record<string, number> = {
  vip: 9,
  panorama: 8,
  lux: 17,
  standard: 3,
}

/** Простейший детерминированный «hash» на базе строки */
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Сезонный коэффициент: летом дороже */
function seasonalMultiplier(arrivalIso: string): number {
  const m = new Date(arrivalIso).getMonth() // 0..11
  // Высокий: июнь–август (5–7), низкий: ноябрь–март (10,11,0,1,2)
  if (m >= 5 && m <= 7) return 1.15
  if (m >= 10 || m <= 2) return 0.92
  return 1.0
}

function mockAvailability(
  rooms: RoomDef[],
  arrival: string,
  departure: string,
  guests: number,
): AvailableRoom[] {
  const seasonal = seasonalMultiplier(arrival)
  return rooms.map(r => {
    const total = TOTAL_BY_TYPE[r.id] ?? 1
    // Доступность: 40–95% от фонда, зависит от даты + типа
    const seed = hashString(`${arrival}|${r.id}`)
    const minFree = Math.max(1, Math.floor(total * 0.4))
    const range = total - minFree + 1
    const available = minFree + (seed % range)
    const price = Math.round((r.priceValue * seasonal) / 50) * 50
    return {
      ...r,
      availableCount: available,
      totalCount: total,
      pricePerNight: price,
      fitsGuests: guests <= r.guests,
    }
  })
}

export interface AvailabilityQuery {
  arrival: Ref<string> | ComputedRef<string>
  departure: Ref<string> | ComputedRef<string>
  adults: Ref<number> | ComputedRef<number>
  children: Ref<number> | ComputedRef<number>
}

export function useAvailableRooms(query: AvailabilityQuery) {
  const allRooms = useRooms()
  const rooms = ref<AvailableRoom[]>([])
  const loading = ref(false)
  const error = ref<string>('')

  async function fetchAvailability() {
    const arrival = unref(query.arrival)
    const departure = unref(query.departure)
    if (!arrival || !departure || departure <= arrival) {
      rooms.value = []
      return
    }
    const guests = Math.max(1, unref(query.adults) + unref(query.children))
    loading.value = true
    error.value = ''
    try {
      // === Когда подключим Bnovo: ===
      // const data = await $fetch<AvailableRoom[]>('/api/availability', {
      //   query: { arrival, departure, adults: query.adults, children: query.children }
      // })
      // rooms.value = data
      //
      // Сейчас — mock с задержкой 250 мс, чтобы UI показал loader
      await new Promise(r => setTimeout(r, 250))
      rooms.value = mockAvailability(allRooms, arrival, departure, guests)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить доступность'
      rooms.value = []
    } finally {
      loading.value = false
    }
  }

  // Автоматически перезагружаем при изменении дат/гостей
  watch(
    [query.arrival, query.departure, query.adults, query.children],
    () => { fetchAvailability() },
    { immediate: true },
  )

  return { rooms, loading, error, refresh: fetchAvailability }
}
