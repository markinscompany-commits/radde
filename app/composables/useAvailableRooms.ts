/**
 * Доступные номера на выбранные даты + кол-во гостей.
 * Источник — наш серверный роут /api/availability, который ходит на форму
 * Bnovo и парсит live-цены/availability/альтернативные даты.
 *
 * Одна карточка на ТИП номера (vip/panorama/lux/standard), а не на каждый
 * физический room_id. Bnovo сам агрегирует.
 *
 * Если /api/availability упал или вернул error — отдаём fallback из useRooms()
 * (статичные «от X ₽» цены), чтобы UI не ломался.
 */
import type { RoomDef } from './useRooms'
import type { AvailabilityResponse, AvailabilityForSlug, PriceVariant } from '~~/shared/bnovo'

export interface AvailableRoom extends RoomDef {
  /** Сколько номеров этого типа свободно на выбранные даты (0 если закрыт) */
  availableCount: number
  /** Цена за ночь на выбранные даты (минимум по типу). Может равняться priceValue если PMS не ответил. */
  pricePerNight: number
  /** Подходит ли номер под выбранное кол-во гостей */
  fitsGuests: boolean
  /** Доступен ли вообще на эти даты */
  available: boolean
  /** Реальный лимит, по которому проверяется fitsGuests (capacity_max из PMS или static r.guests). */
  effectiveCapacity: number
  /** Ближайшая дата заезда (ISO YYYY-MM-DD) когда категория свободна — null если она и так свободна */
  nextAvailableFrom: string | null
  /** Дата выезда предлагаемой альтернативы (ISO) — обычно arrival+requestedNights */
  nextAvailableTo: string | null
  /** Длительность предлагаемой альтернативы в ночах (= длительности исходного запроса при удачном matche) */
  nextAvailableNights: number | null
  /**
   * Прайс-сетка по составам гостей из PMS (отсортирована по цене).
   * Пустой массив если PMS молчит или у категории нет подкатегорий.
   */
  priceVariants: PriceVariant[]
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

  function buildFallback(adults: number, children: number): AvailableRoom[] {
    const guests = Math.max(1, adults + children)
    return allRooms.map(r => ({
      ...r,
      availableCount: 0,
      pricePerNight: r.priceValue,
      fitsGuests: guests <= r.guests,
      effectiveCapacity: r.guests,
      available: false,
      nextAvailableFrom: null,
      nextAvailableTo: null,
      nextAvailableNights: null,
      priceVariants: [],
    }))
  }

  function mergeWithBnovo(
    bnovoRooms: AvailabilityForSlug[],
    adults: number,
    children: number,
  ): AvailableRoom[] {
    const bySlug = new Map<string, AvailabilityForSlug>()
    for (const r of bnovoRooms) bySlug.set(r.slug, r)

    const guests = Math.max(1, adults + children)
    return allRooms.map(r => {
      const b = bySlug.get(r.id)
      if (!b) {
        return {
          ...r,
          availableCount: 0,
          pricePerNight: r.priceValue,
          fitsGuests: guests <= r.guests,
          effectiveCapacity: r.guests,
          available: false,
          nextAvailableFrom: null,
          nextAvailableNights: null,
          priceVariants: [],
        }
      }
      // fits проверяем по физическому r.guests (статика из useRooms) — это «правда»
      // о вместимости номера. capacity_max из PMS может быть меньше (если подкатегория
      // не настроена), но для гостя важна реальная физическая вместимость.
      return {
        ...r,
        availableCount: b.available_count,
        pricePerNight: b.price_per_night ?? r.priceValue,
        fitsGuests: guests <= r.guests,
        effectiveCapacity: r.guests,
        available: b.available,
        nextAvailableFrom: b.next_available_from,
        nextAvailableTo: b.next_available_to,
        nextAvailableNights: b.next_available_nights,
        priceVariants: b.variants ?? [],
      }
    })
  }

  async function fetchAvailability() {
    const arrival = unref(query.arrival)
    const departure = unref(query.departure)
    const adults = unref(query.adults)
    const children = unref(query.children)
    if (!arrival || !departure || departure <= arrival) {
      rooms.value = []
      return
    }
    loading.value = true
    error.value = ''
    try {
      const data = await $fetch<AvailabilityResponse>('/api/availability', {
        query: { arrival, departure, adults, children },
      })
      rooms.value = mergeWithBnovo(data.rooms, adults, children)
      if (data.error) error.value = data.error
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Не удалось загрузить доступность'
      // Fallback: показываем статичные карточки с базовой ценой
      rooms.value = buildFallback(adults, children)
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
