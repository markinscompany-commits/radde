// Поиск ближайшего свободного окна нужной длительности, под нужный состав гостей.
// Используется когда на запрошенные даты номеров нет: сканируем вперёд окнами по
// `nights` ночей и возвращаем ПЕРВОЕ (самое раннее), где подходящий номер или
// НАБОР номеров реально свободен.
//
// Окна-кандидаты запрашиваются ПАРАЛЛЕЛЬНО (Promise.all) — иначе при последовательном
// опросе Bnovo (каждый запрос до ~2-5с) фронт ловил таймаут и показывал ошибку.
// Каждый запрос rates кэшируется 5 мин внутри fetchBnovoRates.
import { fetchBnovoRates, type BnovoRateForRoom } from './bnovo-rates'

export type NextWindow = { from: string; to: string; nights: number } | null

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Свободна ли категория на эти даты (статус + есть физические номера). */
function roomOpen(r: BnovoRateForRoom): boolean {
  return r.status === 'available' && r.available_count > 0 && !!r.site_slug && r.site_slug !== 'dom'
}

/** Вмещает ли категория состав одним номером. */
function fitsSingle(r: BnovoRateForRoom, party: number): boolean {
  return roomOpen(r) && (r.capacity_max == null || r.capacity_max >= party)
}

/**
 * Можно ли рассадить `party` гостей доступными номерами — одним или НАБОРОМ.
 * Жадно: собираем вместимости всех свободных физических номеров (по available_count
 * экземпляров каждой категории), берём по убыванию, пока не покроем состав.
 */
function canSeatParty(rooms: BnovoRateForRoom[], party: number): boolean {
  const caps: number[] = []
  for (const r of rooms) {
    if (!roomOpen(r)) continue
    const cap = r.capacity_max && r.capacity_max > 0 ? r.capacity_max : 1
    for (let i = 0; i < r.available_count; i++) caps.push(cap)
  }
  caps.sort((a, b) => b - a)
  let sum = 0
  for (const c of caps) {
    sum += c
    if (sum >= party) return true
  }
  return false
}

/**
 * Находит ближайшее окно длиной `nights`, начиная с завтрашнего дня, где есть
 * свободный номер (или набор) под состав (adults+children).
 *  - slug задан → ищем именно эту категорию одним номером.
 *  - slug пуст → ищем любой одиночный номер ИЛИ набор номеров под состав.
 * Окна непересекающиеся (шаг = nights), запрашиваются параллельно.
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
  const maxProbes = Math.max(1, Math.min(opts.maxProbes ?? 9, 14))

  // Кандидаты: окна со старта (завтра), шаг = nights.
  const start = addDays(todayIso(), 1)
  const windows: Array<{ from: string; to: string }> = []
  for (let i = 0; i < maxProbes; i++) {
    const from = addDays(start, i * nights)
    windows.push({ from, to: addDays(from, nights) })
  }

  // Параллельно запрашиваем все окна. Ошибку отдельного окна гасим в пустой массив.
  const results = await Promise.all(
    windows.map((w) =>
      fetchBnovoRates({ arrival: w.from, departure: w.to, adults, children })
        .then((res) => res.rooms)
        .catch(() => [] as BnovoRateForRoom[]),
    ),
  )

  // Возвращаем самое раннее окно, где состав помещается.
  for (let i = 0; i < windows.length; i++) {
    const rooms = results[i]!
    const ok = slug
      ? rooms.some((r) => r.site_slug === slug && fitsSingle(r, party))
      : rooms.some((r) => fitsSingle(r, party)) || canSeatParty(rooms, party)
    if (ok) return { from: windows[i]!.from, to: windows[i]!.to, nights }
  }
  return null
}
