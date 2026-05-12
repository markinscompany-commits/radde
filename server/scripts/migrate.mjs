// migrate.mjs — простой ранер миграций.
// Берёт все *.sql из server/migrations, сортирует по имени,
// применяет не применённые (журнал в таблице schema_migrations).
// Запуск: DATABASE_URL=... node server/scripts/migrate.mjs

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = resolve(__dirname, '../migrations')

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const sql = postgres(url, { onnotice: () => {}, max: 1 })

try {
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name        TEXT        PRIMARY KEY,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  const applied = new Set(
    (await sql`SELECT name FROM schema_migrations`).map((r) => r.name),
  )

  let appliedCount = 0
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  skip   ${file}`)
      continue
    }
    const body = readFileSync(join(MIGRATIONS_DIR, file), 'utf8')
    console.log(`  apply  ${file}`)
    await sql.begin(async (tx) => {
      await tx.unsafe(body)
      await tx`INSERT INTO schema_migrations (name) VALUES (${file})`
    })
    appliedCount++
  }
  console.log(`\nDone. Applied ${appliedCount} new migration(s).`)
} catch (err) {
  console.error('Migration failed:', err)
  process.exitCode = 1
} finally {
  await sql.end({ timeout: 5 })
}
