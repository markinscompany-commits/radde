import { defineConfig, presetUno, presetWebFonts, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
  ],

  theme: {
    colors: {
      // Бежевая палитра Радде (из логотипа + правки Нурмагомеда)
      sand: {
        50: '#FDFBF7',
        100: '#FAF6F0',
        200: '#F0E6D6',
        300: '#E8D5B7',
        400: '#D4BC96',
        500: '#C1A376',
        600: '#A88B5E',
        700: '#8B6F47',
        800: '#6B5B4A',
        900: '#2C2416',
      },
      // Оливковый из логотипа
      olive: {
        50: '#F4F6EE',
        100: '#E8ECDC',
        200: '#D1D9B9',
        300: '#B3C08E',
        400: '#8FA363',
        500: '#6B8B3A',
        600: '#5B7A3A',
        700: '#4A6330',
        800: '#3D5029',
        900: '#2A3820',
      },
      // Акцентный янтарный (CTA)
      amber: {
        400: '#D4944A',
        500: '#C17F3E',
        600: '#A66B32',
        700: '#8B5728',
      },
    },

    fontFamily: {
      display: ['Manrope', 'system-ui', 'sans-serif'],
      accent: ['Cormorant Garamond', 'Georgia', 'serif'],
      body: ['Source Sans 3', 'system-ui', 'sans-serif'],
    },

    breakpoints: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },

  shortcuts: {
    // Layout
    'container': 'max-w-1100px mx-auto px-5 md:px-8',
    'section-padding': 'py-20 md:py-26',

    // Typography — иерархия размеров (минимум 16px по требованию заказчика)
    'text-display': 'font-display font-500 leading-tight',
    'text-h1': 'text-display text-8 md:text-12 lg:text-14',
    'text-h2': 'text-display text-6 md:text-8 lg:text-10',
    'text-h3': 'text-display text-4.5 md:text-5.5',
    'text-body': 'font-body text-4 leading-relaxed',           // 16px — основной текст
    'text-body-lg': 'font-body text-4.5 leading-relaxed',     // 18px — акцентный текст
    'text-small': 'font-body text-4 leading-normal',          // 16px — вторичный текст (бывший 14px)
    'text-caption': 'font-body text-4 leading-snug',          // 16px — копирайт/даты/мета (бывший 12px)
    'text-label': 'font-body text-3.5 font-600 tracking-widest uppercase', // 14px uppercase — секционные лейблы (исключение: uppercase + letter-spacing читается крупнее)

    // Buttons
    'btn': 'inline-flex items-center justify-center font-body font-600 rounded-2 transition-all duration-300 cursor-pointer border-none',
    'btn-primary': 'btn bg-amber-500 text-white px-7 py-3.5 text-3.5 hover:bg-amber-600 active:bg-amber-700',
    'btn-secondary': 'btn bg-transparent text-sand-900 px-7 py-3.5 text-3.5 border border-sand-400 hover:bg-sand-200 hover:border-sand-600',
    'btn-ghost': 'btn bg-transparent text-sand-700 px-4 py-2 text-3.5 hover:text-sand-900 hover:bg-sand-100',

    // Cards
    'card-base': 'bg-white rounded-3 border border-sand-200 shadow-sm overflow-hidden',
    'card-padding': 'p-5 md:p-6',

    // Section headings — единый паттерн лейбл + заголовок
    'section-label': 'text-label text-olive-600 mb-4 block',
    'section-title': 'text-h2 text-sand-900',
    'section-title-accent': 'font-accent italic font-500 text-sand-500 text-[1.3em]',
  },

  rules: [
    // Кастомные утилиты для анимаций (GSAP добавит классы)
    ['will-transform', { 'will-change': 'transform' }],
    ['gpu', { transform: 'translateZ(0)' }],
  ],
})
