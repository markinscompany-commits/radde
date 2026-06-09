// Прод-деплой: Beget VPS (Node.js + PM2 + Nginx). Сервер работает
// как Node-приложение (Nitro preset node-server), domain root = '/'.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: 'node-server',
    // Сжатие статики (gzip + brotli) на этапе сборки. Без этого JS-бандлы
    // уходили на телефон несжатыми (~530 КБ вместо ~170 КБ): Nginx сжимает
    // text/css и text/html, но тип text/javascript не входит в его gzip_types.
    // Nitro сам отдаёт готовые .br/.gz файлы — Nginx менять не нужно.
    compressPublicAssets: { gzip: true, brotli: true },
  },

  modules: ['@unocss/nuxt'],

  runtimeConfig: {
    databaseUrl: '',
    telegramBotToken: '',
    telegramChatId: '',
    // Bnovo PMS — write через серый-канал reservationsteps.ru, read через парсинг
    // публичной формы. Маппинг слаг→room_type_id зашит в server/utils/bnovo-mapping.ts.
    bnovoAccountId: '',
    bnovoApiKey: '',
    bnovoLcode: '',          // UID объекта в URL модуля бронирования
    bnovoPlanId: '91433',    // ID тарифа в Bnovo (по умолчанию «Стандартный с завтраком»)
    bnovoWarrantyType: 'onlinepay', // 'onlinepay' (HAR-дефолт) или другое — зависит от тарифа в Bnovo
    adminProbeToken: '',     // /api/admin/bnovo-probe — токен для диагностических POST
    public: {
      // ID счётчика Яндекс.Метрики (номер публичный). Можно переопределить через
      // NUXT_PUBLIC_METRIKA_ID. Пусто — Метрика не грузится (см.
      // plugins/metrika.client.ts). Счётчик подключается ТОЛЬКО после согласия
      // на аналитические cookie (152-ФЗ).
      metrikaId: '109657499',
    },
  },

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Радде — Пансионат в горах Дагестана',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // Возрастная категория сайта (436-ФЗ, добровольно)
        { name: 'rating', content: 'general' },
        { name: 'theme-color', content: '#2C2416' },
        // Дефолтные SEO-меты — каждая страница перетирает через useSiteMeta()
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png' },
        // Preload hero-фото: SPA начинает качать картинку только после
        // загрузки и выполнения JS-бандла — на мобильном это +5-10 сек к LCP.
        // Preload запускает скачивание параллельно с JS. srcset/media в точности
        // повторяют <picture> в Hero.vue, чтобы браузер выбрал тот же файл (кэш-хит).
        {
          rel: 'preload', as: 'image', type: 'image/webp',
          imagesrcset: '/images/hero/hero-radde-mobile-480w.webp 480w, /images/hero/hero-radde-mobile-768w.webp 768w, /images/hero/hero-radde-mobile-1024w.webp 1024w',
          imagesizes: '100vw',
          media: '(max-width: 767px)',
        },
        {
          rel: 'preload', as: 'image', type: 'image/webp',
          imagesrcset: '/images/hero/hero-radde-desktop-1280w.webp 1280w, /images/hero/hero-radde-desktop-1600w.webp 1600w, /images/hero/hero-radde-desktop-1920w.webp 1920w',
          imagesizes: '100vw',
          media: '(min-width: 768px)',
        },
        // Шрифты — self-hosted через @fontsource (нельзя CDN: 152-ФЗ запрещает
        // передачу IP пользователей на серверы Google в США). Импорты в global.css.
      ],
    },
  },

  css: ['@/assets/css/global.css'],
})
