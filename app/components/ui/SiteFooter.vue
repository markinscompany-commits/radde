<template>
  <footer class="bg-sand-900 border-t border-white/5">
    <div class="container py-10">
      <!-- Top row: logo + description -->
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
        <div class="flex items-center gap-4">
          <img :src="`${base}images/logo-white.png`" alt="Радде" class="h-12 w-auto flex-shrink-0" style="filter: brightness(1.2);" />
          <p class="footer-desc">
            <span class="md:hidden">Отдых в горах Дагестана,<br>на высоте 1700 метров</span>
            <span class="hidden md:inline">Отдых в горах Дагестана на высоте 1700 метров<br>в реликтовом лесу Гунибского района</span>
          </p>
        </div>
        <nav class="flex flex-wrap items-start lg:justify-end gap-x-6 gap-y-2 lg:max-w-100">
          <a :href="base" class="footer-link">Главная</a>
          <a :href="`${base}#rooms`" class="footer-link">Номера</a>
          <a :href="`${base}#services`" class="footer-link">Услуги</a>
          <a :href="`${base}#about`" class="footer-link">Локация</a>
          <a :href="`${base}#location`" class="footer-link">Как добраться</a>
          <a :href="`${base}#gallery`" class="footer-link">Галерея</a>
          <a :href="`${base}#blog`" class="footer-link">Блог</a>
          <a :href="`${base}contacts`" class="footer-link">Контакты</a>
        </nav>
      </div>

      <!-- Divider -->
      <div class="h-px bg-white/6 mb-6"></div>

      <!-- Bottom row: copyright | meta disclaimer | markins -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div class="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span class="footer-meta">&copy; {{ new Date().getFullYear() }} Пансионат Радде</span>
          <a :href="`${base}privacy`" class="footer-meta footer-meta--link">Политика конфиденциальности</a>
        </div>
        <span class="footer-meta">*Meta признана экстремистской организацией и запрещена на территории России</span>
        <a href="https://markins.ru?utm_source=radde.ru&utm_medium=footer&utm_campaign=credits" target="_blank" rel="noopener" class="flex items-center gap-1.5 footer-meta footer-meta--link">
          <span>Разработано</span>
          <img :src="`${base}images/markins-text-white.svg`" alt="markins" class="h-2.5 w-auto" style="filter: brightness(0) invert(0.65);" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
</script>

<style scoped>
.footer-link {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover {
  color: white;
}

/* Footer description (под лого) — намеренно мельче 16px по требованию заказчика */
.footer-desc {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.55);
  max-width: 22rem;
}

/* Footer bottom row meta (copyright, политика, Meta-disclaimer, Разработано) — намеренно мельче 16px */
.footer-meta {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  transition: color 0.2s;
}
.footer-meta--link:hover {
  color: rgba(255, 255, 255, 0.75);
}
</style>
