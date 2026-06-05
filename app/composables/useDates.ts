/**
 * Дата «сегодня» по Москве (UTC+3, постоянный, без перехода на летнее время
 * с 2014 г.) в формате YYYY-MM-DD. Используем её как минимальную дату заезда,
 * чтобы ночью по МСК не предлагался уже прошедший день: `toISOString()` отдаёт
 * UTC, и в 01:00 МСК (=22:00 UTC прошлого дня) обычный расчёт давал «вчера».
 */
export function todayMsk(): string {
  const msk = new Date(Date.now() + 3 * 60 * 60 * 1000)
  return msk.toISOString().slice(0, 10)
}

/** Прибавить дни к ISO-дате YYYY-MM-DD (в UTC, чтобы не зависеть от TZ браузера). */
export function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}
