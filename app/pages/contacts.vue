<template>
  <div>
    <UiAppHeader @book="showBooking = true" />

    <!-- Hero strip с адресом -->
    <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-40 pb-12 md:pb-16">
      <img
        :src="`${base}images/hero/hero-3.jpg`"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-sand-900/82"></div>

      <div class="container relative z-10">
        <div class="max-w-180">
          <span class="text-label text-amber-400 mb-4 block">Контакты</span>
          <h1 class="text-h1 text-white mb-5">
            Свяжитесь <span class="section-title-accent text-sand-300">с пансионатом</span>
          </h1>
          <p class="text-body-lg text-white/75 max-w-130 mb-7">
            Поможем выбрать номер, расскажем о трансфере и ответим на любые вопросы. Звоните, пишите в мессенджеры или заполните форму — на связи каждый день.
          </p>

          <!-- Адрес + ссылка на Яндекс.Карты -->
          <a :href="contacts.address.mapUrl" target="_blank" rel="noopener" class="hero-address-row group">
            <div class="hero-address-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/>
                <circle cx="12" cy="10" r="2.5"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-label text-amber-300 block mb-1">Адрес</span>
              <span class="font-display font-500 text-white block leading-snug" style="font-size: clamp(1rem, 1.6vw, 1.2rem)">{{ contacts.address.full }}</span>
            </div>
            <span class="hero-address-cta">
              Открыть в Яндекс Картах
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </a>
        </div>
      </div>
    </section>

    <!-- Контактные карточки: мессенджеры на всю ширину, ниже телефон+email+карта -->
    <section class="section-padding bg-sand-50">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Мессенджеры — на всю ширину строки -->
          <div class="contact-card !block md:col-span-3">
            <div class="flex items-start gap-4 mb-5">
              <div class="contact-card-icon bg-olive-100 text-olive-700">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8a8.5 8.5 0 0 1-7.6 4.7a8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8a8.5 8.5 0 0 1 4.7-7.6a8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>
                </svg>
              </div>
              <div class="flex-1">
                <span class="text-label text-sand-500 block mb-2">Мессенджеры</span>
                <span class="font-display font-500 text-sand-900 block leading-tight" style="font-size: clamp(1.2rem, 2.2vw, 1.6rem)">Напишите нам в удобном</span>
                <span class="text-small text-sand-700 block mt-1">Отвечаем быстрее, чем по почте — обычно в течение 15 минут</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <a :href="contacts.whatsapp" target="_blank" rel="noopener" class="messenger-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <a :href="contacts.telegram" target="_blank" rel="noopener" class="messenger-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram
              </a>
              <a :href="contacts.max" target="_blank" rel="noopener" class="messenger-pill">
                <img :src="`${base}images/icon-max.svg`" width="16" height="16" alt="Max" style="filter: brightness(0) saturate(100%); opacity: 0.7;" />
                Max
              </a>
              <a :href="contacts.instagram" target="_blank" rel="noopener" class="messenger-pill">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z"/></svg>
                Instagram*
              </a>
            </div>
            <span class="text-small text-sand-700 block mt-3">*Meta признана экстремистской организацией и запрещена на территории России</span>
          </div>

          <!-- Телефон -->
          <a :href="`tel:${contacts.phone.tel}`" class="contact-card">
            <div class="contact-card-icon bg-amber-500/10 text-amber-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5-2.5l5 2v4a2 2 0 0 1-2 2a16 16 0 0 1-15-15a2 2 0 0 1 2-2"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-label text-sand-500 block mb-2">Телефон</span>
              <span class="font-display font-500 text-sand-900 block leading-tight" style="font-size: clamp(1.2rem, 2vw, 1.55rem)">{{ contacts.phone.display }}</span>
              <span class="text-small text-sand-700 block mt-2">{{ contacts.schedule }}</span>
            </div>
          </a>

          <!-- Email -->
          <a :href="`mailto:${contacts.email}`" class="contact-card">
            <div class="contact-card-icon bg-olive-100 text-olive-700">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M3 7l9 6l9-6"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-label text-sand-500 block mb-2">Email</span>
              <span class="font-display font-500 text-sand-900 block leading-tight break-words" style="font-size: clamp(1.05rem, 1.6vw, 1.3rem)">{{ contacts.email }}</span>
              <span class="text-small text-sand-700 block mt-2">Ответим в течение дня</span>
            </div>
          </a>

          <!-- Превью карты -->
          <a :href="contacts.address.mapUrl" target="_blank" rel="noopener" class="map-preview-card group">
            <img :src="`${base}images/usp/landmarks/1.jpg`" alt="Расположение пансионата Радде" class="map-preview-img" />
            <div class="map-preview-overlay"></div>
            <div class="map-preview-content">
              <div class="map-preview-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/>
                  <circle cx="12" cy="10" r="2.5"/>
                </svg>
              </div>
              <div>
                <span class="font-display font-500 text-white block leading-tight" style="font-size: clamp(1rem, 1.5vw, 1.15rem)">Открыть в Яндекс Картах</span>
                <span class="text-small text-white/75 block mt-1">Гунибский район Дагестана</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <UiEthnicDivider variant="medium" />

    <!-- Полный блок «Как добраться» (тот же, что и на главной) -->
    <SectionsLocation />

    <UiEthnicDivider variant="light" />

    <!-- Форма + футер -->
    <SectionsContactFooter />

    <UiBookingModal v-model="showBooking" />
  </div>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
const contacts = useContacts()
const showBooking = ref(false)

useHead({
  title: 'Контакты — Пансионат Радде',
  meta: [
    { name: 'description', content: 'Свяжитесь с пансионатом Радде: телефон, email, мессенджеры, адрес. Гунибский район Дагестана.' },
  ],
})
</script>

<style scoped>
.contact-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 16px;
  padding: 24px;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.contact-card:hover {
  border-color: #E8D5B7;
  box-shadow: 0 8px 24px rgba(44, 36, 22, 0.06);
}

.contact-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.messenger-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #6B5B4A;
  background: #FAF6F0;
  border: 1px solid #F0E6D6;
  padding: 8px 14px;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.2s;
}
.messenger-pill:hover {
  color: #2C2416;
  background: white;
  border-color: #E8D5B7;
}
.messenger-pill svg {
  color: #C17F3E;
}

/* Адрес в hero */
.hero-address-row {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  border-radius: 14px;
  padding: 14px 18px;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
  flex-wrap: wrap;
}
.hero-address-row:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}
.hero-address-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(193, 127, 62, 0.18);
  color: #E8B57A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.hero-address-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #E8B57A;
  white-space: nowrap;
  margin-left: auto;
}
.hero-address-row:hover .hero-address-cta {
  color: #FFD9A8;
}
@media (max-width: 640px) {
  .hero-address-cta {
    margin-left: 0;
    width: 100%;
    margin-top: 4px;
  }
}

/* Превью карты */
.map-preview-card {
  position: relative;
  display: block;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  min-height: 200px;
  border: 1px solid #F0E6D6;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.map-preview-card:hover {
  border-color: #E8D5B7;
  box-shadow: 0 8px 24px rgba(44, 36, 22, 0.1);
}
.map-preview-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.map-preview-card:hover .map-preview-img {
  transform: scale(1.04);
}
.map-preview-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(44, 36, 22, 0.2) 0%, rgba(44, 36, 22, 0.85) 100%);
}
.map-preview-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.map-preview-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: #E8B57A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .map-preview-card {
    min-height: 180px;
  }
}
</style>
