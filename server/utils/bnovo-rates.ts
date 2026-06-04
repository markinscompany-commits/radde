// Live-цены и availability из Bnovo через парсинг публичной HTML-страницы
// формы бронирования (reservationsteps.ru/rooms/index/<lcode>). API v1 на
// тарифе клиента справочники не отдаёт, а сама форма содержит всё что нам
// нужно: список категорий, цены за ночь, доступное кол-во номеров,
// ближайшие альтернативные даты (magic_calendar) для закрытых типов.
//
// Структура HTML разобрана 13.05.2026 на сохранённой странице
// radde/bnovo_tests/Модуль онлайн бронирования.html.
// Точки опоры:
//   <li ... data-category-id="N" data-status-group="available|magic_calendar" data-name="X">
//   <div class="room room-shown" data-roomtype-id="N" ...>
//     <span ... data-tariff-price="6000">
//     <select ... data-real-room-id="N" data-room-id="N" data-room-type-title="Y" data-available="2" data-minprice="6000" data-maxprice="6000" data-plan-id="91433">
//     <a class="tariff__alternative_link" rel="0" href="...?dfrom=14-05-2026&dto=15-05-2026&...">

import { getSiteSlugByBnovoTypeId } from './bnovo-mapping'

const ORIGIN = 'https://reservationsteps.ru'

export type BnovoTariffVariant = {
  adults: number    // взрослых в sub-category
  children: number  // детей в sub-category
  price_per_night: number
}

export type BnovoRateForRoom = {
  /** Bnovo room_type_id, например 193604 */
  room_type_id: number
  /** Слаг на нашем сайте (vip/panorama/lux/standard) — если категория есть у нас */
  site_slug: string | null
  /** Заголовок категории как в Bnovo, для логов */
  title: string
  /** Статус из <li data-status-group>: "available" — есть на запрошенные даты, "magic_calendar" — закрыт, но Bnovo предложит альтернативы */
  status: 'available' | 'magic_calendar' | 'unknown'
  /**
   * Все sub-категории внутри родительской категории Bnovo для запрошенных дат.
   * Каждая имеет свою вместимость (adults + children) и цену. API endpoint
   * выберет ту, что подходит запрошенному составу гостей.
   */
  variants: BnovoTariffVariant[]
  /** Минимальная цена среди variants (самая дешёвая sub-category) */
  price_per_night_min: number | null
  /** Максимальная цена среди variants (самая дорогая sub-category) */
  price_per_night_max: number | null
  /** Сколько физических номеров категории свободно на запрошенные даты */
  available_count: number
  /** Максимальная вместимость sub-category по гостям (для проверки fits) */
  capacity_max: number | null
  /** Plan ID тарифа из Bnovo, на основе которого считалась цена */
  plan_id: number | null
  /**
   * Ближайшие альтернативные даты, которые сам Bnovo нашёл для magic_calendar:
   * массив пар { dfrom: "14-05-2026", dto: "15-05-2026" }.
   * Берём только реальные альтернативы (rel=0..3 в HTML).
   */
  alternatives: Array<{ dfrom: string; dto: string }>
}

export type BnovoRatesResult = {
  rooms: BnovoRateForRoom[]
  fetched_at: number
  source_url: string
}

// Конвертация YYYY-MM-DD -> DD-MM-YYYY (формат Bnovo)
function toBnovoDate(isoDate: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!m) throw new Error(`Invalid date format: ${isoDate} (expected YYYY-MM-DD)`)
  return `${m[3]}-${m[2]}-${m[1]}`
}

// Конвертация DD-MM-YYYY -> YYYY-MM-DD
export function fromBnovoDate(bnovoDate: string): string | null {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(bnovoDate)
  if (!m) return null
  return `${m[3]}-${m[2]}-${m[1]}`
}

