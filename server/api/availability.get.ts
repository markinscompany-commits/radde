// GET /api/availability?arrival=YYYY-MM-DD&departure=YYYY-MM-DD&adults=N&children=N
//
// Возвращает live-цены и доступность номеров из Bnovo через парсинг формы
// reservationsteps.ru. Категория «Дом» (на сайте отсутствует) фильтруется.
// Для номеров со статусом magic_calendar возвращаем массив earliest альтернативных
// дат, чтобы фронт мог показать «доступен с DD.MM».
//
// На любую ошибку сети/Bnovo отвечаем 200 с пустым массивом — фронт продолжит
// работать с fallback'ом из useRooms (не блокируем UX).
import { z } from 'zod'
import { fetchBnovoRates, fromBnovoDate, type BnovoRateForRoom } from '../utils/bnovo-rates'
import type { AvailabilityForSlug, AvailabilityResponse } from '~~/shared/bnovo'

const querySchema = z.object({
  arrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.coerce.number().int().min(1).max(18).default(2),
  children: z.coerce.number().int().min(0).max(18).default(0),
})

const ALL_SITE_SLUGS = ['vip', 'panorama', 'lux', 'standard'] as const

export default defineEventHandler(async (event): Promise<AvailabilityResponse> => {
  const raw = getQuery(event)
  const parsed = querySchema.safeParse(raw)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: 'Неверные параметры availability' })
  }
  const q = parsed.data

  // Bnovo не вернёт ничего если departure <= arrival
  if (q.departure <= q.arrival) {
    throw createError({ statusCode: 400, message: 'departure должен быть позже arrival' })
  }

  // Шлём PMS заявленный состав напрямую — у клиента в LK настроены подкатегории
  // под каждый состав (например «Lux», «Lux для трёх», «Lux для двоих и ребёнка»),
  // и PMS сам выдаст соответствующую подкатегорию с правильной ценой.
  let bnovoRooms: BnovoRateForRoom[] = []
  let error: string | null = null
  let fetchedAt: number | null = null
  try {
    const result = await fetchBnovoRates({
      arrival: q.arrival,
      departure: q.departure,
      adults: q.adults,
      children: q.children,
    })
    bnovoRooms = result.rooms
    fetchedAt = result.fetched_at
  } catch (err) {
    error = err instanceof Error ? err.message : String(err)
  }

  // Маппим Bnovo room_type_id -> наш слаг и формируем ответ
  const bySlug = new Map<string, BnovoRateForRoom>()
  for (const r of bnovoRooms) {
    if (r.site_slug) bySlug.set(r.site_slug, r)
  }

  const rooms: AvailabilityForSlug[] = ALL_SITE_SLUGS.map((slug) => {
    const found = bySlug.get(slug)
    if (!found) {
      // Категория не найдена в HTML — отдаём «нейтральную» запись, фронт сам решит как показать.
      return {
        slug,
        room_type_id: 0,
        title: '',
        available: false,
        available_count: 0,
        variants: [],
        price_per_night: null,
        price_per_night_max: null,
        capacity_max: null,
        plan_id: null,
        next_available_from: null,
        next_available_nights: null,
      }
    }

    // Показываем «ближайшую свободную дату» только если основная категория НЕдоступна
    // и Bnovo предложил альтернативу строго ПОЗЖЕ запрошенного arrival.
    //
    // Стратегия выбора альтернативы: гость просил период ровно `requestedNights` ночей,
    // мы хотим предложить ему такой же по длительности период в будущем (а не «отрывок»
    // на пару ночей, как делал старый код). Берём первое окно из bnovo `alternatives`
    // где доступная глубина ≥ `requestedNights` — в нём предлагаем заезд = `isoFrom`,
    // выезд = `isoFrom + requestedNights`. Если ни одно окно не вмещает запрошенное
    // число ночей — fallback на первое окно как есть (UI скажет «доступно X-Y, можно
    // сократить даты»).
    const isAvailableForNext = found.status === 'available' && found.available_count > 0
    const requestedNights = Math.max(1, Math.round((Date.parse(q.departure) - Date.parse(q.arrival)) / 86400000))
    let nextAvailableFrom: string | null = null
    let nextAvailableTo: string | null = null
    let nextAvailableNights: number | null = null
    if (!isAvailableForNext && found.alternatives.length > 0) {
      const futureAlts = found.alternatives
        .map((a) => ({ isoFrom: fromBnovoDate(a.dfrom), isoTo: fromBnovoDate(a.dto) }))
        .filter((a): a is { isoFrom: string; isoTo: string } => !!a.isoFrom && !!a.isoTo && a.isoFrom > q.arrival)
        .sort((a, b) => a.isoFrom.localeCompare(b.isoFrom))
      // Ищем первое окно достаточной глубины.
      const fitting = futureAlts.find((a) => {
        const ms = Date.parse(a.isoTo) - Date.parse(a.isoFrom)
        return ms > 0 && Math.round(ms / 86400000) >= requestedNights
      })
      if (fitting) {
        nextAvailableFrom = fitting.isoFrom
        const d = new Date(fitting.isoFrom + 'T00:00:00Z')
        d.setUTCDate(d.getUTCDate() + requestedNights)
        nextAvailableTo = d.toISOString().slice(0, 10)
        nextAvailableNights = requestedNights
      } else if (futureAlts.length > 0) {
        // Fallback: ни одно окно не вмещает запрошенный период. Возвращаем первое как
        // есть — гость увидит более короткий промежуток и сам сократит даты.
        const alt = futureAlts[0]!
        nextAvailableFrom = alt.isoFrom
        nextAvailableTo = alt.isoTo
        const ms = Date.parse(alt.isoTo) - Date.parse(alt.isoFrom)
        if (ms > 0) nextAvailableNights = Math.round(ms / 86400000)
      }
    }

    // Выбираем подкатегорию с точным соответствием состава (adults, children).
    // Если такой нет — берём минимально-достаточную (a+c >= total guests, min price).
    // Это совпадает с тем, как Bnovo считает в UI: «2 взр + 1 реб» подбирает
    // подкатегорию «Lux для двоих и ребёнка», а не «Lux для троих».
    const totalGuests = q.adults + q.children
    let chosenPrice = found.price_per_night_min ?? 0
    if (found.variants.length > 0) {
      const exact = found.variants.find(
        (v) => v.adults === q.adults && v.children === q.children,
      )
      if (exact) {
        chosenPrice = exact.price_per_night
      } else {
        const fits = found.variants
          .filter((v) => (v.adults + v.children) >= totalGuests)
          .sort(
            (a, b) =>
              (a.adults + a.children) - (b.adults + b.children) ||
              a.price_per_night - b.price_per_night,
          )
        if (fits.length > 0) {
          chosenPrice = fits[0].price_per_night
        } else {
          const largest = [...found.variants].sort(
            (a, b) => (b.adults + b.children) - (a.adults + a.children),
          )[0]
          chosenPrice = largest.price_per_night
        }
      }
    }

    // Сортируем варианты по итоговой цене для модалки (там показываем «прайс по составам»).
    const sortedVariants = [...found.variants].sort(
      (a, b) =>
        a.price_per_night - b.price_per_night ||
        (a.adults + a.children) - (b.adults + b.children),
    )

    return {
      slug,
      room_type_id: found.room_type_id,
      title: found.title,
      available: found.status === 'available' && found.available_count > 0,
      available_count: found.available_count,
      variants: sortedVariants,
      price_per_night: chosenPrice,
      price_per_night_max: found.price_per_night_max,
      capacity_max: found.capacity_max,
      plan_id: found.plan_id,
      next_available_from: nextAvailableFrom,
      next_available_to: nextAvailableTo,
      next_available_nights: nextAvailableNights,
    }
  })

  return {
    ok: error == null,
    query: q,
    rooms,
    fetched_at: fetchedAt,
    error,
  }
})
