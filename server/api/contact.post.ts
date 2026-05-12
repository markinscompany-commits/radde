// POST /api/contact — форма обратной связи (ContactFooter + BookingModal).
// Пишет в contact_messages + consents, отправляет уведомление в Telegram.
import { z } from 'zod'
import { useDb } from '../utils/db'
import { getClientIp, getUserAgent } from '../utils/request'
import { contactSchema, CONSENT_TEXT } from '../utils/schemas'
import { escHtml, notifyTelegram } from '../utils/notify'

export default defineEventHandler(async (event) => {
  let body
  try {
    body = contactSchema.parse(await readBody(event))
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось отправить — проверьте имя и телефон.',
        data: {
          message: 'Не удалось отправить — проверьте имя и телефон.',
          issues: err.issues,
        },
      })
    }
    throw err
  }

  const sql = useDb()
  const ip = getClientIp(event)
  const ua = getUserAgent(event)

  const [row] = await sql.begin(async (tx) => {
    const inserted = await tx<{ id: string }[]>`
      INSERT INTO contact_messages (name, phone, email, comment, source_ip, user_agent)
      VALUES (${body.name}, ${body.phone}, ${body.email || null}, ${body.comment || null}, ${ip}, ${ua})
      RETURNING id
    `
    const id = inserted[0]!.id
    await tx`
      INSERT INTO consents (form_kind, related_kind, related_id, name, phone, email, policy_text, source_ip, user_agent)
      VALUES (
        ${body.source}, 'contact', ${id},
        ${body.name}, ${body.phone}, ${body.email || null}, ${CONSENT_TEXT},
        ${ip}, ${ua}
      )
    `
    return inserted
  })

  const text = [
    body.source === 'booking_modal'
      ? '💬 <b>Заявка из модалки</b>'
      : '💬 <b>Сообщение через форму обратной связи</b>',
    `№ ${row.id}`,
    '',
    `Имя: <b>${escHtml(body.name)}</b>`,
    `Телефон: <code>${escHtml(body.phone)}</code>`,
    body.email ? `Email: ${escHtml(body.email)}` : '',
    body.comment ? `\nКомментарий:\n${escHtml(body.comment)}` : '',
  ].filter(Boolean).join('\n')

  await notifyTelegram({ kind: 'contact', id: row.id, text })

  return { ok: true, id: row.id }
})
