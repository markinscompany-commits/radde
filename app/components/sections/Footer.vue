<template>
  <footer class="bg-sand-900 py-16 md:py-20">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
        <!-- Logo & about -->
        <div>
          <div class="mb-5">
            <img :src="`${base}images/logo-white.png`" alt="Радде — Пансионат" class="h-14 w-auto" style="filter: brightness(1.2);" />
          </div>
          <p class="text-small text-sand-500 leading-relaxed max-w-60">
            Отдых в горах Дагестана на высоте 1600 метров в реликтовом лесу Гунибского района.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h4 class="text-label text-sand-500 mb-5">Навигация</h4>
          <nav class="flex flex-col gap-3">
            <a href="#" class="text-small text-sand-400 hover:text-sand-200 transition-colors">Главная</a>
            <a href="#rooms" class="text-small text-sand-400 hover:text-sand-200 transition-colors">Номера</a>
            <a href="#about" class="text-small text-sand-400 hover:text-sand-200 transition-colors">О пансионате</a>
            <a href="#contacts" class="text-small text-sand-400 hover:text-sand-200 transition-colors">Контакты</a>
            <a href="/blog" class="text-small text-sand-400 hover:text-sand-200 transition-colors">Блог</a>
          </nav>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-label text-sand-500 mb-5">Контакты</h4>
          <div class="space-y-3">
            <a href="tel:+79001234567" class="text-small text-sand-300 hover:text-white transition-colors block font-500">
              +7 (900) 123-45-67
            </a>
            <a href="mailto:info@radde.ru" class="text-small text-sand-400 hover:text-sand-200 transition-colors block">
              info@radde.ru
            </a>
            <p class="text-small text-sand-500">
              Республика Дагестан,<br>Гунибский район
            </p>
          </div>

          <!-- Social -->
          <div class="flex gap-3 mt-5">
            <a href="#" class="w-9 h-9 rounded-full bg-sand-800 flex items-center justify-center text-sand-400 hover:text-white hover:bg-sand-700 transition-colors" title="WhatsApp">
              <span class="text-3.5">W</span>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-sand-800 flex items-center justify-center text-sand-400 hover:text-white hover:bg-sand-700 transition-colors" title="Telegram">
              <span class="text-3.5">T</span>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-sand-800 flex items-center justify-center text-sand-400 hover:text-white hover:bg-sand-700 transition-colors" title="Max">
              <img :src="`${base}images/icon-max.svg`" width="14" height="14" alt="Max" style="filter: brightness(0) invert(0.6);" />
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-sand-800 flex items-center justify-center text-sand-400 hover:text-white hover:bg-sand-700 transition-colors" title="Instagram">
              <span class="text-3.5">I</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-sand-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-2.5 text-sand-600">
          &copy; {{ new Date().getFullYear() }} Пансионат Радде. Все права защищены.
        </p>
        <div class="flex items-center gap-6">
          <a href="/privacy" class="text-2.5 text-sand-600 hover:text-sand-400 transition-colors">
            Политика конфиденциальности
          </a>
          <a href="https://markins.ru" target="_blank" class="flex items-center gap-1.5 text-sand-600 hover:text-sand-400 transition-colors">
            <span class="text-2.5">Разработано</span>
            <img :src="`${base}images/markins-text-white.svg`" alt="markins" class="h-2.5 w-auto" style="filter: brightness(0) invert(0.7);" />
          </a>
        </div>
      </div>

      <p class="text-2 text-sand-700 mt-6 text-center">
        *Meta признана экстремистской организацией и запрещена на территории России
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
</script>
