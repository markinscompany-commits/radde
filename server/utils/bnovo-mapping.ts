// Единый маппинг между слагами номеров на сайте Радде и room_type_id в Bnovo.
// Источник истины — `availableRoomTypes` + tariff__table в HTML
// reservationsteps.ru/rooms/index/<lcode>, разобранный 14.05.2026
// (radde/bnovo_tests/Модуль онлайн бронирования.html, повторный capture).
//
// КЛЮЧЕВОЕ ОТКРЫТИЕ (сессия 14.05 поздний вечер): в Bnovo PMS у Радде каждая
// «категория» (Стандарт, Люкс и т.д.) — это НЕ один room_type_id, а несколько
// разных id под одним именем. Каждый id отвечает за СВОЮ подкатегорию-состав
// (1 чел / 2 чел / ...). Это позволяет в одном POST'е положить несколько
// номеров «Стандарт» с РАЗНЫМИ составами через разные ключи roomTypes:
//   roomTypes={"193602":{"c":1,"bv":2},"193606":{"c":1,"bv":2}}
// Bnovo воспринимает это как 1 Стандарт-двухместный + 1 Стандарт-одноместный.
//
// 193605/193609 «Дом» на сайте Радде сознательно НЕ маппится: на сайте этой
// категории пока нет. Фильтруем из availability и не позволяем отправить заявку.

/**
 * Конкретный Bnovo-вариант одной «категории». Каждый вариант = отдельный
 * room_type_id в PMS со своей вместимостью. Combinator на фронте оперирует
 * slug'ами, а конкретный id мы подбираем на backend'е под `guests` физ. номера.
 */
export type BnovoVariant = {
  room_type_id: number
  /** Сколько гостей вмещает эта подкатегория (cap_max от Bnovo) */
  capacity: number
  /** bv — индекс bed-config внутри room_type_id. Для Радде везде 2. */
  bed_variant: number
}

export type BnovoRoomMapping = {
  /** Список Bnovo-вариантов по возрастанию capacity. Минимум 1 элемент. */
  variants: BnovoVariant[]
  display_name: string
}

// bed_variant — обязательное поле в POST /bookings/post. Без него или с bv=0
// Bnovo возвращает 400 и кладёт ошибку в чужое поле ("customer не валидный массив").
// Эталон из HAR одиночной брони — bv=2. Принимается для всех категорий.
//
// Полный каталог получен 15.05.2026 reverse engineering'ом tariff__table в
// /rooms/index/ (dist/js/main-e2478874b3.js): КАЖДАЯ строка таблицы цен имеет
// своё `data-room-id` на input/select элементе — это «целевой» Bnovo-id, в
// который Bnovo маршрутизирует бронь когда гость выбирает данную композицию.
// «Главный» id (tbody data-real-room-id) — это контейнер для отображения, не
// тот id что записывается в бронь. Поэтому Стандарт с composition 1чел летит
// в 193606 (название «Стандарт для 1 взрослого» в LK Bnovo), а 2чел — в 193602.
export const BNOVO_ROOM_BY_SLUG: Record<string, BnovoRoomMapping> = {
  vip: {
    display_name: 'VIP',
    variants: [
      { room_type_id: 193608, capacity: 1, bed_variant: 2 }, // VIP для 1 взрослого
      { room_type_id: 193604, capacity: 2, bed_variant: 2 }, // VIP
    ],
  },
  panorama: {
    display_name: 'Люкс с панорамной спальной',
    variants: [
      { room_type_id: 294843, capacity: 1, bed_variant: 2 }, // Люкс с панорамной для 1 взрослого
      { room_type_id: 241615, capacity: 2, bed_variant: 2 }, // Люкс с панорамной
    ],
  },
  lux: {
    display_name: 'Люкс',
    // Lux в каталоге Bnovo показывает 4 composition'а через tariff__table,
    // каждая привязана к своему room_type_id (data-room-id на input):
    //   1 чел       → 193607 (5000 ₽/ночь, «Люкс для 1 взрослого»)
    //   2 чел       → 193603 (6000 ₽/ночь, «Люкс»)
    //   3 чел + 2 дет → 415951 (7500 ₽/ночь, «Люкс с детьми»)
    //   3 чел       → 415950 (8000 ₽/ночь, «Люкс трёхместный»)
    variants: [
      { room_type_id: 193607, capacity: 1, bed_variant: 2 },
      { room_type_id: 193603, capacity: 2, bed_variant: 2 },
      { room_type_id: 415950, capacity: 3, bed_variant: 2 },
      { room_type_id: 415951, capacity: 5, bed_variant: 2 }, // 3 взр + 2 дет = 5 суммарно
    ],
  },
  standard: {
    display_name: 'Стандарт',
    variants: [
      { room_type_id: 193606, capacity: 1, bed_variant: 2 }, // «Стандарт для 1 взрослого»
      { room_type_id: 193602, capacity: 2, bed_variant: 2 }, // «Стандарт»
    ],
  },
}

/**
 * Подобрать Bnovo-вариант под нужный состав. Стратегия:
 *   1. Точное совпадение по capacity.
 *   2. Иначе минимальный variant с capacity >= guests (минимальная переплата).
 *   3. Если такого нет (guests > всех capacity) — самый большой variant.
 */
export function resolveBnovoVariant(mapping: BnovoRoomMapping, guests: number): BnovoVariant {
  const g = Math.max(1, Math.floor(guests))
  const sorted = [...mapping.variants].sort((a, b) => a.capacity - b.capacity)
  const exact = sorted.find(v => v.capacity === g)
  if (exact) return exact
  const fitting = sorted.find(v => v.capacity >= g)
  if (fitting) return fitting
  return sorted[sorted.length - 1]!
}

// Обратный индекс — Bnovo room_type_id -> наш слаг. Используется бэкендом
// `bnovo-rates.ts` чтобы из ответа PMS вычленить только мапленные категории.
export const BNOVO_SLUG_BY_TYPE_ID: Record<number, string> = (() => {
  const out: Record<number, string> = {}
  for (const [slug, m] of Object.entries(BNOVO_ROOM_BY_SLUG)) {
    for (const v of m.variants) out[v.room_type_id] = slug
  }
  return out
})()

export function getBnovoRoomBySlug(slug: string): BnovoRoomMapping | null {
  return BNOVO_ROOM_BY_SLUG[slug] ?? null
}

export function getSiteSlugByBnovoTypeId(id: number): string | null {
  return BNOVO_SLUG_BY_TYPE_ID[id] ?? null
}
