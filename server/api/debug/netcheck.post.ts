// POST /api/debug/netcheck — приём отчёта со страницы диагностики netcheck.html
// (июнь 2026, «не грузится по домену с телефонов»). Сохраняет отчёт в память,
// дублирует в PM2-лог и шлёт краткую сводку в Telegram-группу заявок —
// чтобы результат с телефона пользователя сразу был виден.
// Временный эндпоинт, удалить после закрытия диагностики.
import { getClientIp, getUserAgent } from '../../utils/request'
import { recordNetcheckReport } from '../../utils/netcheck-store'

type ProbeResult = {
  name?: string
  ok?: boolean
  ms?: number
  detail?: string
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  const body = await readBody(event).catch(() => null)
  const raw = JSON.stringify(body ?? {})
  if (raw.length > 16_000) {
    throw createError({ statusCode: 413, message: 'Отчёт слишком большой' })
  }

  const report = {
    t: new Date().toISOString(),
    ip: getClientIp(event),
    ua: getUserAgent(event),
    payload: body,
  }
  recordNetcheckReport(report)
  console.log(`[netcheck] ${report.t} ip=${report.ip}\n${raw}`)

  // Краткая сводка в Telegram (fire-and-forget, по образцу notify.ts)
  const { telegramBotToken, telegramChatId } = useRuntimeConfig()
  if (telegramBotToken && telegramChatId) {
    const probes: ProbeResult[] = Array.isArray((body as any)?.probes) ? (body as any).probes : []
    const lines = probes.map(p =>
      `${p.ok ? '✅' : '❌'} ${p.name ?? '?'} — ${p.ms ?? '?'}мс${p.detail ? ` (${String(p.detail).slice(0, 120)})` : ''}`,
    )
    const text = [
      '🔬 <b>Отчёт netcheck</b> (диагностика «не грузится по домену»)',
      `IP: ${report.ip ?? '?'}`,
      `Устройство: ${(report.ua ?? '?').slice(0, 160)}`,
      '',
      ...lines,
    ].join('\n')
    void $fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      body: { chat_id: telegramChatId, text, parse_mode: 'HTML', disable_web_page_preview: true },
      timeout: 5000,
    }).catch(err => console.error('[netcheck] Telegram send failed', err?.message ?? err))
  }

  return { ok: true }
})
