<template>
  <div>
    <UiAppHeader />

    <!-- Hero strip -->
    <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-40 pb-12 md:pb-16">
      <img
        :src="`${base}images/hero/hero-1.jpg`"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-sand-900/82"></div>

      <div class="container relative z-10">
        <div class="max-w-160 mx-auto text-center">
          <span class="text-label text-amber-400 mb-4 block">Бронирование</span>
          <h1 class="text-h1 text-white mb-4">
            Заявка <span class="section-title-accent text-sand-300">отправлена</span>
          </h1>
          <p class="text-body-lg text-white/75">
            Спасибо{{ greeting }}! Мы свяжемся {{ contactLine }} в&nbsp;течение 15&nbsp;минут, чтобы подтвердить детали брони.
          </p>
        </div>
      </div>
    </section>

    <!-- Что дальше -->
    <section class="bg-sand-50 section-padding">
      <div class="container">
        <div class="max-w-180 mx-auto">
          <UiSectionHeader label="Что дальше" align="center" title="Как пройдёт" accent="подтверждение" class="mb-10" />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-12">
            <div class="step-card">
              <span class="step-num">1</span>
              <h3 class="step-title">Звонок менеджера</h3>
              <p class="step-text">В&nbsp;течение 15&nbsp;минут позвоним по&nbsp;указанному номеру и&nbsp;уточним детали — даты, гости, особые пожелания.</p>
            </div>
            <div class="step-card">
              <span class="step-num">2</span>
              <h3 class="step-title">Подтверждение</h3>
              <p class="step-text">Проверим доступность номера и&nbsp;услуг на&nbsp;выбранные даты, согласуем итоговую стоимость и&nbsp;время заезда.</p>
            </div>
            <div class="step-card">
              <span class="step-num">3</span>
              <h3 class="step-title">Бронь и&nbsp;трансфер</h3>
              <p class="step-text">Отправим подтверждение брони на&nbsp;email или в&nbsp;мессенджер, при необходимости организуем встречу в&nbsp;аэропорту.</p>
            </div>
          </div>

          <div class="text-center mb-10">
            <p class="text-body text-sand-700 mb-5 max-w-130 mx-auto">
              Нужно срочно связаться с&nbsp;нами или передать что-то важное до&nbsp;звонка?
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

useHead({
  title: 'Заявка отправлена — Радде',
  meta: [
    { name: 'robots', content: 'noindex, follow' },
  ],
})

// На странице успеха показываем имя из последней отправленной заявки.
// Сохраняется в /booking submit() в localStorage 'radde_booking_last'.
const lastBooking = ref<{ firstName?: string; phone?: string } | null>(null)

onMounted(() => {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem('radde_booking_last')
    if (raw) lastBooking.value = JSON.parse(raw)
  } catch {
    // ignore
  }
})

const greeting = computed(() => lastBooking.value?.firstName ? `, ${lastBooking.value.firstName}` : '')
const contactLine = computed(() => lastBooking.value?.phone ? `по номеру ${lastBooking.value.phone}` : 'с вами')
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
</style>
