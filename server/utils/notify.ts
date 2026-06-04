// Telegram-уведомления. В P4.4 — заглушка (логирует payload).
// В P4.5 заменим на реальный fetch к Bot API; интерфейс не меняем.

type NotifyPayload = {
  kind: 'booking' | 'contact' | 'transfer'
  id: number | bigint
  text: string
}

export async function notifyTelegram(payload: NotifyPayload): Promise<void> {
  const { telegramBotToken, telegramChatId } = useRuntimeConfig()
  if (!telegramBotToken || !telegramChatId) {
    console.log(`[notify:${payload.kind}#${payload.id}] (no bot config — logging only)\n${payload.text}`)
    return
  }
  // Не блокируем основной handler ожиданием Telegram — иначе если api.telegram.org
  // тупит/недоступен с VPS (ETIMEDOUT), весь POST /api/booking зависает на полминуты+
  // и гость видит «Бронируем…» вечно. Бронь в БД и Bnovo важнее уведомления.
  // Жёсткий timeout 5s + fire-and-forget с логированием ошибки.
  const promise = $fetch<{ ok: boolean }>(
    `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
    {
      method: 'POST',
      body: {
        chat_id: telegramChatId,
        text: payload.text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      },
      timeout: 5000,
    },
  )
    .then((res) => {
      if (!res?.ok) console.error('[notify] Telegram returned not-ok', res)
    })
    .catch((err) => {
      console.error('[notify] Telegram send failed (non-blocking)', err?.message ?? err)
    })
  // ВАЖНО: НЕ await'им. Если nitro прибьёт background promise после ответа клиенту —
  // не страшно, основной flow уже завершён.
  void promise
}

export function escHtml(s: string | null | undefined): string {
  if (!s) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
