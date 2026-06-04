// POST /api/booking — приём заявок с полной страницы /booking.
// Пишет в bookings + consents, отправляет в Telegram, пытается создать
// бронь в Bnovo через серый-канал. При неудаче — заявка всё равно
// сохранена у нас, ресепшн заносит руками (бронь не теряется).
import { z } from 'zod'
import { useDb } from '../utils/db'
import { getClientIp, getUserAgent } from '../utils/request'
import { bookingSchema, CONSENT_TEXT } from '../utils/schemas'
import { escHtml, notifyTelegram } from '../utils/notify'
import { submitBnovoBooking } from '../utils/bnovo-booking'
import { getBnovoRoomBySlug } from '../utils/bnovo-mapping'
import { fetchBnovoRates, fromBnovoDate } from '../utils/bnovo-rates'

export default defineEventHandler(async (event) => {
  let body
  try {
    body = bookingSchema.parse(await readBody(event))
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Не удалось принять заявку: проверьте поля и попробуйте снова.',
        data: {
          message: 'Не удалось принять заявку: проверьте поля и попробуйте снова.',
          issues: err.issues,
        },
      })
    }
    throw err
  }

  const sql = useDb()
  const ip = getClientIp(event)
  const ua = getUserAgent(event)
  const firstRoom = body.rooms[0]
  const firstGuests = firstRoom.guests[0]

  // С фронта приходит слаг "vip"/"panorama"/... Маппим на Bnovo: первый variant
  // (минимальная capacity) для отображения. Реальный room_type_id под состав
  // подбирается уже в bnovo-booking.ts через resolveBnovoVariant.
  const roomSlug = firstRoom.room_type_id ?? null
  const bnovoRoom = roomSlug ? getBnovoRoomBySlug(roomSlug) : null
  const roomTypeIdForDb = bnovoRoom ? String(bnovoRoom.variants[0]!.room_type_id) : null
  const roomDisplayName = bnovoRoom ? bnovoRoom.display_name : (roomSlug ?? null)

  const [row] = await sql.begin(async (tx) => {
    const inserted = await tx<{ id: string }[]>`
      INSERT INTO bookings (
        arrival, departure, adults, children,
        room_slug, room_type_id, rate_id, extras,
        guest_first_name, guest_last_name, guest_phone, guest_email, guest_city,
        comment, total_estimate, source_ip, user_agent
      ) VALUES (
        ${body.arrival}, ${body.departure}, ${firstGuests.adults}, ${firstGuests.children},
        ${roomSlug},
        ${roomTypeIdForDb}, ${firstRoom.rate_id ?? null}, ${sql.json(body.extras ?? [])},
        ${body.guest.first_name}, ${body.guest.last_name || null},
        ${body.guest.phone}, ${body.guest.email || null}, ${body.guest.city || null},
        ${body.comment || null}, ${body.total_estimate ?? null},
        ${ip}, ${ua}
      )
      RETURNING id
    `
    const id = inserted[0]!.id
    await tx`
      INSERT INTO consents (form_kind, related_kind, related_id, name, phone, email, policy_text, source_ip, user_agent)
      VALUES (
        'booking', 'booking', ${id},
        ${`${body.guest.first_name} ${body.guest.last_name || ''}`.trim()},
        ${body.guest.phone}, ${body.guest.email || null}, ${CONSENT_TEXT},
        ${ip}, ${ua}
      )
    `
    return inserted
  })

  // --- Telegram (как и раньше) ---
  // Состав: суммируем по всем roomы запроса (single = 1 строка, multi = N).
  // Возрасты детей нужны ресепшну для подготовки номера (кроватка/питание/активности).
  // Дети 15+ фронт уже переносит в adults через effective*, в childrenAges остаются
  // только реальные «дети» (0–14 лет).
  const totalAdults = body.rooms.reduce((s, r) => s + (r.guests[0]?.adults ?? 0), 0)
  const totalChildren = body.rooms.reduce((s, r) => s + (r.guests[0]?.children ?? 0), 0)
  const totalChildAges: number[] = body.rooms.flatMap(r => r.guests[0]?.childrenAges ?? [])
  const guestsSummary = totalChildren > 0
    ? `${totalAdults} взр. + ${totalChildren} дет. (возрасты: ${totalChildAges.map(a => a === 0 ? '<1' : `${a}`).join(', ')})`
    : `${totalAdults} взр.`

  const tgText = [
    '🏔 <b>Новая заявка на бронирование</b>',
    `№ ${row.id}`,
    '',
    `Гость: <b>${escHtml(body.guest.first_name)} ${escHtml(body.guest.last_name)}</b>`,
    `Телефон: <code>${escHtml(body.guest.phone)}</code>`,
    body.guest.email ? `Email: ${escHtml(body.guest.email)}` : '',
    body.guest.city ? `Город: ${escHtml(body.guest.city)}` : '',
    '',
    `Заезд: <b>${body.arrival}</b> → Выезд: <b>${body.departure}</b>`,
    `Гостей: ${guestsSummary}`,
    roomDisplayName ? `Номер: ${escHtml(roomDisplayName)}` : '',
    // Доп. услуги оплачиваются отдельно и идут читаемым блоком внутри комментария
    // (он же уходит в notes Bnovo) — отдельной строкой по слагам не дублируем.
    body.total_estimate ? `Оценка стоимости брони: ${body.total_estimate} ₽` : '',
    body.comment ? `\nКомментарий:\n${escHtml(body.comment)}` : '',
  ].filter(Boolean).join('\n')

  await notifyTelegram({ kind: 'booking', id: row.id, text: tgText })

  // --- МУЛЬТИ-БРОНЬ: несколько номеров одной заявкой ---
  // Bnovo принимает мульти-номер ОДНИМ POST'ом через roomTypes={"id1":{c,bv},"id2":{c,bv}}
  // и создаёт N связанных броней с общим bookingNumber. Атомарно: либо все
  // создались, либо ни одна (одна транзакция Bnovo). Подтверждено HAR-записью
  // реальной мульти-брони в radde/bnovo_tests/nr_2.
  //
  // Pre-check availability в мульти-режиме мы пропускаем — слишком много
  // комбинаций состава возможно, а сам Bnovo вернёт ошибку «занято» если
  // что-то изменилось за последние секунды (мы это поймаем как bnovo_error).
  const isMultiRoom = body.rooms.length > 1
  if (isMultiRoom) {
    // Каждый body.rooms[i] = один физический номер с собственным составом гостей
    // (фронт раскладывает через combinator distribution). НЕ агрегируем по slug —
    // distribution критичен для Bnovo services (см. bnovo-booking.ts), иначе для
    // 2× Standard с гостями 1+2 PMS создаст 2+2=4 (баг сессии 14.05).
    const roomsForBnovo: Array<{ slug: string; guests: number }> = []
    for (const r of body.rooms) {
      const slug = r.room_type_id
      if (!slug) continue
      const guestsInRoom = (r.guests[0]?.adults ?? 0) + (r.guests[0]?.children ?? 0)
      roomsForBnovo.push({ slug, guests: Math.max(1, guestsInRoom) })
    }

    // Суммируем общий состав группы для adults/children параметров.
    const totalAdults = body.rooms.reduce((s, r) => s + (r.guests[0]?.adults ?? 0), 0)
    const totalChildren = body.rooms.reduce((s, r) => s + (r.guests[0]?.children ?? 0), 0)
    const allChildAges: number[] = body.rooms.flatMap(r => r.guests[0]?.childrenAges ?? [])

    let bnovoMulti: Awaited<ReturnType<typeof submitBnovoBooking>> | null = null
    try {
      bnovoMulti = await submitBnovoBooking({
        arrival: body.arrival,
        departure: body.departure,
        adults: totalAdults,
        children: totalChildren,
        childrenAges: allChildAges,
        rooms: roomsForBnovo,
        guest: {
          first_name: body.guest.first_name,
          last_name: body.guest.last_name || '',
          phone: body.guest.phone,
          email: body.guest.email || '',
          notes: body.comment || '',
        },
      })
    } catch (err) {
      bnovoMulti = { ok: false, error: (err as Error).message, status: null }
    }

    // Группируем по slug для красивого вывода: «2× Standard + Дом» вместо «Std + Std + Дом».
    const roomsLabel = (() => {
      const counts = new Map<string, { name: string; count: number }>()
      for (const r of roomsForBnovo) {
        const m = getBnovoRoomBySlug(r.slug)
        const name = m ? m.display_name : r.slug
        const ex = counts.get(r.slug)
        if (ex) ex.count += 1
        else counts.set(r.slug, { name, count: 1 })
      }
      return Array.from(counts.values()).map(x => x.count > 1 ? `${x.count}× ${x.name}` : x.name).join(' + ')
    })()

    if (bnovoMulti.ok) {
      await sql`
        UPDATE bookings SET
          bnovo_booking_number = ${bnovoMulti.bookingNumber},
          bnovo_payment_url    = ${bnovoMulti.paymentUrl},
          bnovo_status         = 'sent',
          bnovo_sent_at        = now()
        WHERE id = ${row.id}
      `
      await notifyTelegram({
        kind: 'booking',
        id: row.id,
        text: [
          `🏔 <b>МУЛЬТИ-БРОНЬ #${row.id} создана в Bnovo</b>`,
          `Набор: <b>${escHtml(roomsLabel)}</b> (Bnovo создаст ${roomsForBnovo.length} связанных броней под одним номером)`,
          `Bnovo bookingNumber: <code>${escHtml(bnovoMulti.bookingNumber)}</code>`,
          bnovoMulti.paymentUrl ? '💳 Ожидает оплату гостя' : '(без онлайн-предоплаты)',
        ].join('\n'),
      })
      return {
        ok: true,
        id: row.id,
        bnovoBookingNumber: bnovoMulti.bookingNumber,
        paymentUrl: bnovoMulti.paymentUrl,
        // Дедлайн оплаты — Bnovo держит бронь 15 минут на тарифе onlinepay,
        // потом автоматически отменяет. Возвращаем ISO timestamp, фронт
        // показывает обратный отсчёт на success-странице.
        paymentDeadline: bnovoMulti.paymentUrl ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null,
        conflict: null,
        bnovoError: null,
        nextAvailableFrom: null,
        nextAvailableTo: null,
        nextAvailableNights: null,
      }
    }
    // Не получилось — fallback в manual_pending: ресепшн доделает руками.
    await sql`
      UPDATE bookings SET
        bnovo_status = 'manual_pending',
        bnovo_error  = ${`Мульти-бронь не прошла автоматически (${bnovoMulti.error}). Набор: ${roomsLabel}`},
        bnovo_sent_at = now()
      WHERE id = ${row.id}
    `
    await notifyTelegram({
      kind: 'booking',
      id: row.id,
      text: [
        `⚠️ <b>МУЛЬТИ-БРОНЬ #${row.id}: автоматически не прошла</b>`,
        `Набор: <b>${escHtml(roomsLabel)}</b>`,
        `Гость: <b>${escHtml(body.guest.first_name)} ${escHtml(body.guest.last_name)}</b>`,
        `Контакты: <code>${escHtml(body.guest.phone)}</code> · ${escHtml(body.guest.email || '—')}`,
        `Заезд → выезд: <b>${body.arrival}</b> → <b>${body.departure}</b>`,
        `Состав: ${guestsSummary}`,
        `Ошибка PMS: <code>${escHtml(bnovoMulti.error)}</code>`,
        '',
        '⚠️ Создайте брони вручную в Bnovo и перезвоните гостю.',
      ].join('\n'),
    })
    return {
      ok: true,
      id: row.id,
      bnovoBookingNumber: null,
      paymentUrl: null,
      paymentDeadline: null,
      conflict: 'bnovo_error' as const,
      bnovoError: bnovoMulti.error,
      nextAvailableFrom: null,
      nextAvailableTo: null,
      nextAvailableNights: null,
    }
  }

  // --- Pre-check: свежая availability ---
  // До того как лупить POST в Bnovo, перепроверяем что выбранный номер всё ещё
  // свободен на эти даты. Это решает race condition: фронт мог показать «свободно»
  // 5 минут назад, а пока гость заполнял форму — кто-то занял (через OTA или ресепшн).
  // Если занято — записываем заявку как 'unavailable', НЕ дёргаем write-канал,
  // возвращаем фронту conflict-структуру, чтобы он показал гостю понятную модалку
  // с ближайшей свободной датой.
  let availabilityConflict: {
    nextAvailableFrom: string | null
    nextAvailableTo: string | null
    nextAvailableNights: number | null
  } | null = null

  if (roomSlug && bnovoRoom) {
    try {
      // Запрашиваем variants для inflated-состава (+15+ детей), маленькие — отдельной
      // надбавкой не идут на проверку доступности, только в финальную цену брони.
      const childrenAdultPrecheck = (firstGuests.childrenAges || []).filter((a) => typeof a === 'number' && a >= 15).length
      const rates = await fetchBnovoRates({
        arrival: body.arrival,
        departure: body.departure,
        adults: firstGuests.adults + childrenAdultPrecheck,
        children: 0,
        bust: true, // принудительный обход кэша — это финальная проверка
      })
      const roomRate = rates.rooms.find((r) => r.site_slug === roomSlug)
      const isFree = roomRate && roomRate.status === 'available' && roomRate.available_count > 0
      if (!isFree) {
        // Ищем альтернативный период ТОЙ ЖЕ длины что гость запросил
        // (consistent с /api/availability логикой).
        const requestedNights = Math.max(1, Math.round((Date.parse(body.departure) - Date.parse(body.arrival)) / 86400000))
        let nextFrom: string | null = null
        let nextTo: string | null = null
        let nextNights: number | null = null
        if (roomRate && roomRate.alternatives.length > 0) {
          const futureAlts = roomRate.alternatives
            .map((a) => ({ isoFrom: fromBnovoDate(a.dfrom), isoTo: fromBnovoDate(a.dto) }))
            .filter((a): a is { isoFrom: string; isoTo: string } => !!a.isoFrom && !!a.isoTo && a.isoFrom > body.arrival)
            .sort((a, b) => a.isoFrom.localeCompare(b.isoFrom))
          const fitting = futureAlts.find((a) => {
            const ms = Date.parse(a.isoTo) - Date.parse(a.isoFrom)
            return ms > 0 && Math.round(ms / 86400000) >= requestedNights
          })
          if (fitting) {
            nextFrom = fitting.isoFrom
            const d = new Date(fitting.isoFrom + 'T00:00:00Z')
            d.setUTCDate(d.getUTCDate() + requestedNights)
            nextTo = d.toISOString().slice(0, 10)
            nextNights = requestedNights
          } else if (futureAlts.length > 0) {
            const alt = futureAlts[0]!
            nextFrom = alt.isoFrom
            nextTo = alt.isoTo
            const ms = Date.parse(alt.isoTo) - Date.parse(alt.isoFrom)
            if (ms > 0) nextNights = Math.round(ms / 86400000)
          }
        }
        availabilityConflict = { nextAvailableFrom: nextFrom, nextAvailableTo: nextTo, nextAvailableNights: nextNights }
      }
    } catch (err) {
      // Если /availability упал — не блокируем заявку, продолжаем по обычному flow.
      // Bnovo write-канал сам разберётся; ошибку видно будет в bnovo_error.
      availabilityConflict = null
    }
  }

  if (availabilityConflict) {
    const reasonText = availabilityConflict.nextAvailableFrom
      ? `Номер «${roomDisplayName}» занят на ${body.arrival}→${body.departure}. Ближайшая свободная дата заезда: ${availabilityConflict.nextAvailableFrom}.`
      : `Номер «${roomDisplayName}» занят на ${body.arrival}→${body.departure}. Альтернативные даты не предложены.`
    await sql`
      UPDATE bookings SET
        bnovo_status = 'unavailable',
        bnovo_error  = ${reasonText},
        bnovo_sent_at = now()
      WHERE id = ${row.id}
    `
    await notifyTelegram({
      kind: 'booking',
      id: row.id,
      text: [
        `ℹ️ <b>Заявка #${row.id}: номер занят на эти даты</b>`,
        `Категория: <b>${escHtml(roomDisplayName ?? '')}</b>`,
        `Гостю показано: «номер только что заняли, выбрать другие даты/номер».`,
        availabilityConflict.nextAvailableFrom
          ? `Bnovo подсказал ближайшую свободную дату: <b>${availabilityConflict.nextAvailableFrom}</b>`
          : 'Bnovo не предложил альтернатив — нужно перезвонить гостю.',
      ].join('\n'),
    })
    return {
      ok: true, // заявка принята в БД, фронт показывает специальную модалку
      id: row.id,
      bnovoBookingNumber: null,
      paymentUrl: null,
      paymentDeadline: null,
      conflict: 'unavailable' as const,
      nextAvailableFrom: availabilityConflict.nextAvailableFrom,
      nextAvailableTo: availabilityConflict.nextAvailableTo,
      nextAvailableNights: availabilityConflict.nextAvailableNights,
    }
  }

  // --- Серый-канал в Bnovo (не блокирует ответ пользователю при таймаутах БД) ---
  // Запускаем синхронно, чтобы получить bookingNumber/paymentUrl в ответ.
  // Если упадёт — статус 'failed' в БД, ресепшн заносит руками.
  let bnovoResult: Awaited<ReturnType<typeof submitBnovoBooking>> | null = null
  if (roomSlug && bnovoRoom) {
    try {
      bnovoResult = await submitBnovoBooking({
        arrival: body.arrival,
        departure: body.departure,
        adults: firstGuests.adults,
        children: firstGuests.children,
        childrenAges: firstGuests.childrenAges,
        room_slug: roomSlug,
        guest: {
          first_name: body.guest.first_name,
          last_name: body.guest.last_name || '',
          phone: body.guest.phone,
          email: body.guest.email || '',
          notes: body.comment || '',
        },
      })
    } catch (err) {
      bnovoResult = { ok: false, error: (err as Error).message, status: null }
    }
  } else {
    bnovoResult = {
      ok: false,
      error: roomSlug ? `Слаг "${roomSlug}" не найден в bnovo-mapping` : 'Номер не выбран',
      status: null,
    }
  }

  if (bnovoResult.ok) {
    await sql`
      UPDATE bookings SET
        bnovo_booking_number = ${bnovoResult.bookingNumber},
        bnovo_payment_url    = ${bnovoResult.paymentUrl},
        bnovo_status         = 'sent',
        bnovo_sent_at        = now()
      WHERE id = ${row.id}
    `
    // Дополнительный TG-апдейт — ресепшн видит сразу что бронь в системе
    await notifyTelegram({
      kind: 'booking',
      id: row.id,
      text: `✅ <b>Бронь #${row.id} создана в Bnovo</b>\nНомер: <code>${escHtml(bnovoResult.bookingNumber)}</code>${
        bnovoResult.paymentUrl ? `\n💳 Ожидает оплату гостя` : '\n(без онлайн-предоплаты)'
      }`,
    })
  } else {
    await sql`
      UPDATE bookings SET
        bnovo_status = 'failed',
        bnovo_error  = ${bnovoResult.error},
        bnovo_sent_at = now()
      WHERE id = ${row.id}
    `
    // TG-предупреждение ресепшн: занеси руками
    await notifyTelegram({
      kind: 'booking',
      id: row.id,
      text: `⚠️ <b>Bnovo упал для брони #${row.id}</b>\nЗанесите вручную в ЛК Bnovo.\nОшибка: <code>${escHtml(bnovoResult.error)}</code>`,
    })
  }

  return {
    ok: true,
    id: row.id,
    bnovoBookingNumber: bnovoResult.ok ? bnovoResult.bookingNumber : null,
    // Фронт обязан редиректнуть гостя на paymentUrl если он есть (онлайн-предоплата).
    // Если null — бронь подтверждена, гость платит при заезде.
    paymentUrl: bnovoResult.ok ? bnovoResult.paymentUrl : null,
    // Если Bnovo вернул ошибку — отдаём её фронту, чтобы он не показывал
    // success как ни в чём не бывало, а сообщил гостю что менеджер свяжется.
    conflict: bnovoResult.ok ? null : ('bnovo_error' as const),
    bnovoError: bnovoResult.ok ? null : bnovoResult.error,
    paymentDeadline: bnovoResult.ok && bnovoResult.paymentUrl
      ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
      : null,
    nextAvailableFrom: null,
    nextAvailableTo: null,
    nextAvailableNights: null,
  }
})
