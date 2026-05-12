// Singleton-коннект к PostgreSQL для серверных роутов.
// postgres.js пулит коннекты сам; max=10 хватит на одну ноду PM2.
import postgres from 'postgres'

let _sql: ReturnType<typeof postgres> | null = null

export function useDb() {
  if (_sql) return _sql
  const url = useRuntimeConfig().databaseUrl
  if (!url) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DATABASE_URL is not configured',
    })
  }
  _sql = postgres(url, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 10,
    onnotice: () => {},
  })
  return _sql
}
