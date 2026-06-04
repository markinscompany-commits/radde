<template>
  <div>
    <UiAppHeader />

    <!-- Hero strip -->
    <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-40 pb-12 md:pb-16">
      <UiPicture
        :src="`${base}images/hero/hero-1.jpg`"
        alt="Горный пейзаж Гуниба — пансионат Радде"
        sizes="100vw"
        class="absolute inset-0 w-full h-full object-cover"
        decoding="async"
      />
      <div class="absolute inset-0 bg-sand-900/82"></div>

      <div class="container relative z-10">
        <div class="max-w-160 mx-auto text-center">
          <h1 class="text-h1 text-white mb-4">
            Бронь <span class="section-title-accent text-sand-300">зарезервирована</span>
          </h1>
          <div v-if="bnovoNumber" class="booking-ids">
            <span class="booking-id-chip">Номер брони: <b>{{ bnovoNumber }}</b></span>
          </div>

          <!-- Countdown до автоматической отмены брони. Расположен на hero-фоне,
               чтобы был виден «выше сгиба» на всех разрешениях — гость сразу
               понимает срочность оплаты. На мобиле компактнее (clamp по padding/шрифту). -->
          <div
            v-if="paymentUrl && !isExpired && countdownLabel"
            class="hero-countdown"
            :class="{ 'hero-countdown--urgent': isUrgent }"
          >
            <svg class="hero-countdown__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 7v5l3 2"/>
            </svg>
            <span class="hero-countdown__label">До&nbsp;автоматической отмены брони</span>
            <span class="hero-countdown__value">{{ countdownLabel }}</span>
          </div>
          <div
            v-else-if="paymentUrl && isExpired"
            class="hero-countdown hero-countdown--expired"
          >
            <svg class="hero-countdown__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9"/>
              <path d="M9 12h6"/>
            </svg>
            <span class="hero-countdown__label">Время ожидания оплаты истекло</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Что дальше -->
    <section class="bg-sand-50 section-padding">
      <div class="container">
        <div class="max-w-180 mx-auto">

          <!-- Блок оплаты аванса (показывается только если бронь требует предоплаты) -->
          <div v-if="paymentUrl" class="pay-card" :class="{ 'pay-card--expired': isExpired }">
            <div class="pay-card__head">
              <div class="pay-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <path d="M2 10h20M6 15h4"/>
                </svg>
              </div>
              <div>
                <h2 class="pay-card__title">
                  <template v-if="isExpired">Время ожидания оплаты истекло</template>
                  <template v-else>Чтобы бронь стала&nbsp;окончательной — внесите аванс</template>
                </h2>
              </div>
            </div>

            <!-- Countdown отображается в hero-блоке выше — гость видит таймер
                 прямо рядом с заголовком, не приходится скроллить за CTA. -->

            <a v-if="!isExpired" :href="paymentUrl" target="_blank" rel="noopener" class="btn-primary pay-card__btn">
              Оплатить аванс
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="ml-2 inline-block">
                <path d="M7 17L17 7M9 7h8v8"/>
              </svg>
            </a>
            <p v-if="!isExpired" class="pay-card__hint">
              Откроется в&nbsp;новой вкладке. Если страница оплаты закрылась, или ссылка устарела — позвоните, мы выставим счёт повторно.
            </p>
            <p v-else class="pay-card__hint">
              Бронь, скорее всего, уже&nbsp;отменена в&nbsp;системе. Свяжитесь с&nbsp;нами или&nbsp;забронируйте заново&nbsp;— номер мог быть занят другим гостем.
            </p>
          </div>

          <!-- Условия отмены / гарантии — пользователь должен понимать что произойдёт дальше -->
          <div class="terms-card mb-12">
            <h2 class="terms-card__title">Условия брони и&nbsp;отмены</h2>
            <ul class="terms-list">
              <li>
                <strong>Аванс</strong> закрепляет номер за&nbsp;вами и&nbsp;вычитается из&nbsp;итоговой стоимости при&nbsp;заселении.
              </li>
              <li>
                <strong>Заезд</strong> с&nbsp;14:00, <strong>выезд</strong> до&nbsp;12:00. Ранний заезд и&nbsp;поздний выезд&nbsp;— по&nbsp;согласованию.
              </li>
              <li>
                <strong>Остаток</strong> — наличными при&nbsp;заселении или&nbsp;банковским переводом по&nbsp;реквизитам.
              </li>
              <li>
                <strong>Отмена брони:</strong>
                <span class="terms-cancel">
                  <span><b>больше&nbsp;7&nbsp;дней</b> до&nbsp;заезда — аванс возвращается полностью</span>
                  <span><b>3–7&nbsp;дней</b> — удерживается стоимость первой ночи</span>
                  <span><b>меньше&nbsp;3&nbsp;дней</b> или&nbsp;неявка — аванс не&nbsp;возвращается</span>
                </span>
              </li>
              <li>
                При&nbsp;форс-мажоре (закрытие дорог, отмена авиарейсов, болезнь с&nbsp;подтверждением) условия пересматриваем индивидуально.
              </li>
            </ul>
          </div>

          <div class="text-center mb-10 mt-2">
            <p class="text-body text-sand-700 mb-5 max-w-130 mx-auto">
              Нужно срочно связаться с&nbsp;нами или передать что-то важное?
            </p>
            <div class="flex flex-wrap items-center justify-center gap-3">
              <a :href="`tel:${contacts.phone.tel}`" class="btn-primary">
                Позвонить — {{ contacts.phone.display }}
              </a>
              <a :href="contacts.whatsapp" target="_blank" rel="noopener" class="btn-secondary">
                Написать в WhatsApp
              </a>
            </div>
          </div>

          <div class="text-center pt-8 border-t border-sand-200">
            <a :href="base" class="text-body text-sand-700 hover:text-sand-900 transition-colors">← На главную</a>
          </div>
        </div>
      </div>
    </section>

    <UiSiteFooter />
  </div>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
