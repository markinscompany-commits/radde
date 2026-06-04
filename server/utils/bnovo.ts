// Клиент к Bnovo PMS API v1 (только GET — тариф «Старт» не даёт write).
// Используется для confirm-check после серого-канала и для sync новых
// броней со всех источников (Прямое, OTA, наш сайт) в админку.
//
// Base URL и схема — из официальной OpenAPI которую прислал клиент.
// Auth: POST /api/v1/auth { id, password } -> { access_token (JWT, TTL 24h) }
// Использование: Authorization: Bearer <token>

const BASE = 'https://api.pms.bnovo.ru'

type AuthResponse = {
  data: { access_token: string; token_type: 'bearer'; expires_in: number }
}

type BnovoBooking = {
  id: number
  number: string
  status: { id: number; name: string; color: string }
  source: { id: number; name: string }
  customer: {
    id: number
    name: string
    surname: string
    phone: string
    email: string
    notes: string
  }
  dates: {
    create_date: string
    arrival: string
    departure: string
    cancel_date: string | null
    update_date: string
  }
  amount: number
  room_id: number
  room_type_id: number
  extra: { adults: number; children: number }
}

// Простой in-memory кэш JWT. Перезапуск PM2 = новая авторизация (нормально).
let tokenCache: { token: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
  const { bnovoAccountId, bnovoApiKey } = useRuntimeConfig()
  if (!bnovoAccountId || !bnovoApiKey) {
    throw new Error('Bnovo: NUXT_BNOVO_ACCOUNT_ID / NUXT_BNOVO_API_KEY не заданы в .env')
  }

  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token
  }

  const res = await $fetch<AuthResponse>(`${BASE}/api/v1/auth`, {
    method: 'POST',
    body: { id: Number(bnovoAccountId), password: String(bnovoApiKey) },
  })

  const token = res?.data?.access_token
  const ttlSec = res?.data?.expires_in ?? 86400
  if (!token) throw new Error('Bnovo auth: пустой access_token в ответе')

  tokenCache = { token, expiresAt: Date.now() + ttlSec * 1000 }
  return token
}

export async function listBnovoBookings(opts: {
  date_from: string // YYYY-MM-DD или YYYY-MM-DD HH:MM:SS
  date_to: string
  data_type?: 'checkmate' | 'new' | 'living' | 'checkedIn' | 'checkedOut' | 'cancelled' | 'exited' | 'changed'
  limit?: number
  offset?: number
}): Promise<{ bookings: BnovoBooking[]; total: number }> {
  const token = await getToken()
  const res = await $fetch<{ data: { bookings: BnovoBooking[]; meta: { total: number } } }>(
    `${BASE}/api/v1/bookings`,
    {
      method: 'GET',
      params: {
        date_from: opts.date_from,
        date_to: opts.date_to,
        data_type: opts.data_type ?? 'new',
        limit: opts.limit ?? 50,
        offset: opts.offset ?? 0,
      },
      headers: { Authorization: `Bearer ${token}` },
    },
  )
  return { bookings: res.data.bookings, total: res.data.meta.total }
}

// Найти бронь по точному номеру (e.g. "US9PM_130526") за окно дат.
// Bnovo не отдаёт endpoint поиска по number, поэтому фильтруем после fetch.
// Используется в confirm-check сразу после POST на reservationsteps.ru:
// смотрим брони с create_date за последние 5 минут (data_type=new), ищем нашу.
export async function findBnovoBookingByNumber(
  number: string,
  arrival: string, // YYYY-MM-DD
  departure: string,
): Promise<BnovoBooking | null> {
  const { bookings } = await listBnovoBookings({
    date_from: arrival,
    date_to: departure,
    data_type: 'checkmate',
    limit: 50,
  })
  return bookings.find((b) => b.number === number) ?? null
}

export type { BnovoBooking }
