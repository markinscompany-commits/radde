// Типы, разделяемые между серверным /api/availability и фронт-композаблами.
// Файл лежит в shared/ — Nuxt 4 пускает его и в server/, и в app/.

/**
 * Один слот цены — комбинация (adults, children) с собственной ценой за ночь.
 * Bnovo называет это «sub-category». Например для Lux: { 1ad → 5000 },
 * { 2ad → 6000 }, { 2ad+1ch → 7500 }, { 3ad → 8000 }.
 * Используем в модалке номера, чтобы показать гостю прайс-сетку.
 */
export type PriceVariant = {
  adults: number
  children: number
  price_per_night: number
}

export type AvailabilityForSlug = {
  /** Слаг на сайте: vip / panorama / lux / standard */
  slug: string
  /** Bnovo room_type_id */
  room_type_id: number
  /** Заголовок как в Bnovo */
  title: string
  /** Доступен ли на запрошенные даты */
  available: boolean
  /** Сколько физических номеров категории свободно (0 если magic_calendar) */
  available_count: number
  /**
   * Все доступные слоты цен по составу гостей. Может быть пустым, если PMS
   * не вернул подкатегории для этой категории. Отсортирован по цене.
   */
  variants: PriceVariant[]
  /**
   * Цена за ночь для запрошенного состава гостей. У Bnovo внутри каждой родительской
   * категории есть sub-categories (Люкс / Люкс для 1 / Люкс для 3 / Люкс с ребёнком),
   * Bnovo сам выбирает подходящую по числу взрослых+детей и возвращает её цену здесь.
   * Это та цена, которая отображается в итоговой брони — её и показываем на сайте.
   */
  price_per_night: number | null
  /** Максимальная цена среди sub-категорий (для информации, не для отображения как «от») */
  price_per_night_max: number | null
  /** Максимальная вместимость sub-category в гостях */
  capacity_max: number | null
  /** Тариф который использовала Bnovo для расчёта */
  plan_id: number | null
  /**
   * Если категория недоступна на эти даты, ближайшая дата заезда, которую предложила Bnovo.
   * Формат: ISO YYYY-MM-DD. Null если альтернатив нет или категория доступна.
   */
  next_available_from: string | null
  /**
   * Дата выезда предлагаемой альтернативы (ISO YYYY-MM-DD). Если окно вмещает
   * `requestedNights` (длительность исходного запроса гостя) — это
   * `next_available_from + requestedNights`. Если нет — fallback на «как есть»
   * (Bnovo'шный dto).
   */
  next_available_to: string | null
  /** Длительность предлагаемой альтернативы в ночах (обычно = длительности исходного запроса) */
  next_available_nights: number | null
}

export type AvailabilityResponse = {
  ok: boolean
  /** Что мы спросили у Bnovo (на случай если фронт промахнулся с датами) */
  query: { arrival: string; departure: string; adults: number; children: number }
  /** Доступность по слагам нашего сайта. Включает все 4 номера, даже если у Bnovo они не вернулись. */
  rooms: AvailabilityForSlug[]
  /** Метаданные источника */
  fetched_at: number | null
  /** Если был сбой парсинга/сети — текст ошибки, фронт покажет fallback */
  error: string | null
}
