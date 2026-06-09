// GET /api/health — диагностический «пинг» (июнь 2026, проблема «не грузится
// по домену с телефонов»). CORS открыт, чтобы страница netcheck.html,
// открытая по IP (http://93.189.231.68), могла дёргать этот эндпоинт через
// домен https://radde.ru и мы видели, проходит ли путь домен+SSL с устройства.
// Каждое обращение запоминаем (IP/UA/Host) — если с проблемного телефона
// обращений нет, значит запросы до сервера вообще не доходят (DNS/блокировка).
import { getClientIp, getUserAgent } from '../utils/request'
import { recordHealthHit } from '../utils/netcheck-store'

export default defineEventHandler((event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Cache-Control', 'no-store')
  const hit = {
    t: new Date().toISOString(),
    ip: getClientIp(event),
    ua: getUserAgent(event),
    host: getRequestHeader(event, 'host') ?? null,
    proto: getRequestHeader(event, 'x-forwarded-proto') ?? null,
  }
  recordHealthHit(hit)
  console.log(`[health] ${hit.t} ip=${hit.ip} host=${hit.host} proto=${hit.proto} ua=${hit.ua}`)
  return { ok: true, server: 'radde-beget', host: hit.host, proto: hit.proto, t: hit.t }
})
