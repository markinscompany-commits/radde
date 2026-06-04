-- 0002_bnovo.sql — расширение bookings под интеграцию с Bnovo PMS.
-- Серый-канал (POST на reservationsteps.ru) — пишем результат каждой попытки,
-- даже если упало: ресепшн сможет занести руками и связать с нашей записью.

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS bnovo_booking_number TEXT,
  ADD COLUMN IF NOT EXISTS bnovo_payment_url    TEXT,
  ADD COLUMN IF NOT EXISTS bnovo_status         TEXT
    NOT NULL DEFAULT 'pending';
  -- bnovo_status values:
  --   'pending'   — ещё не пытались отправить
  --   'sent'      — POST успешный, bookingNumber получен
  --   'failed'    — POST упал (текст ошибки в bnovo_error)
  --   'manual'    — ресепшн занёс руками после нашего fallback

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS bnovo_error          TEXT,
  ADD COLUMN IF NOT EXISTS bnovo_sent_at        TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS bookings_bnovo_status_idx ON bookings(bnovo_status)
  WHERE bnovo_status IN ('pending', 'failed');

CREATE INDEX IF NOT EXISTS bookings_bnovo_number_idx ON bookings(bnovo_booking_number)
  WHERE bnovo_booking_number IS NOT NULL;
