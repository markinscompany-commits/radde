// GET /api/next-available?nights=N&adults=A&children=C[&slug=vip]
// Возвращает ближайшее свободное окно длиной N ночей под состав гостей.
// slug опционален: с ним ищем конкретную категорию, без — любую подходящую.
// Ответ: { ok, window: { from, to, nights } | null }
import { z } from 'zod'
import { findNextAvailableWindow } from '../utils/bnovo-next'

const querySchema = z.object({
  nights: z.coerce.number().int().min(1).max(30).default(1),
  adults: z.coerce.number().int().min(1).max(18).default(2),
  children: z.coerce.number().int().min(0).max(18).default(0),
  slug: z.string().min(1).max(40).optional(),
})

export default defineEventHandler(async (event) => {
  const parsed = querySchema.safeParse(getQuery(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: 'Неверные параметры next-available' })
  }
  const q = parsed.data
  let window = null
  let error: string | null = null
  try {
    window = await findNextAvailableWindow({
      nights: q.nights,
      adults: q.adults,
      children: q.children,
      slug: q.slug ?? null,
    })
  } catch (err) {
    error = err instanceof Error ? err.message : String(err)
  }
  return { ok: error == null, window, error }
})