const contacts = useContacts()

useSiteMeta({
  title: 'Бронь зарезервирована — Радде',
  description: 'Ваша бронь зарезервирована в нашей системе. Оплатите аванс, чтобы она стала окончательной.',
  path: '/booking/success',
})
useHead({
  meta: [{ name: 'robots', content: 'noindex, follow' }],
})

// На странице успеха показываем имя гостя + ID нашей заявки и номер брони Bnovo.
// Источники (по приоритету): query-параметры (?id=...&bnovo=...) — чтобы ссылку
// можно было переслать ресепшну, и localStorage 'radde_booking_last' как fallback.
const lastBooking = ref<{
  firstName?: string
  phone?: string
  ourId?: number | null
  bnovoNumber?: string | null
  paymentUrl?: string | null
  paymentDeadline?: string | null
  totalEstimate?: number | null
} | null>(null)
const route = useRoute()
const queryBnovo = computed(() => {
  const v = route.query.bnovo
  return typeof v === 'string' && v ? v : null
})

// Tick для countdown'а — обновляется каждую секунду пока браузер не закроют.
const now = ref(Date.now())
let tickTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem('radde_booking_last')
    if (raw) lastBooking.value = JSON.parse(raw)
  } catch {
    // ignore
  }
  tickTimer = setInterval(() => { now.value = Date.now() }, 1000)
})

onBeforeUnmount(() => {
  if (tickTimer) clearInterval(tickTimer)
})

const bnovoNumber = computed(() => queryBnovo.value ?? lastBooking.value?.bnovoNumber ?? null)

// paymentUrl держим только в localStorage (одноразовый длинный URL).
// Querystring помечает наличие через ?pay=1, сам URL читаем из 'radde_booking_last'.
const paymentUrl = computed(() => lastBooking.value?.paymentUrl ?? null)

// Дедлайн оплаты — ISO timestamp от backend'а (booking creation + 15 min).
// Если в localStorage отсутствует (старая бронь из предыдущего деплоя) —
// countdown не показываем, остальной UX работает как раньше.
const paymentDeadlineMs = computed(() => {
  const iso = lastBooking.value?.paymentDeadline
  if (!iso) return null
  const t = Date.parse(iso)
  return Number.isFinite(t) ? t : null
})
const remainingMs = computed(() => {
  if (!paymentDeadlineMs.value) return null
  return Math.max(0, paymentDeadlineMs.value - now.value)
})
const isExpired = computed(() => remainingMs.value != null && remainingMs.value <= 0)
const isUrgent = computed(() => remainingMs.value != null && remainingMs.value > 0 && remainingMs.value < 5 * 60 * 1000)
const countdownLabel = computed(() => {
  if (remainingMs.value == null || remainingMs.value <= 0) return ''
  const totalSec = Math.ceil(remainingMs.value / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})
</script>

<style scoped>
.step-card {
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 16px;
  padding: 24px 22px 22px;
  position: relative;
  display: flex;
  flex-direction: column;
}
.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #4A6330;
  color: #F4F6EE;
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 14px;
}
.step-title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: #2C2416;
  margin-bottom: 8px;
}
.step-text {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  line-height: 1.55;
  color: #6B5B4A;
}

/* Hero countdown — таймер до авто-отмены брони, видимый «выше сгиба»
   на фоне hero-фото. На мобиле компактный (clamp gap/font), на ПК шире.
   Состояния:
    - default (>5 мин): полупрозрачный амбер фон, белая обводка
    - --urgent (<5 мин): яркий амбер фон, чёрная цифра, лёгкий glow
    - --expired: серая плашка без цифры. */
