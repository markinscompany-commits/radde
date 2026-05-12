// GET /api/admin/feed — список всех заявок (bookings + contact_messages + transfer_requests)
// в едином виде, отсортированный по дате убывания.
// Защищается через Nginx auth_basic на location /admin и /api/admin (см. nginx.conf).
import { useDb } from '../../utils/db'

export default defineEventHandler(async () => {
  const sql = useDb()

  const [bookings, contacts, transfers] = await Promise.all([
    sql`
      SELECT id, created_at, arrival, departure, adults, children,
             room_type_id, total_estimate, guest_first_name, guest_last_name,
             guest_phone, guest_email, guest_city, comment, status
        FROM bookings
        ORDER BY created_at DESC
        LIMIT 500
    `,
    sql`
      SELECT id, created_at, name, phone, email, comment, status
        FROM contact_messages
        ORDER BY created_at DESC
        LIMIT 500
    `,
    sql`
      SELECT id, created_at, name, phone, flight, status
        FROM transfer_requests
        ORDER BY created_at DESC
        LIMIT 500
    `,
  ])

  return {
    bookings: bookings.map((r) => ({ kind: 'booking', ...r })),
    contacts: contacts.map((r) => ({ kind: 'contact', ...r })),
    transfers: transfers.map((r) => ({ kind: 'transfer', ...r })),
  }
})
