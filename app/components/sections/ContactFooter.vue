<template>
  <div>
    <!-- Contact section -->
    <section id="contacts" class="relative py-24 md:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-sand-900" :style="{ backgroundImage: `url(${base}images/hero/hero-3.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }">
        <div class="absolute inset-0 bg-sand-900/85"></div>
      </div>

      <div class="container relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <!-- Left: contact info -->
          <div ref="infoRef">
            <span class="text-label text-amber-400 mb-4 block">Контакты</span>
            <h2 class="text-h2 font-500 text-white mb-6">
              Связаться<br>
              <span class="font-accent italic font-500 text-sand-400 text-[1.3em]">с нами</span>
            </h2>
            <p class="text-body text-white/50 mb-8 max-w-90">
              Мы рады ответить на любые вопросы и помочь с выбором номера, маршрутом и организацией отдыха.
            </p>

            <a href="tel:+78001234567" class="block mb-4">
              <span class="text-small text-white/40 block mb-1">Телефон</span>
              <span class="font-display font-500 text-white leading-none" style="font-size: clamp(1.8rem, 4vw, 3rem)">
                +7 (800) 123-45-67
              </span>
            </a>

            <a href="mailto:info@radde.ru" class="block mb-4">
              <span class="text-small text-white/40 block mb-1">Email</span>
              <span class="font-body text-4 text-white/80">info@radde.ru</span>
            </a>

            <div class="mb-8">
              <span class="text-small text-white/40 block mb-1">Адрес</span>
              <a href="https://yandex.ru/maps/-/CPfFnT2P" target="_blank" rel="noopener" class="font-body text-3.5 text-white/60 hover:text-white transition-colors">Республика Дагестан, Гунибский район</a>
            </div>

            <div class="flex gap-4">
              <a href="#" class="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300" title="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="#" class="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300" title="Telegram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="#" class="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300" title="Max">
                <img :src="`${base}images/icon-max.svg`" width="20" height="20" alt="Max" style="filter: brightness(0) invert(1);" />
              </a>
              <a href="#" class="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300" title="Instagram*">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z"/></svg>
              </a>
            </div>
          </div>

          <!-- Right: contact form -->
          <div ref="formRef">
            <form @submit.prevent class="bg-sand-900/60 border border-white/10 rounded-3 p-6 md:p-8">
              <h3 class="font-display font-500 text-6 text-white mb-6">Оставить заявку</h3>
              <div class="space-y-4 mb-6">
                <div>
                  <label class="label-dark">Имя</label>
                  <input type="text" placeholder="Как к вам обращаться" class="input-dark" />
                </div>
                <div>
                  <label class="label-dark">Телефон</label>
                  <input type="tel" placeholder="+7 (900) 000-00-00" class="input-dark" @input="handlePhone" @keydown="phoneMaskKeydown" />
                </div>
                <div>
                  <label class="label-dark">Комментарий <span style="opacity:0.5">(необязательно)</span></label>
                  <textarea placeholder="Пожелания, вопросы..." rows="3" class="input-dark" style="height:auto;min-height:80px;padding:10px 14px;resize:vertical;line-height:1.5"></textarea>
                </div>
              </div>
              <button type="submit" class="btn-primary w-full text-center py-4">Отправить заявку</button>
              <p class="text-3 text-white/30 mt-4 text-center">
                Нажимая кнопку, вы соглашаетесь с <a href="/privacy" class="text-white/50 underline underline-offset-2 hover:text-white/70 transition-colors">политикой конфиденциальности</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-sand-900 border-t border-white/5">
      <div class="container py-10">
        <!-- Top row: logo + description -->
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          <div class="flex items-center gap-4">
            <img :src="`${base}images/logo-white.png`" alt="Радде" class="h-12 w-auto flex-shrink-0" style="filter: brightness(1.2);" />
            <p class="text-small text-sand-500 leading-relaxed max-w-85">
              Отдых в горах Дагестана на высоте 1600 метров<br>в реликтовом лесу Гунибского района
            </p>
          </div>
          <nav class="flex flex-wrap items-start justify-end gap-x-6 gap-y-2 md:max-w-100">
            <a href="/" class="footer-link">Главная</a>
            <a href="#rooms" class="footer-link">Номера</a>
            <a href="#services" class="footer-link">Услуги</a>
            <a href="#about" class="footer-link">Локация</a>
            <a href="#location" class="footer-link">Как добраться</a>
            <a href="#gallery" class="footer-link">Галерея</a>
            <a href="#activities" class="footer-link">Чем заняться</a>
            <a href="/contacts" class="footer-link">Контакты</a>
            <a href="/blog" class="footer-link">Блог</a>
          </nav>
        </div>

        <!-- Divider -->
        <div class="h-px bg-white/6 mb-6"></div>

        <!-- Bottom row: copyright | meta disclaimer | markins -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div class="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span class="text-caption text-sand-600">&copy; {{ new Date().getFullYear() }} Пансионат Радде</span>
            <a href="/privacy" class="text-caption text-sand-600 hover:text-sand-400 transition-colors">Политика конфиденциальности</a>
          </div>
          <span class="text-caption text-sand-600">*Meta признана экстремистской организацией и запрещена на территории России</span>
          <a href="https://markins.ru?utm_source=radde.ru&utm_medium=footer&utm_campaign=credits" target="_blank" class="flex items-center gap-1.5 text-sand-600 hover:text-sand-400 transition-colors">
            <span class="text-3">Разработано</span>
            <img :src="`${base}images/markins-text-white.svg`" alt="markins" class="h-2.5 w-auto" style="filter: brightness(0) invert(0.55);" />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'

const { onInput: phoneMaskOnInput, onKeydown: phoneMaskKeydown } = usePhoneMask()
const infoRef = ref<HTMLElement>()
const formRef = ref<HTMLElement>()

function handlePhone(e: Event) {
  phoneMaskOnInput(e)
}

</script>

<style scoped>
.footer-link {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover {
  color: rgba(255, 255, 255, 0.75);
}
</style>
