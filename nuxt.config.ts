export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: 'github-pages',
  },

  modules: ['@unocss/nuxt'],

  app: {
    baseURL: '/radde/',
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
        { rel: 'icon', type: 'image/svg+xml', href: '/radde/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/radde/favicon.png' },
        { rel: 'apple-touch-icon', href: '/radde/favicon.png' },
        // Шрифты — self-hosted через @fontsource (нельзя CDN: 152-ФЗ запрещает
        // передачу IP пользователей на серверы Google в США). Импорты в global.css.
      ],
    },
  },

  css: ['@/assets/css/global.css'],
})
