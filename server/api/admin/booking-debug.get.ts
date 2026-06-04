// GET /api/admin/booking-debug?id=N
// Возвращает diag-инфу о брони БЕЗ PII (имя/телефон/email замаскированы).
// Защита: Basic Auth (через Nginx) + X-Admin-Token.
import { useDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const { adminProbeToken } = useRuntimeConfig()
  if (!adminProbeToken) {
    throw createError({ statusCode: 503, message: 'NUXT_ADMIN_PROBE_TOKEN не задан' })
  }
  const incoming = getHeader(event, 'x-admin-token')
  if (!incoming || incoming !== adminProbeToken) {
    throw createError({ statusCode: 401, message: 'unauthorized' })
  }

  const q = getQuery(event)
  const id = Number(q.id)
  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, message: 'id query param required' })
  }

  const sql = useDb()
  const rows = await sql<Array<{
    id: number
    created_at: string
    arrival: string
    departure: string
    adults: number
    children: number
    room_slug: string | null
    room_type_id: string | null
    bnovo_status: string
    bnovo_booking_number: string | null
    bnovo_payment_url: string | null
    bnovo_error: string | null
    bnovo_sent_at: string | null
    total_estimate: number | null
    phone_tail: string | null
  }>>`
    SELECT id, created_at, arrival, departure, adults, children,
           room_slug, room_type_id, bnovo_status, bnovo_booking_number,
           bnovo_payment_url, bnovo_error, bnovo_sent_at, total_estimate,
           -- маска: только последние 4 цифры телефона
           CASE WHEN guest_phone IS NULL THEN NULL
                ELSE '***' || RIGHT(REGEXP_REPLACE(guest_phone, '\D', '', 'g'), 4)
           END AS phone_tail
    FROM bookings
    WHERE id = ${id}
    LIMIT 1
  `
  if (rows.length === 0) {
    throw createError({ statusCode: 404, message: 'booking not found' })
  }
  return rows[0]
})
