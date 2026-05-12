// POST /api/booking — приём заявок с полной страницы /booking.
// Пишет в bookings + consents, отправляет уведомление в Telegram.
import { z } from 'zod'
import { useDb } from '../utils/db'
import { getClientIp, getUserAgent } from '../utils/request'
import { bookingSchema, CONSENT_TEXT } from '../utils/schemas'
import { escHtml, notifyTelegram } from '../utils/notify'

export default defineEventHandler(async (event) => {
  let body
  try {
    body = bookingSchema.parse(await readBody(event))
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось принять заявку: проверьте поля и попробуйте снова.',
        data: {
          message: 'Не удалось принять заявку: проверьте поля и попробуйте снова.',
          issues: err.issues,
        },
      })
    }
    throw err
  }

  const sql = useDb()
  const ip = getClientIp(event)
  const ua = getUserAgent(event)
  const firstRoom = body.rooms[0]
  const firstGuests = firstRoom.guests[0]

  const [row] = await sql.begin(async (tx) => {
    const inserted = await tx<{ id: string }[]>`
      INSERT INTO bookings (
        arrival, departure, adults, children,
        room_type_id, rate_id, extras,
        guest_first_name, guest_last_name, guest_phone, guest_email, guest_city,
        comment, total_estimate, source_ip, user_agent
      ) VALUES (
        ${body.arrival}, ${body.departure}, ${firstGuests.adults}, ${firstGuests.children},
        ${firstRoom.room_type_id ?? null}, ${firstRoom.rate_id ?? null}, ${sql.json(body.extras ?? [])},
        ${body.guest.first_name}, ${body.guest.last_name || null},
        ${body.guest.phone}, ${body.guest.email || null}, ${body.guest.city || null},
        ${body.comment || null}, ${body.total_estimate ?? null},
        ${ip}, ${ua}
      )
      RETURNING id
    `
    const id = inserted[0]!.id
    await tx`
      INSERT INTO consents (form_kind, related_kind, related_id, name, phone, email, policy_text, source_ip, user_agent)
      VALUES (
        'booking', 'booking', ${id},
        ${`${body.guest.first_name} ${body.guest.last_name || ''}`.trim()},
        ${body.guest.phone}, ${body.guest.email || null}, ${CONSENT_TEXT},
        ${ip}, ${ua}
      )
    `
    return inserted
  })

  const text = [
    '🏔 <b>Новая заявка на бронирование</b>',
    `№ ${row.id}`,
    '',
    `Гость: <b>${escHtml(body.guest.first_name)} ${escHtml(body.guest.last_name)}</b>`,
    `Телефон: <code>${escHtml(body.guest.phone)}</code>`,
    body.guest.email ? `Email: ${escHtml(body.guest.email)}` : '',
    body.guest.city ? `Город: ${escHtml(body.guest.city)}` : '',
    '',
    `Заезд: <b>${body.arrival}</b> → Выезд: <b>${body.departure}</b>`,
    `Гостей: ${firstGuests.adults} взр.${firstGuests.children ? ` + ${firstGuests.children} дет.` : ''}`,
    firstRoom.room_type_id ? `Номер: ${escHtml(firstRoom.room_type_id)}` : '',
    body.extras?.length ? `Доп. услуги: ${body.extras.map((e) => `${escHtml(e.slug)} ×${e.count}`).join(', ')}` : '',
    body.total_estimate ? `Оценка стоимости: ${body.total_estimate} ₽` : '',
    body.comment ? `\nКомментарий:\n${escHtml(body.comment)}` : '',
  ].filter(Boolean).join('\n')

  await notifyTelegram({ kind: 'booking', id: row.id, text })

  return { ok: true, id: row.id }
})