.hero-countdown {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 12px;
  margin-top: clamp(18px, 3vw, 26px);
  padding: clamp(9px, 1.6vw, 12px) clamp(16px, 2.5vw, 22px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.92);
  font-family: 'Source Sans 3', sans-serif;
  font-size: clamp(13.5px, 1.6vw, 15px);
  line-height: 1.2;
  backdrop-filter: blur(6px);
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.hero-countdown__icon {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.85);
}
.hero-countdown__label {
  display: inline-block;
  white-space: nowrap;
}
.hero-countdown__value {
  font-weight: 700;
  color: white;
  font-feature-settings: 'tnum';
  letter-spacing: 0.02em;
  font-size: clamp(15px, 2.1vw, 17px);
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(245, 199, 122, 0.22);
  border: 1px solid rgba(245, 199, 122, 0.45);
}
.hero-countdown--urgent {
  background: rgba(224, 128, 64, 0.22);
  border-color: rgba(245, 199, 122, 0.55);
  color: white;
  box-shadow: 0 0 0 1px rgba(245, 199, 122, 0.25), 0 6px 18px rgba(193, 100, 30, 0.35);
}
.hero-countdown--urgent .hero-countdown__icon { color: #F5C77A; }
.hero-countdown--urgent .hero-countdown__value {
  background: linear-gradient(135deg, #F5C77A, #E0A040);
  color: #2C2416;
  border-color: rgba(255, 255, 255, 0.4);
}
.hero-countdown--expired {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.65);
}
.hero-countdown--expired .hero-countdown__icon { color: rgba(255, 255, 255, 0.5); }

@media (max-width: 520px) {
  /* На узких экранах label + value в одну строку могут переноситься —
     гарантируем что значение всегда читается. */
  .hero-countdown {
    flex-direction: column;
    gap: 6px;
    padding: 12px 18px;
  }
  .hero-countdown__label {
    font-size: 13px;
    white-space: normal;
    text-align: center;
  }
  .hero-countdown__value {
    font-size: 18px;
    padding: 4px 14px;
  }
}

/* Чипы с ID брони на success-странице */
.booking-ids {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}
.booking-id-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  padding: 6px 14px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
}
.booking-id-chip b {
  color: white;
  font-weight: 600;
  font-feature-settings: 'tnum';
  margin-left: 2px;
}
.booking-id-chip--muted {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.6);
}
.booking-id-chip--muted b { color: rgba(255, 255, 255, 0.82); }

/* Inline-CTA в hero strip — кнопка оплаты «выше сгиба» на всех разрешениях */
.hero-pay-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 22px;
  padding: 14px 26px;
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #2C2416;
  background: linear-gradient(135deg, #F5C77A, #E0A040);
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 8px 22px rgba(193, 127, 62, 0.35);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.hero-pay-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 26px rgba(193, 127, 62, 0.42);
}
.hero-pay-cta svg { stroke-width: 2.2; }
@media (max-width: 640px) {
  .hero-pay-cta {
    margin-top: 18px;
    padding: 12px 22px;
    font-size: 15px;
    width: 100%;
    max-width: 320px;
  }
}

/* ===== Pay card ===== */
.pay-card {
  background: linear-gradient(135deg, #FAF0DE, #F5E4C4);
  border: 1.5px solid #D6B07A;
  border-radius: 18px;
  padding: 26px 28px;
  margin-bottom: 24px;
  box-shadow: 0 10px 26px rgba(184, 124, 58, 0.16);
}
.pay-card__head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}
.pay-card__icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: white;
  color: #B5783A;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(193, 127, 62, 0.18);
}
.pay-card__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: clamp(1.15rem, 2.2vw, 1.4rem);
  color: #2C2416;
  margin: 0 0 6px;
  line-height: 1.25;
}
.pay-card__sub {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  line-height: 1.5;
  color: #6B5B4A;
  margin: 0;
}
.pay-card__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px 22px;
  font-size: 16px;
}
@media (min-width: 768px) {
  .pay-card__btn { width: auto; min-width: 240px; }
}
.pay-card__hint {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: #8C6F4B;
  margin: 14px 0 0;
  line-height: 1.5;
}

/* Истёкшая бронь — pay-card в «погашенном» состоянии без яркости.  */
.pay-card--expired {
  background: linear-gradient(135deg, #F5EEE0, #EAE0D0);
  border-color: #C8B49A;
  opacity: 0.95;
}
.pay-card--expired .pay-card__title { color: #6B5B4A; }

/* ===== Terms card ===== */
.terms-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 16px;
  padding: 22px 26px;
}
.terms-card__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: #2C2416;
  margin: 0 0 14px;
}
.terms-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  line-height: 1.55;
  color: #4A3F2E;
}
.terms-list li {
  position: relative;
  padding-left: 20px;
}
.terms-list li::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0.55em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #C17F3E;
}
.terms-list strong {
  font-weight: 600;
  color: #2C2416;
}
.terms-cancel {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}
.terms-cancel b {
  font-weight: 600;
  color: #2C2416;
}
</style>
