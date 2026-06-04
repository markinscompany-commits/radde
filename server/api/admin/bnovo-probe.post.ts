// POST /api/admin/bnovo-probe
// Защищённый диагностический роут: делает тестовый POST на Bnovo с заданными
// параметрами и возвращает status + распознанную ошибку + raw body. НИКАКОЙ
// записи в нашу БД, никаких уведомлений в TG. Если параметры успешные —
// Bnovo создаст реальную бронь (которую придётся вручную удалить в ЛК),
// поэтому используем имя гостя "BNOVO_PROBE_DELETE_<timestamp>" — ресепшн
// сразу поймёт что это автотест.
//
// Auth: заголовок X-Admin-Token со значением NUXT_ADMIN_PROBE_TOKEN.
import { z } from 'zod'
import { extractVisibleError } from '../../utils/bnovo-booking'

const querySchema = z.object({
  arrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().min(1).max(10).default(2),
  children: z.number().int().min(0).max(10).default(0),
  room_type_id: z.number().int().min(1),
  bv: z.number().int().min(0).max(10),
  plan_id: z.number().int().min(1).optional(),
  customer: z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
})

function toBnovoDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) throw new Error('bad date')
  return `${m[3]}-${m[2]}-${m[1]}`
}

export default defineEventHandler(async (event) => {
  const { adminProbeToken, bnovoLcode, bnovoPlanId, bnovoWarrantyType } = useRuntimeConfig()
  if (!adminProbeToken) {
    throw createError({ statusCode: 503, message: 'NUXT_ADMIN_PROBE_TOKEN не задан в .env' })
  }
  const incoming = getHeader(event, 'x-admin-token')
  if (!incoming || incoming !== adminProbeToken) {
    throw createError({ statusCode: 401, message: 'unauthorized' })
  }

  const body = await readBody(event)
  const parsed = querySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: 'bad probe payload', data: parsed.error.issues })
  }
  if (!bnovoLcode) {
    throw createError({ statusCode: 503, message: 'NUXT_BNOVO_LCODE не задан' })
  }
  const q = parsed.data
  const planId = q.plan_id ?? Number(bnovoPlanId) ?? 0

  const params = new URLSearchParams()
  params.set('servicemode', '0')
  params.set('firstroom', '0')
  params.set('dfrom', toBnovoDate(q.arrival))
  params.set('dto', toBnovoDate(q.departure))
  params.set('planId', String(planId))
  params.set('adults', String(q.adults))
  // Bnovo требует JSON массив возрастов. Probe не принимает возрасты — ставим placeholder 10.
  const ages = Array.from({ length: Math.max(0, q.children) }, () => 10)
  params.set('children', JSON.stringify(ages))
  params.set('promoCode', '')
  params.set('roomTypes', JSON.stringify({ [q.room_type_id]: { c: 1, bv: q.bv } }))
  params.set('roomtypeUpgrade', '')
  params.set('services', '')
  params.set('orderItems', '')
  params.set('lang', 'ru')
  params.set('warrantyType', String(bnovoWarrantyType || 'onlinepay'))
  params.set('orderid', '')
  params.set('moneywall_enabled', '0')
  params.set('currency', '')
  params.set('mobile_id', '0')
  params.set('guarantee', '1')
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T-]/g, '')
  const c = q.customer ?? {}
  params.set('customer[name]', c.name ?? `BNOVO_PROBE_DELETE_${stamp}`)
  params.set('customer[surname]', c.surname ?? 'AUTO')
  params.set('customer[phone]', c.phone ?? '+7(000)000-00-00')
  params.set('customer[email]', c.email ?? 'probe@example.com')
  params.set('customer[notes]', c.notes ?? 'autoprobe — please delete this booking')

  const url = `https://reservationsteps.ru/bookings/post/${bnovoLcode}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Referer: 'https://reservationsteps.ru/',
      'User-Agent': 'Mozilla/5.0 (compatible; RaddeBookingProxy/1.0; +https://radde.ru)',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
      'Accept-Language': 'ru-RU,ru;q=0.9',
    },
    body: params.toString(),
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  })

  const status = response.status
  const location = response.headers.get('location') || ''
  let bookingNumber: string | null = null
  let paymentUrl: string | null = null
  if (status === 302 || status === 301) {
    const bm = /[?&]bookingNumber=([^&]+)/.exec(location)
    bookingNumber = bm ? decodeURIComponent(bm[1]) : null
    const rm = /[?&]redirectUrl=([^&]+)/.exec(location)
    if (rm) {
      try {
        const redirectUrl = decodeURIComponent(rm[1])
        const am = /away_url=([^&]+)/.exec(redirectUrl)
        if (am) paymentUrl = decodeURIComponent(am[1])
      } catch {}
    }
  }
  const raw = status === 302 || status === 301 ? '' : await response.text().catch(() => '')
  const reason = raw ? extractVisibleError(raw) : ''

  return {
    sent: {
      arrival: q.arrival,
      departure: q.departure,
      adults: q.adults,
      children: q.children,
      room_type_id: q.room_type_id,
      bv: q.bv,
      plan_id: planId,
    },
    response: {
      status,
      location,
      bookingNumber,
      paymentUrl,
      reason,
      // Первые 1500 символов после очистки тегов — для глазного просмотра
      bodyPreview: raw
        ? raw.replace(/<script[\s\S]*?<\/script>/gi, '')
             .replace(/<style[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]+>/g, ' ')
             .replace(/\s+/g, ' ')
             .trim()
             .slice(0, 1500)
        : '',
    },
  }
})
