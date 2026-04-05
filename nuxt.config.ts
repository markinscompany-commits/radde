export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: 'github-pages',
  },

  modules: ['@unocss/nuxt'],

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Радде — Пансионат в горах Дагестана',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Пансионат Радде — отдых в горах Дагестана на высоте 1600м в реликтовом лесу. Бронирование номеров, питание, экскурсии.' },
        { property: 'og:title', content: 'Радде — Пансионат в горах Дагестана' },
        { property: 'og:description', content: 'Отдых в горах на высоте 1600м в реликтовом лесу Гуниба' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500&family=Manrope:wght@300;400;500;600;700;800&family=Source+Sans+3:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },

  css: ['@/assets/css/global.css'],
})
