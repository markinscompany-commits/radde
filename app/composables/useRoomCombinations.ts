/**
 * Генератор мульти-номер комбинаций для большой компании.
 *
 * Когда `totalGuests` больше, чем вмещает любой один номер (для Радде это
 * Lux=3), показываем гостю готовые наборы из 2-N номеров: «2× Стандарт»,
 * «Стандарт + Люкс», «2× Люкс» и т.п.
 *
 * Алгоритм генерации:
 *  1. Перебираем сколько номеров каждого типа взять (от 0 до availableCount).
 *  2. Отбрасываем комбо с недостаточной вместимостью или слишком большим waste.
 *  3. Для каждого валидного комбо считаем МИНИМАЛЬНУЮ цену через distribution
 *     гостей по номерам (см. `bestDistributionPrice`). Цена номера зависит от
 *     числа гостей в нём — берётся из `priceVariants` PMS, fallback на `priceValue`.
 *  4. Сортируем по реальной цене ascending, возвращаем top-`limit`.
 *
 * Зачем distribution: если в combo «2× Standard» (cap 2+2) для 4 гостей —
 * каждый Std заселяется по 2 чел, цена = variant{2 чел} × 2. Это в Bnovo
 * 4500 × 2 × ночи. Если бы мы брали priceValue (≈ цена за 1 чел = 3500),
 * получили бы 3500 × 2 × ночи — недосчёт 22%.
 */
import type { AvailableRoom } from './useAvailableRooms'
import type { PriceVariant } from '~~/shared/bnovo'

export interface RoomComboItem {
  /** Slug категории (vip/panorama/lux/standard) */
  id: string
  /** Сколько номеров этого типа в комбинации */
  count: number
}

/**
 * Распределение гостей по конкретному физическому номеру в комбо.
 * `roomId` — slug категории (vip/panorama/lux/standard).
 * `guests` — сколько гостей живёт в этом номере (всегда ≥ 1, т.к. пустых не бронируем).
 *
 * Гостей делим как «общую массу», без различия adults/children — Bnovo при
 * создании броней сам распределит детей по возрастам в нужный номер
 * (мы шлём в каждый POST общий состав adults+ages из формы).
 */
export interface RoomDistributionSlot {
  roomId: string
  guests: number
}

export interface RoomCombo {
  /** Состав: список номеров с количеством, сортирован по убыванию вместимости */
  items: RoomComboItem[]
  /** Сколько всего физических номеров в комбинации */
  totalRooms: number
  /** Суммарная вместимость всех номеров (мест) */
  totalCapacity: number
  /** Стоимость одной ночи всех номеров (минимум по distribution гостей) */
  pricePerNight: number
  /** Сколько лишних мест относительно totalGuests (для предпочтения близких к нужному) */
  waste: number
  /**
   * Распределение гостей по физическим номерам, дающее минимальную цену.
   * Длина = totalRooms. Сумма guests = totalGuests запроса.
   * Используется фронтом для отправки per-room состава в Bnovo (N отдельных POST'ов).
   */
  distribution: RoomDistributionSlot[]
  /**
   * Цена за ночь каждого физического номера, в том же порядке что distribution.
   * Сумма = pricePerNight. Используется для точной разбивки в summary
   * («Люкс 6000 ₽/ночь, Стандарт 4500 ₽/ночь» вместо pro-rated усреднения).
   */
  slotPrices: number[]
  /**
   * Стабильный ключ для дедупликации и :key в v-for. Формат: «id1:cnt1|id2:cnt2».
   * Слаги отсортированы по убыванию вместимости — это гарантирует уникальность.
   */
  signature: string
}

export interface RoomCombinationsOptions {
  /** Максимум номеров в одном предложении */
  maxRooms?: number
  /** Максимум «лишних» мест в комбо (предлагаем только близкие по размеру) */
  maxWaste?: number
  /** Сколько вариантов вернуть (по возрастанию цены) */
  limit?: number
  /**
   * Доп. источник variants: запрос availability с минимальным составом (adults=2),
   * где PMS возвращает variants для всех категорий. Если не передан — fallback
   * на variants из основного `rooms`. Нужно для правильного расчёта цены combo
   * когда основной запрос с большим составом возвращает variants пустыми.
   */
  variantsSource?: AvailableRoom[]
  /**
   * Если true — генерируем мульти-варианты ДАЖЕ когда есть один номер,
   * вмещающий всю компанию (по умолчанию в этом случае возвращаем []).
   * Используется когда юзер явно нажал «забронировать несколько номеров»
   * на маленьких составах (3 чел при наличии Lux): он хочет combo, не Lux.
   */
  forceMulti?: boolean
}

