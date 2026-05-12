-- 0001_init.sql — базовые таблицы для приёма заявок с сайта (152-ФЗ).
-- Применяется через scripts/migrate.mjs (idempotent runner с журналом в schema_migrations).
-- Расширение схемы под админку — Этап 2.

-- Журнал применённых миграций
CREATE TABLE IF NOT EXISTS schema_migrations (
  name        TEXT        PRIMARY KEY,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Заявки на бронирование (с /booking)
CREATE TABLE IF NOT EXISTS bookings (
  id               BIGSERIAL    PRIMARY KEY,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  arrival          DATE         NOT NULL,
  departure        DATE         NOT NULL,
  adults           SMALLINT     NOT NULL,
  children         SMALLINT     NOT NULL DEFAULT 0,
  room_slug        TEXT,
  room_type_id     TEXT,
  rate_id          TEXT,
  extras           JSONB        NOT NULL DEFAULT '[]'::jsonb,
  guest_first_name TEXT         NOT NULL,
  guest_last_name  TEXT,
  guest_phone      TEXT         NOT NULL,
  guest_email      TEXT,
  guest_city       TEXT,
  comment          TEXT,
  total_estimate   INTEGER,
  status           TEXT         NOT NULL DEFAULT 'new',
  source_ip        INET,
  user_agent       TEXT
);
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_status_idx     ON bookings(status);

-- Сообщения через форму обратной связи (ContactFooter)
CREATE TABLE IF NOT EXISTS contact_messages (
  id          BIGSERIAL    PRIMARY KEY,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  name        TEXT         NOT NULL,
  phone       TEXT         NOT NULL,
  email       TEXT,
  comment     TEXT,
  status      TEXT         NOT NULL DEFAULT 'new',
  source_ip   INET,
  user_agent  TEXT
);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at DESC);

-- Заявки на трансфер (из секции Location)
CREATE TABLE IF NOT EXISTS transfer_requests (
  id          BIGSERIAL    PRIMARY KEY,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  name        TEXT         NOT NULL,
  phone       TEXT         NOT NULL,
  flight      TEXT,
  status      TEXT         NOT NULL DEFAULT 'new',
  source_ip   INET,
  user_agent  TEXT
);
CREATE INDEX IF NOT EXISTS transfer_requests_created_at_idx ON transfer_requests(created_at DESC);

-- Журнал согласий на обработку ПДн (ст. 9 152-ФЗ — обязан вести оператор)
CREATE TABLE IF NOT EXISTS consents (
  id            BIGSERIAL    PRIMARY KEY,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  form_kind     TEXT         NOT NULL,   -- 'booking' | 'contact' | 'transfer' | 'booking_modal'
  related_kind  TEXT,                    -- та же категория, что и form_kind
  related_id    BIGINT,                  -- id записи в bookings/contact_messages/transfer_requests
  name          TEXT         NOT NULL,
  phone         TEXT         NOT NULL,
  email         TEXT,
  policy_text   TEXT         NOT NULL,   -- snapshot строки согласия, которую видел пользователь
  source_ip     INET,
  user_agent    TEXT
);
CREATE INDEX IF NOT EXISTS consents_created_at_idx ON consents(created_at DESC);
CREATE INDEX IF NOT EXISTS consents_related_idx    ON consents(related_kind, related_id);
