// Поиск ближайшего свободного окна нужной длительности, под нужный состав гостей.
// Используется когда на запрошенные даты номеров нет: сканируем вперёд окнами по
// `nights` ночей и возвращаем первое, где подходящий номер реально свободен.
//
// Bnovo magic_calendar иногда не отдаёт альтернатив вовсе — тогда без такого
// прямого скана гость видел тупик «занят на весь период». Скан ограничен
// (maxProbes), каждый запрос rates кэшируется 5 мин в fetchBnovoRates.
import { fetchBnovoRates } from './bnovo-rates'

export type NextWindow = { from: string; to: string; nights: number } | null

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Находит ближайшее окно длиной `nights`, начиная с завтрашнего дня, где есть
 * свободный номер под состав (adults+children).
 *  - slug задан → ищем именно эту категорию.
 *  - slug пуст → ищем любую категорию, вмещающую состав.
 * Сканируем непересекающимися окнами (шаг = nights), максимум maxProbes окон.
 */
export async function findNextAvailableWindow(opts: {
  nights: number
  adults: number
  children: number
  slug?: string | null
  maxProbes?: number
}): Promise<NextWindow> {
  const nights = Math.max(1, Math.floor(opts.nights || 1))
  const adults = Math.max(1, Math.floor(opts.adults || 1))
  const children = Math.max(0, Math.floor(opts.children || 0))
  const party = adults + children
  const slug = opts.slug || null
  const maxProbes = Math.max(1, Math.min(opts.maxProbes ?? 8, 14))

  // Старт — завтра (сегодня обычно уже не заехать).
  let from = addDays(todayIso(), 1)

  for (let i = 0; i < maxProbes; i++) {
    const to = addDays(from, nights)
    let rooms
    try {
      const res = await fetchBnovoRates({ arrival: from, departure: to, adults, children })
      rooms = res.rooms
    } catch {
      rooms = []
    }
    const fits = (r: (typeof rooms)[number]) =>
      r.status === 'available' &&
      r.available_count > 0 &&
      (r.capacity_max == null || r.capacity_max >= party)

    const hit = slug
      ? rooms.some((r) => r.site_slug === slug && fits(r))
      : rooms.some((r) => !!r.site_slug && r.site_slug !== 'dom' && fits(r))

    if (hit) return { from, to, nights }
    from = addDays(from, nights)
  }
  return null
}