// In-process cache. Перезапуск PM2 = новая загрузка (норм).
// Ключ — `arrival|departure|adults|children`, TTL 5 минут.
const cache = new Map<string, { result: BnovoRatesResult; expiresAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000

function cacheKey(arrival: string, departure: string, adults: number, children: number): string {
  return `${arrival}|${departure}|${adults}|${children}`
}

export async function fetchBnovoRates(opts: {
  arrival: string   // YYYY-MM-DD
  departure: string // YYYY-MM-DD
  adults: number
  children: number
  /** Сбросить кэш по этому ключу и загрузить заново */
  bust?: boolean
}): Promise<BnovoRatesResult> {
  const { bnovoLcode } = useRuntimeConfig()
  if (!bnovoLcode) {
    throw new Error('NUXT_BNOVO_LCODE не задан')
  }

  const adults = Math.max(1, Math.floor(opts.adults || 1))
  const children = Math.max(0, Math.floor(opts.children || 0))
  const key = cacheKey(opts.arrival, opts.departure, adults, children)

  if (!opts.bust) {
    const hit = cache.get(key)
    if (hit && hit.expiresAt > Date.now()) return hit.result
  }

  // PMS требует children в формате JSON-array возрастов в URL (children=[10,8]).
  // Без этого параметра HTML не содержит подкатегорий для семейного состава
  // (например «Lux для двоих и ребёнка»), и парсер пропускает нужный variant.
  // Возрасты в формуле цены не используются (тариф подбирается по числу adults/children
  // в подкатегории), но PMS требует валидный массив.
  const childAges = children > 0 ? Array.from({ length: children }, () => 10) : []
  const params = new URLSearchParams({
    servicemode: '0',
    adults: String(adults),
    firstroom: '0',
    dfrom: toBnovoDate(opts.arrival),
    dto: toBnovoDate(opts.departure),
    promoCode: '',
    colorSchemePreview: '0',
    onlyrooms: '',
    insidePopup: '0',
    lang: 'ru',
    // magic_calendar=1 -> PMS сам подбирает альтернативные даты для закрытых типов
    magic_calendar: '1',
  })
  if (childAges.length > 0) {
    params.set('children', JSON.stringify(childAges))
  }
  const url = `${ORIGIN}/rooms/index/${bnovoLcode}?${params.toString()}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RaddeBookingProxy/1.0; +https://radde.ru)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
      'Accept-Language': 'ru-RU,ru;q=0.9',
      Referer: `${ORIGIN}/`,
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(20_000),
  })

  if (!res.ok) {
    throw new Error(`Bnovo form HTTP ${res.status}`)
  }

  const html = await res.text()
  const rawRooms = parseBnovoRatesHtml(html)

  // PMS Bnovo рисует на странице ИТОГОВУЮ цену за весь период проживания
  // (data-tariff-price = total за nights). Парсер забирает её as-is, а
  // здесь мы переводим в per-night, поделив на число ночей.
  //
  // ВАЖНО: НЕ округляем здесь — храним точное float значение. Иначе при
  // total=28000 / nights=3 = 9333.33 → round=9333 → ×3 = 27999, теряем рубль
  // относительно того что Bnovo показывает гостю в итоге. UI округляет при
  // отображении (Math.round при выводе), а итог считает точным умножением.
  const nights = Math.max(
    1,
    Math.round((Date.parse(opts.departure) - Date.parse(opts.arrival)) / 86400000),
  )
  const rooms: BnovoRateForRoom[] = rawRooms.map(r => ({
    ...r,
    variants: r.variants.map(v => ({
      ...v,
      price_per_night: v.price_per_night / nights,
    })),
    price_per_night_min: r.price_per_night_min != null ? r.price_per_night_min / nights : null,
    price_per_night_max: r.price_per_night_max != null ? r.price_per_night_max / nights : null,
  }))

  const result: BnovoRatesResult = {
    rooms,
    fetched_at: Date.now(),
    source_url: url,
  }
  cache.set(key, { result, expiresAt: Date.now() + CACHE_TTL_MS })
  return result
}

// --- Парсер ---

/** Парсит HTML страницы reservationsteps.ru/rooms/index/<lcode>. */
export function parseBnovoRatesHtml(html: string): BnovoRateForRoom[] {
  // Шаг 1: словарь категорий из верхней панели фильтров
  //   <li ... data-category-id="N" data-status-group="X" data-name="Y" ...>
  const categories = new Map<number, { name: string; status: BnovoRateForRoom['status'] }>()
  const liRe = /<li[^>]*data-category-id="(\d+)"[^>]*data-status-group="([^"]+)"[^>]*data-name="([^"]*)"/g
  for (const m of html.matchAll(liRe)) {
    const id = Number(m[1])
    const status = (m[2] === 'available' || m[2] === 'magic_calendar') ? m[2] as BnovoRateForRoom['status'] : 'unknown'
    if (!categories.has(id)) {
      categories.set(id, { name: m[3], status })
    }
  }

  // Шаг 2: блоки room-shown с ценами и availability
  //   <div class="room room-shown" data-roomtype-id="N" ...>
  // Внутри ищем data-tariff-price (отображаемая цена),
  // и select'ы с data-real-room-id, data-available, data-minprice, data-maxprice, data-plan-id.
  // Также ищем tariff__alternative_link для magic_calendar.
  const result: BnovoRateForRoom[] = []

  // Разбиваем HTML по началу каждого блока room-shown
  const roomBlockRe = /<div[^>]*class="room room-shown"[^>]*data-roomtype-id="(\d+)"[^>]*>/g
  const matches = [...html.matchAll(roomBlockRe)]

  for (let i = 0; i < matches.length; i++) {
    const startIdx = matches[i].index!
    const endIdx = i + 1 < matches.length ? matches[i + 1].index! : html.length
    const block = html.slice(startIdx, endIdx)
    const roomTypeId = Number(matches[i][1])

    // Все select.selectAvailable внутри блока (могут быть «бронируемые» и «накопительные» комнаты)
    const selects = [...block.matchAll(/<select[^>]*class="select selectAvailable"[^>]*>/g)].map(m => m[0])

    // Главное правило: первый select с непустым data-room-type-title — это «корневая» категория
    // (например data-real-room-id=193603, data-room-id=193603, data-room-type-title="Люкс").
    // Остальные select'ы того же real-room-id — это конкретные физические номера, цены которых
    // нам тоже учитывать в min/max.

    let title = ''
    let planId: number | null = null
    let priceMin: number | null = null
    let priceMax: number | null = null
    let availableSum = 0
    let capacityMax: number | null = null

    for (const sel of selects) {
      const realRoomId = Number(/data-real-room-id="(\d+)"/.exec(sel)?.[1] ?? '0')
      if (realRoomId !== roomTypeId) continue
      const roomId = Number(/data-room-id="(\d+)"/.exec(sel)?.[1] ?? '0')
      const t = /data-room-type-title="([^"]*)"/.exec(sel)?.[1] ?? ''
      const minp = Number(/data-minprice="(\d+(?:\.\d+)?)"/.exec(sel)?.[1] ?? '0')
      const maxp = Number(/data-maxprice="(\d+(?:\.\d+)?)"/.exec(sel)?.[1] ?? '0')
      const avail = Number(/data-available="(\d+)"/.exec(sel)?.[1] ?? '0')
      const pid = Number(/data-plan-id="(\d+)"/.exec(sel)?.[1] ?? '0')

      if (t && !title) title = t
      if (pid && !planId) planId = pid

      if (minp > 0) priceMin = priceMin == null ? minp : Math.min(priceMin, minp)
      if (maxp > 0) priceMax = priceMax == null ? maxp : Math.max(priceMax, maxp)

      // data-table-id — вместимость sub-category в гостях (например 4 для «Стандарт» или 6 для «Люкс для трёх взрослых»)
      const tableId = Number(/data-table-id="(\d+)"/.exec(sel)?.[1] ?? '0')
      if (tableId > 0) capacityMax = capacityMax == null ? tableId : Math.max(capacityMax, tableId)

      // «Главный» select для room_id === room_type_id определяет capacity и не дублирует,
      // дополнительные физические номера прибавляются к accommodation, не к available.
      // Чтобы не задвоить, считаем available только когда roomId === realRoomId (как в форме).
      if (roomId === realRoomId) {
        availableSum += avail
      }
    }

    // Собираем все sub-категории внутри блока. Bnovo рисует каждую sub-category
    // как пару: блок `<div class="guest-list">` с иконками гостей (adult/child)
    // + следующий `<span ... data-tariff-price="N">` с ценой. Сопоставляем по позиции.
    //
    // Важно: считаем иконки ТОЛЬКО внутри `<div class="guest-list__item">` —
    // это реальные слоты гостей. Внутри guest-list блока Bnovo также рендерит
    // tooltip (`<div class="tooltip__template">`) с пояснением «Взрослые: 2, Дети: 1»,
    // где те же иконки дублируются. Без этой фильтрации парсер ошибается:
    // например «Lux для двоих и ребёнка» (2ad+1ch) даёт 3ad+2ch.
    const variants: BnovoTariffVariant[] = []
    const guestLists = [...block.matchAll(/<div class="guest-list[^"]*">([\s\S]*?)<\/div>\s*<\/div>/g)]
    for (const gl of guestLists) {
      const inner = gl[1]
      // PMS внутри guest-list блока также рендерит tooltip (`<div class="tooltip">`/
      // `<div class="tooltip__template">`) с пояснением «Взрослые: 2, Дети: 1», где те
      // же иконки adult/child дублируются. Если не отрезать tooltip, парсер видит
      // лишние иконки и сдвигает счёт (например 2ad+1ch → 3ad+2ch). Берём кусок
      // ДО первого tooltip — там только реальные слоты гостей.
      const tooltipIdx = inner.search(/<div class="tooltip/)
      const slotsHtml = tooltipIdx >= 0 ? inner.slice(0, tooltipIdx) : inner
      const adultsCount = (slotsHtml.match(/bnovobook-icon--adult/g) || []).length
      const childrenCount = (slotsHtml.match(/bnovobook-icon--child/g) || []).length
      if (adultsCount + childrenCount === 0) continue
      // gl.index + полная длина match-а — позиция конца guest-list блока в `block`
      const matchEnd = (gl.index ?? 0) + gl[0].length
      const after = block.slice(matchEnd, matchEnd + 4000)
      const tp = /data-tariff-price="(\d+(?:\.\d+)?)"/.exec(after)
      if (!tp) continue
      const price = Number(tp[1])
      if (!(price > 0)) continue
      // Дедупликация — в HTML каждый вариант часто появляется дважды (desktop + mobile UI).
      const dup = variants.find(v => v.adults === adultsCount && v.children === childrenCount && v.price_per_night === price)
      if (dup) continue
      variants.push({ adults: adultsCount, children: childrenCount, price_per_night: price })
    }

    // Поиск альтернативных дат для magic_calendar — ссылки <a class="tariff__alternative_link" rel="N" href="...?dfrom=DD-MM-YYYY&dto=DD-MM-YYYY">.
    const alternatives: Array<{ dfrom: string; dto: string }> = []
    const altRe = /<a[^>]*class="tariff__alternative_link"[^>]*href="([^"]+)"/g
    for (const altMatch of block.matchAll(altRe)) {
      const href = altMatch[1].replace(/&amp;/g, '&')
      const dfrom = /[?&]dfrom=(\d{2}-\d{2}-\d{4})/.exec(href)?.[1]
      const dto = /[?&]dto=(\d{2}-\d{2}-\d{4})/.exec(href)?.[1]
      if (dfrom && dto && !alternatives.some(a => a.dfrom === dfrom && a.dto === dto)) {
        alternatives.push({ dfrom, dto })
      }
    }

    const cat = categories.get(roomTypeId)
    // Финальные min/max берём из variants если они нашлись (точнее selectAvailable data-min/maxprice).
    const variantPrices = variants.map(v => v.price_per_night)
    const finalMin = variantPrices.length > 0 ? Math.min(...variantPrices) : priceMin
    const finalMax = variantPrices.length > 0 ? Math.max(...variantPrices) : priceMax
    // capacity_max = max(adults+children) среди variants
    const finalCapacity = variants.length > 0
      ? Math.max(...variants.map(v => v.adults + v.children))
      : capacityMax

    result.push({
      room_type_id: roomTypeId,
      site_slug: getSiteSlugByBnovoTypeId(roomTypeId),
      title: title || cat?.name || `room#${roomTypeId}`,
      status: cat?.status ?? 'unknown',
      variants,
      price_per_night_min: finalMin,
      price_per_night_max: finalMax,
      available_count: availableSum,
      capacity_max: finalCapacity,
      plan_id: planId,
      alternatives,
    })
  }

  return result
}