const DEFAULTS: Required<Omit<RoomCombinationsOptions, 'variantsSource' | 'forceMulti'>> = {
  // Радде: всего ~10 физических номеров (VIP=2, Pano=2, Lux=4, Std=2). Максимум
  // вместимости пансионата ~18 человек. Разрешаем комбо до 9 номеров —
  // это покрывает максимально большую группу.
  maxRooms: 9,
  // Mark: «±1 чел, в крайнем случае ±2». Если идеального fit'а нет — combinator
  // допускает максимум 2 «лишних» места в combo. Для редких неудобных групп
  // (например 11 чел при cap-конфигурации Радде) гость увидит ближайшие варианты,
  // ресепшн добьёт по телефону.
  maxWaste: 2,
  limit: 8,
}

/**
 * Генерирует осмысленные мульти-номер комбинации для заданного состава гостей.
 */
export function generateRoomCombinations(
  rooms: AvailableRoom[],
  totalGuests: number,
  opts: RoomCombinationsOptions = {},
): RoomCombo[] {
  const { maxRooms, maxWaste, limit } = { ...DEFAULTS, ...opts }
  const variantsSource = opts.variantsSource ?? rooms
  if (totalGuests <= 0) return []

  // Фильтруем категории, которые могут участвовать: есть физические свободные
  // номера на эти даты (`availableCount > 0`) и категория имеет ёмкость.
  // Используем availableCount, а не available — последний от PMS приходит false
  // если ни одна подкатегория не вмещает запрошенный состав, но физически
  // номера свободны и для мульти-комбинации они нам нужны.
  const candidates = rooms
    .filter(r => r.availableCount > 0 && r.guests > 0)
    .sort((a, b) => b.guests - a.guests || a.priceValue - b.priceValue)

  if (candidates.length === 0) return []

  // Если есть один номер, в который все помещаются — мульти-предложение по
  // умолчанию не нужно, обычный room-pick справится. forceMulti=true этот
  // short-circuit отключает (юзер нажал «забронировать несколько номеров»
  // и хочет видеть combo даже когда есть Lux на 3 чел).
  if (!opts.forceMulti) {
    const fitsSingle = candidates.some(r => r.guests >= totalGuests)
    if (fitsSingle) return []
  }

  // Pre-compute карту цен по составу для каждой категории. Берём ВСЕГДА
  // минимум по составу — Bnovo при бронировании сам выберет дешёвую подкатегорию.
  const priceMaps = new Map<string, PriceMap>()
  for (const r of candidates) {
    const ref = variantsSource.find(s => s.id === r.id)
    priceMaps.set(r.id, buildPriceMap(ref?.priceVariants ?? r.priceVariants ?? [], r.priceValue, r.guests))
  }

  const combos: RoomCombo[] = []
  const counts: number[] = []

  function recurse(idx: number, runningCap: number, runningRooms: number) {
    if (runningRooms > maxRooms) return
    if (idx === candidates.length) {
      // На листе: проверяем достаточность вместимости и не слишком ли много лишнего
      if (runningRooms < 2) return // одно — не «мульти», обычный room-pick
      if (runningCap < totalGuests) return
      const waste = runningCap - totalGuests
      if (waste > maxWaste) return

      // Собираем items + физический список номеров для distribution
      const items: RoomComboItem[] = []
      const physRooms: PhysRoom[] = []
      for (let i = 0; i < candidates.length; i++) {
        const c = counts[i]!
        if (c > 0) {
          const cand = candidates[i]!
          items.push({ id: cand.id, count: c })
          const pm = priceMaps.get(cand.id)!
          for (let k = 0; k < c; k++) {
            physRooms.push({ id: cand.id, capacity: cand.guests, priceMap: pm })
          }
        }
      }

      // Считаем минимальную цену distribution гостей по номерам И само распределение.
      const best = bestDistribution(physRooms, totalGuests)
      const distribution: RoomDistributionSlot[] = physRooms.map((r, i) => ({
        roomId: r.id,
        guests: best.takes[i] ?? 1,
      }))
      // Цена каждого физ. номера за ночь по выбранному distribution. Если slot пустой
      // (takes[i]=0, что в норме не должно случаться — combo прошёл cap check), берём
      // фолбэк цену из priceMap по capacity, иначе 0.
      const slotPrices: number[] = physRooms.map((r, i) => {
        const t = best.takes[i] ?? 0
        if (t > 0) return r.priceMap.get(t) ?? r.priceMap.get(r.capacity) ?? 0
        return 0
      })

      const signature = items.map(i => `${i.id}:${i.count}`).join('|')
      combos.push({
        items,
        totalRooms: runningRooms,
        totalCapacity: runningCap,
        pricePerNight: best.price,
        waste,
        signature,
        distribution,
        slotPrices,
      })
      return
    }

    const c = candidates[idx]!
    const maxOfThis = Math.min(c.availableCount, maxRooms - runningRooms)
    for (let take = 0; take <= maxOfThis; take++) {
      counts.push(take)
      recurse(idx + 1, runningCap + take * c.guests, runningRooms + take)
      counts.pop()
    }
  }
  recurse(0, 0, 0)

  // Дедупликация (recurse не должен давать дубли, но для надёжности)
  const seen = new Set<string>()
  const unique = combos.filter(c => {
    if (seen.has(c.signature)) return false
    seen.add(c.signature)
    return true
  })

  // Сортировка: по цене ascending, затем по числу номеров (меньше = удобнее)
  unique.sort(
    (a, b) =>
      a.pricePerNight - b.pricePerNight
      || a.totalRooms - b.totalRooms
      || a.waste - b.waste,
  )

  return unique.slice(0, limit)
}

