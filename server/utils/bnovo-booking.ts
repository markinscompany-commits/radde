// Серый-канал создания брони в Bnovo через POST на reservationsteps.ru.
// Получен из HAR-записи реального флоу (см. Сессия 28+). Точный формат:
//   POST https://reservationsteps.ru/bookings/post/<lcode>
//   Content-Type: application/x-www-form-urlencoded
//   ... поля даты/гостей/номера/тарифа/контактов ...
//   -> 302 Location: /bookings/preSuccess/?bookingNumber=US9PM_130526&...
//
// Никаких CSRF/cookie/подписей не требуется. Защита от автоматизации
// отсутствует. См. описание архитектуры — это write-tier, легитимный API
// «Профессионал» на этом тарифе клиента недоступен (саппорт Bnovo).

import { getBnovoRoomBySlug, resolveBnovoVariant, type BnovoRoomMapping, type BnovoVariant } from './bnovo-mapping'

const ORIGIN = 'https://reservationsteps.ru'

export type BnovoSubmitInput = {
  arrival: string   // YYYY-MM-DD (наш формат)
  departure: string // YYYY-MM-DD
  adults: number
  /** Кол-во детей */
  children: number
  /**
   * Возрасты детей (если известны). Bnovo требует именно массив возрастов в
   * параметре children, не просто число. Если не передан — мы подставим placeholder
   * (см. ниже): чаще всего цены детей высчитываются по возрасту, поэтому если
   * гость указал «1 ребёнок» без возраста — отправим [10] (нейтральный возраст,
   * пансионат уточнит при звонке).
   */
  childrenAges?: number[]
  /**
   * Состав брони. Можно передать ОДИН способ из двух:
   *   - `room_slug`: один номер (классический одиночный сценарий)
   *   - `rooms`: массив физических номеров для мульти-номера. КАЖДЫЙ элемент =
   *     один физический номер с собственным `guests` (число гостей в этом
   *     номере). Bnovo принимает несколько типов в одном POST через
   *     roomTypes={"id1":{c,bv},"id2":{c,bv}} и создаёт N связанных броней с
   *     общим bookingNumber. Атомарно: либо все создались, либо ни одна.
   *     Подтверждено HAR-записью (radde/bnovo_tests/nr_2,3).
   *
   *     ВАЖНО: distribution гостей шлётся через `services.count` per физический
   *     номер. Для combo с одинаковыми типами (2× Standard, гости 1+2) на один
   *     ключ services собираются ДВЕ отдельные записи [{c:1},{c:2}], не одна
   *     с агрегированным count — иначе Bnovo раскинет по cap'у каждого номера.
   */
  room_slug?: string
  rooms?: Array<{ slug: string; guests: number }>
  guest: {
    first_name: string
    last_name: string
    phone: string
    email: string
    notes?: string
  }
}

export type BnovoSubmitResult =
  | {
      ok: true
      bookingNumber: string         // напр. "US9PM_130526" — Bnovo выдаёт сразу
      paymentUrl: string | null     // URL эквайринга (если warrantyType=onlinepay)
      preSuccessUrl: string         // полный Location 302 — для отладки
    }
  | {
      ok: false
      error: string
      status: number | null
      rawResponse?: string
    }

// Конвертация даты YYYY-MM-DD -> DD-MM-YYYY (формат Bnovo)
function toBnovoDate(isoDate: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!m) throw new Error(`Invalid date format: ${isoDate} (expected YYYY-MM-DD)`)
  return `${m[3]}-${m[2]}-${m[1]}`
}

