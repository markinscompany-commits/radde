// POST /api/transfer — заказ трансфера из секции Location.
// Пишет в transfer_requests + consents, отправляет уведомление в Telegram.
import { z } from 'zod'
import { useDb } from '../utils/db'
import { getClientIp, getUserAgent } from '../utils/request'
import { transferSchema, CONSENT_TEXT } from '../utils/schemas'
import { escHtml, notifyTelegram } from '../utils/notify'

export default defineEventHandler(async (event) => {
  let body
  try {
    body = transferSchema.parse(await readBody(event))
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
      INSERT INTO transfer_requests (name, phone, flight, source_ip, user_agent)
      VALUES (${body.name}, ${body.phone}, ${body.flight || null}, ${ip}, ${ua})
      RETURNING id
    `
    const id = inserted[0]!.id
    await tx`
      INSERT INTO consents (form_kind, related_kind, related_id, name, phone, policy_text, source_ip, user_agent)
      VALUES (
        'transfer', 'transfer', ${id},
        ${body.name}, ${body.phone}, ${CONSENT_TEXT},
        ${ip}, ${ua}
      )
    `
    return inserted
  })

  const text = [
    '🚐 <b>Заявка на трансфер</b>',
    `№ ${row.id}`,
    '',
    `Имя: <b>${escHtml(body.name)}</b>`,
    `Телефон: <code>${escHtml(body.phone)}</code>`,
    body.flight ? `\nДата/рейс: ${escHtml(body.flight)}` : '',
  ].filter(Boolean).join('\n')

  await notifyTelegram({ kind: 'transfer', id: row.id, text })

  return { ok: true, id: row.id }
})