// ============================================================================
// Distribution price calculation
// ============================================================================

/** Карта «N гостей в номере → минимальная цена за ночь». */
type PriceMap = Map<number, number>

interface PhysRoom {
  id: string
  capacity: number
  priceMap: PriceMap
}

/**
 * Строит карту цен по числу гостей.
 * Для каждого N от 1 до capacity берём минимальную цену среди variants,
 * у которых adults+children == N. Если такого нет — берём ближайший variant
 * с большим N (PMS обычно отдаёт цены для всех валидных составов категории).
 * Если variants пустой — fallback на priceValue для всех N.
 */
function buildPriceMap(variants: PriceVariant[], fallback: number, capacity: number): PriceMap {
  const exact = new Map<number, number>()
  for (const v of variants) {
    const n = v.adults + v.children
    if (n < 1 || n > capacity) continue
    const cur = exact.get(n)
    if (cur == null || v.price_per_night < cur) exact.set(n, v.price_per_night)
  }

  const map = new Map<number, number>()
  for (let n = 1; n <= capacity; n++) {
    if (exact.has(n)) {
      map.set(n, exact.get(n)!)
      continue
    }
    // Ищем ближайший вариант с большим N (минимально-достаточный для N гостей)
    let chosen: number | null = null
    for (let m = n + 1; m <= capacity; m++) {
      if (exact.has(m)) {
        const p = exact.get(m)!
        if (chosen == null || p < chosen) chosen = p
      }
    }
    if (chosen != null) {
      map.set(n, chosen)
    } else {
      // Variants нет вообще — фолбэк на статичный priceValue (per-night).
      map.set(n, fallback)
    }
  }
  return map
}

/**
 * Минимальная цена за ночь для combo'а из N физических номеров и totalGuests гостей,
 * с возвратом самого распределения guests по номерам (для отправки в Bnovo).
 *
 * Перебираем все валидные распределения {x1, x2, ..., xN} такие что:
 *   - sum(xi) == totalGuests
 *   - 1 ≤ xi ≤ capacity_i (минимум 1 — потому что номер мы забронировали и платим за него)
 * И берём минимум по цене.
 *
 * Brute force с pruning. Для combo до 9 номеров и до 18 гостей работает мгновенно.
 *
 * Note: у Радде в Bnovo PMS под одним «именем» (например Стандарт) скрыто
 * НЕСКОЛЬКО room_type_id с разными capacity (193602=2чел, 193606=1чел и т.д.).
 * Поэтому ограничение «uniform per slug» нам не нужно: backend bnovo-booking.ts
 * подбирает конкретный Bnovo-ID для каждого физического номера по нужному составу.
 */
function bestDistribution(rooms: PhysRoom[], totalGuests: number): { price: number; takes: number[] } {
  // Если в комбо больше «обязательных мест» (по 1 на номер), чем гостей —
  // распределение невалидно. Не должно случиться (combo прошёл totalCapacity check),
  // но защитимся: ставим по 1 в первые номера.
  if (rooms.length > totalGuests) {
    const takes = rooms.map((_, i) => (i < totalGuests ? 1 : 0))
    const price = takes.reduce((s, t, i) => s + (t > 0 ? (rooms[i]!.priceMap.get(t) ?? 0) : 0), 0)
    return { price, takes }
  }

  // Pre-compute суффиксы capacity для pruning.
  const suffixCap: number[] = new Array(rooms.length + 1).fill(0)
  for (let i = rooms.length - 1; i >= 0; i--) {
    suffixCap[i] = suffixCap[i + 1]! + rooms[i]!.capacity
  }

  let bestPrice = Infinity
  let bestTakes: number[] = []
  const current: number[] = []

  function recurse(idx: number, remaining: number, costSoFar: number) {
    if (costSoFar >= bestPrice) return // pruning
    if (idx === rooms.length) {
      if (remaining === 0) {
        bestPrice = costSoFar
        bestTakes = current.slice()
      }
      return
    }
    const room = rooms[idx]!
    const minTake = Math.max(1, remaining - suffixCap[idx + 1]!)
    const maxTake = Math.min(room.capacity, remaining - (rooms.length - idx - 1))
    if (maxTake < minTake) return
    for (let take = minTake; take <= maxTake; take++) {
      const cost = room.priceMap.get(take) ?? room.priceMap.get(room.capacity) ?? 0
      current.push(take)
      recurse(idx + 1, remaining - take, costSoFar + cost)
      current.pop()
    }
  }
  recurse(0, totalGuests, 0)
  return {
    price: bestPrice === Infinity ? 0 : bestPrice,
    takes: bestTakes.length > 0 ? bestTakes : rooms.map(() => 1),
  }
}