export async function submitBnovoBooking(
  input: BnovoSubmitInput,
): Promise<BnovoSubmitResult> {
  const {
    bnovoLcode,
    bnovoPlanId,
    bnovoWarrantyType, // 'onlinepay' | 'noguarantee' | ... — точные значения зависят от тарифа в Bnovo
  } = useRuntimeConfig()

  if (!bnovoLcode) {
    return { ok: false, error: 'NUXT_BNOVO_LCODE не задан', status: null }
  }

  // Нормализуем вход: одиночный room_slug → один физический номер с capacity-guests,
  // мульти-номер rooms[] → массив физических номеров (КАЖДЫЙ = одна позиция со
  // своим guests). Дальше код работает с roomsList единообразно: один элемент =
  // одно физическое место в Bnovo с УЖЕ резолвнутым variant'ом (room_type_id+bv).
  type RoomEntry = { slug: string; cfg: BnovoRoomMapping; guests: number; variant: BnovoVariant }
  const roomsRaw = input.rooms && input.rooms.length > 0
    ? input.rooms
    : input.room_slug
      ? [{ slug: input.room_slug, guests: input.adults + input.children }]
      : []
  if (roomsRaw.length === 0) {
    return { ok: false, error: 'Не передан ни один номер для бронирования', status: null }
  }
  const roomsList: RoomEntry[] = []
  for (const r of roomsRaw) {
    const cfg = getBnovoRoomBySlug(r.slug)
    if (!cfg) {
      return {
        ok: false,
        error: `Bnovo room mapping для слага "${r.slug}" не найден. Проверь server/utils/bnovo-mapping.ts`,
        status: null,
      }
    }
    const guests = Math.max(1, Math.floor(r.guests))
    // Под нужный состав подбираем КОНКРЕТНЫЙ Bnovo-id из списка variants slug'а.
    // Например для standard guests=1 → 193606, guests=2 → 193602. Это позволяет
    // combo «2× Стандарт с распределением 1+2» уйти в PMS двумя разными
    // room_type_id вместо одного агрегированного (см. bnovo-mapping.ts).
    const variant = resolveBnovoVariant(cfg, guests)
    roomsList.push({ slug: r.slug, cfg, guests, variant })
  }

  const planId = Number(bnovoPlanId)
  if (!planId) {
    return { ok: false, error: 'NUXT_BNOVO_PLAN_ID не задан в .env', status: null }
  }

  // Поля по образцу HAR от 13.05.2026 (Mark прошёл руками).
  // Шлём заявленный состав напрямую. У клиента в LK PMS настроены подкатегории
  // под каждый состав («Lux для двоих и ребёнка» и т.п.) — PMS сам подбёрет
  // нужную при создании брони и применит свою цену.
  const rawAges = Array.isArray(input.childrenAges) && input.childrenAges.length > 0
    ? input.childrenAges
    : Array.from({ length: Math.max(0, input.children) }, () => 10)
  const ages = rawAges.map((a) => (typeof a === 'number' && a >= 0 ? a : 10))

  const params = new URLSearchParams()
  params.set('servicemode', '0')
  params.set('firstroom', '0')
  params.set('dfrom', toBnovoDate(input.arrival))
  params.set('dto', toBnovoDate(input.departure))
  params.set('planId', String(planId))
  params.set('adults', String(input.adults))
  params.set('children', JSON.stringify(ages))
  params.set('promoCode', '')
  // roomTypes — JSON-карта: ключ = room_type_id (variant.room_type_id), значение
  // = {c: count, bv: bed_variant}. Каждый элемент roomsList = ОДИН физический
  // номер с уже подобранным variant'ом под нужный guests. Агрегируем по variant'у:
  // если в combo два номера с одинаковым room_type_id (например 2× Стандарт оба
  // на 2 чел → оба variant=193602), они уйдут как `"193602":{"c":2,"bv":2}` —
  // Bnovo создаст 2 связанные брони этого типа. Если variant разный (combo
  // «1× Стандарт-1чел + 1× Стандарт-2чел» → 193606+193602) — пойдут под двумя
  // ключами с c=1 каждый.
  const roomTypesMap: Record<string, { c: number; bv: number }> = {}
  for (const r of roomsList) {
    const key = String(r.variant.room_type_id)
    if (roomTypesMap[key]) {
      roomTypesMap[key].c += 1
    } else {
      roomTypesMap[key] = { c: 1, bv: r.variant.bed_variant }
    }
  }
  params.set('roomTypes', JSON.stringify(roomTypesMap))
  params.set('roomtypeUpgrade', '')
  // services — критичный параметр для мульти-номера. Bnovo использует services.count
  // для каждого room_type_id как сигнал «N гостей в каждом номере этого типа» →
  // выбирает variant{N} правильной цены. Подтверждено HAR'ом одиночки
  // (radde/bnovo_tests/network_request): для 1× Std на 2 чел шлётся
  // services={"193602":{"0":[{"i":133479,"c":2}]}}.
  //
  // service id 133479 = «Завтрак» (включён в стоимость, без доплаты — Mark
  // подтвердил, других услуг в Bnovo Радде не настроено).
  //
  // ВАЖНО: разные составы внутри ОДНОГО room_type_id невозможны (reverse
  // engineering dist/js/main-e2478874b3.js: `room_types[room_id]={c,bv}` —
  // один bv на N номеров одного id). Поэтому resolveBnovoVariant маршрутизирует
  // 2× Стандарт-разные-составы в РАЗНЫЕ room_type_id (193602 + 193606). После
  // этого внутри каждого ключа services у нас один и тот же guests для всех c.
  //
  // Для одиночной брони НЕ шлём — Bnovo сам подберёт variant по adults.
  if (roomsList.length > 1) {
    const BREAKFAST_SERVICE_ID = 133479
    const servicesMap: Record<string, { '0': Array<{ i: number; c: number }> }> = {}
    for (const r of roomsList) {
      const key = String(r.variant.room_type_id)
      const guestsInRoom = Math.max(1, r.guests)
      if (!servicesMap[key]) {
        servicesMap[key] = { '0': [{ i: BREAKFAST_SERVICE_ID, c: guestsInRoom }] }
      }
    }
    params.set('services', JSON.stringify(servicesMap))
  } else {
    params.set('services', '')
  }
  params.set('orderItems', '')
  params.set('lang', 'ru')
  params.set('warrantyType', String(bnovoWarrantyType || 'onlinepay'))
  params.set('orderid', '')
  params.set('moneywall_enabled', '0')
  params.set('currency', '')
  params.set('mobile_id', '0')
  params.set('guarantee', '1')
  // Bnovo требует НЕпустую фамилию — иначе валит весь POST с
  // «customer содержит не валидный массив» (это его кривое сообщение).
  // Если на форме гость ввёл только имя, подставляем безопасный placeholder.
  const safeSurname = input.guest.last_name && input.guest.last_name.trim().length > 0
    ? input.guest.last_name
    : '—'
  params.set('customer[name]', input.guest.first_name)
  params.set('customer[surname]', safeSurname)
  params.set('customer[phone]', input.guest.phone)
  params.set('customer[email]', input.guest.email)
  // В notes — реальный состав гостей с возрастами для ресепшна. Первой
  // строкой ставим маркер «Заявка с сайта radde.ru» — чтобы ресепшн в Bnovo
  // сразу видел источник и не путал с прямыми бронями через PMS-форму.
  const sourceNote = 'Заявка с сайта radde.ru'
  const compositionNote = input.children > 0
    ? `Состав: ${input.adults} взр + ${input.children} реб (возрасты: ${ages.join(', ')})`
    : ''
  // Если бронь мульти-номер — поясняем явно: каждая из связанных броней получит
  // эти notes, чтобы ресепшн понимал «это группа из N номеров под одну компанию».
  const totalRooms = roomsList.length
  const multiNote = totalRooms > 1
    ? (() => {
        // Группируем по slug для красивого вывода: «2× Standard + Дом» вместо «Std + Std + Дом»
        const counts = new Map<string, { name: string; count: number }>()
        for (const r of roomsList) {
          const ex = counts.get(r.slug)
          if (ex) ex.count += 1
          else counts.set(r.slug, { name: r.cfg.display_name, count: 1 })
        }
        const parts = Array.from(counts.values()).map(x => x.count > 1 ? `${x.count}× ${x.name}` : x.name)
        return `Группа из ${totalRooms} номеров (одна компания): ${parts.join(' + ')}`
      })()
    : ''
  const fullNotes = [sourceNote, multiNote, compositionNote, input.guest.notes ?? '']
    .filter(Boolean)
    .join('\n')
    .trim()
  params.set('customer[notes]', fullNotes)

  let response: Response
  try {
    response = await fetch(`${ORIGIN}/bookings/post/${bnovoLcode}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Bnovo проверяет Referer (видно по HAR — он всегда есть от их же домена).
        // Имитируем — иначе риск получить 403/redirect на главную.
        Referer: `${ORIGIN}/`,
        'User-Agent': 'Mozilla/5.0 (compatible; RaddeBookingProxy/1.0; +https://radde.ru)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
        'Accept-Language': 'ru-RU,ru;q=0.9',
      },
      body: params.toString(),
      redirect: 'manual',
      signal: AbortSignal.timeout(20_000),
    })
  } catch (err) {
    return { ok: false, error: `Network error: ${(err as Error).message}`, status: null }
  }

  // Ожидаемый ответ: 302 -> /bookings/preSuccess/<lcode>?...&bookingNumber=US9PM_130526...
  if (response.status !== 302 && response.status !== 301) {
    const raw = await response.text().catch(() => '')
    return {
      ok: false,
      error: `Bnovo вернул HTTP ${response.status} — ${extractVisibleError(raw) || '(тело без распознанной ошибки, первые 300 символов: ' + raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300) + ')'}`,
      status: response.status,
      rawResponse: raw.slice(0, 1500),
    }
  }

  const location = response.headers.get('location') || ''
  if (!location) {
    return { ok: false, error: '302 без Location', status: response.status }
  }

  // Извлекаем bookingNumber из query Location
  // Пример: /bookings/preSuccess/<uid>?...&bookingNumber=US9PM_130526&...
  const bookingNumberMatch = /[?&]bookingNumber=([^&]+)/.exec(location)
  if (!bookingNumberMatch) {
    return {
      ok: false,
      error: 'bookingNumber не найден в Location',
      status: response.status,
      rawResponse: location.slice(0, 1000),
    }
  }
  const bookingNumber = decodeURIComponent(bookingNumberMatch[1])

  // Извлекаем away_url (это эквайринг payment.bnovo.ru) если есть.
  // Если тариф без предоплаты — этого URL может не быть, paymentUrl останется null.
  let paymentUrl: string | null = null
  const awayMatch = /[?&]redirectUrl=([^&]+)/.exec(location)
  if (awayMatch) {
    try {
      const redirectUrl = decodeURIComponent(awayMatch[1])
      // redirectUrl выглядит как /away/index/<uid>?away_url=https%3A%2F%2Fpayment.bnovo.ru%2Fv2%2F%3Ftransaction%3D...
      const awayUrlMatch = /away_url=([^&]+)/.exec(redirectUrl)
      if (awayUrlMatch) {
        paymentUrl = decodeURIComponent(awayUrlMatch[1])
      }
    } catch { /* игнорируем — paymentUrl останется null */ }
  }

  return {
    ok: true,
    bookingNumber,
    paymentUrl,
    preSuccessUrl: location.startsWith('http') ? location : `${ORIGIN}${location}`,
  }
}

// Для логов: маска контактов в текстовый вид (PII не сыплем в out-лог PM2)
export function summarizeSubmit(input: BnovoSubmitInput): string {
  let roomsLabel: string
  if (input.rooms && input.rooms.length > 0) {
    const counts = new Map<string, number>()
    for (const r of input.rooms) counts.set(r.slug, (counts.get(r.slug) ?? 0) + 1)
    roomsLabel = Array.from(counts.entries()).map(([s, c]) => c > 1 ? `${c}×${s}` : s).join('+')
  } else {
    roomsLabel = input.room_slug ?? '?'
  }
  return `[bnovo-submit] ${input.arrival}→${input.departure} ${input.adults}adt+${input.children}ch rooms=${roomsLabel} guest=${input.guest.first_name} ${input.guest.last_name && input.guest.last_name[0] ? input.guest.last_name[0] : ''}.`
}

// Вытаскивает из HTML-ответа Bnovo первую видимую человекочитаемую ошибку.
// Bnovo на 400 рендерит ту же форму, в самом конце <body> есть toast-блок
// с текстом ошибки. Парсим без cheerio — простыми регулярками.
export function extractVisibleError(html: string): string {
  if (!html) return ''
  // Сначала пытаемся точечные паттерны
  const patterns = [
    /Поле[^<]+/i,
    /Ошибка[^<]{0,200}/i,
    /class="errorMessage[^"]*"[^>]*>([^<]+)</i,
    /class="toast-error[^"]*"[^>]*>([^<]+)</i,
    /class="error[^"]*"[^>]*>([^<]+)</i,
  ]
  for (const re of patterns) {
    const m = re.exec(html)
    if (m) {
      const text = (m[1] || m[0]).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      if (text.length >= 4) return text.slice(0, 300)
    }
  }
  return ''
}
