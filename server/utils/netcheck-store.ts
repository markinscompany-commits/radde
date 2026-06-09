// Временное in-memory хранилище для диагностики «не грузится по домену»
// (июнь 2026). Держит последние отчёты netcheck.html и последние обращения
// к /api/health — чтобы видеть, доходят ли запросы с проблемных устройств
// до сервера вообще. Живёт в памяти процесса (PM2 fork, 1 инстанс) —
// перезапуск обнуляет, для диагностики этого достаточно.

export type HealthHit = {
  t: string
  ip: string | null
  ua: string | null
  host: string | null
  proto: string | null
}

export type NetcheckReport = {
  t: string
  ip: string | null
  ua: string | null
  payload: unknown
}

const MAX = 100

const healthHits: HealthHit[] = []
const reports: NetcheckReport[] = []

export function recordHealthHit(hit: HealthHit) {
  healthHits.push(hit)
  if (healthHits.length > MAX) healthHits.shift()
}

export function recordNetcheckReport(r: NetcheckReport) {
  reports.push(r)
  if (reports.length > MAX) reports.shift()
}

export function getNetcheckData() {
  return { healthHits, reports }
}
