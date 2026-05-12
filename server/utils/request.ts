// Утилиты для извлечения метаданных запроса (IP, UA).
// Берём X-Forwarded-For от Nginx, fallback на remoteAddress.
import type { H3Event } from 'h3'

export function getClientIp(event: H3Event): string | null {
  const fwd = getRequestHeader(event, 'x-forwarded-for')
  if (fwd) {
    const first = fwd.split(',')[0]?.trim()
    if (first) return first
  }
  const real = getRequestHeader(event, 'x-real-ip')
  if (real) return real
  return event.node.req.socket?.remoteAddress ?? null
}

export function getUserAgent(event: H3Event): string | null {
  return getRequestHeader(event, 'user-agent') ?? null
}
