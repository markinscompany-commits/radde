/**
 * Дополнительные услуги, которые можно добавить к брони.
 * Маппятся на Bnovo `extras[]` при отправке (id → bnovoServiceId).
 *
 * Берём только платные/опциональные услуги. То, что включено в проживание
 * (Wi-Fi, парковка, отопление, постельное бельё, завтрак, горный воздух)
 * не показываем — оно и так в стоимости.
 *
 * priceValue — в рублях за единицу `unit`. unit определяет, как
 * умножать цену в саммари: 'guest' (× кол-во взрослых), 'night' (× кол-во ночей),
 * 'session' (× count, по умолчанию 1).
 */
export type ExtraUnit = 'guest' | 'night' | 'session'

export interface ExtraDef {
  id: string
  category: 'food' | 'active' | 'wellness' | 'service'
  title: string
  description: string
  price: string         // отображаемая цена «от X ₽»
  priceValue: number    // числовое значение, рубли
  unit: ExtraUnit
  unitLabel: string     // человекочитаемое: «за человека», «за сутки», «за услугу»
  icon: string          // SVG-разметка
  bnovoServiceId?: number | null
}

const i = 'width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"'

export function useBookingExtras(): ExtraDef[] {
  return [
    // === ПИТАНИЕ ===
    {
      id: 'lunch',
      category: 'food',
      title: 'Обед',
      description: 'Полноценный обед из трёх блюд — суп, горячее, салат, домашний хлеб.',
      price: '600 ₽',
      priceValue: 600,
      unit: 'guest',
      unitLabel: 'за человека / сутки',
      icon: `<svg ${i}><path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12m0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" /></svg>`,
      bnovoServiceId: null,
    },
    {
      id: 'dinner',
      category: 'food',
      title: 'Ужин',
      description: 'Дагестанская кухня: хинкал, чуду, курзе, свежий хлеб из тандыра, травяной чай.',
      price: '700 ₽',
      priceValue: 700,
      unit: 'guest',
      unitLabel: 'за человека / сутки',
      icon: `<svg ${i}><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008" /><path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" /><path d="M19 11h2m-1 -1v2" /></svg>`,
      bnovoServiceId: null,
    },

    // === АКТИВНЫЙ ОТДЫХ ===
    {
      id: 'excursion',
      category: 'active',
      title: 'Экскурсия с гидом',
      description: 'Гунибская крепость, водопад Тобот, Гамсутль или Сулакский каньон — на выбор.',
      price: '2 000 ₽',
      priceValue: 2000,
      unit: 'session',
      unitLabel: 'за услугу',
      icon: `<svg ${i}><path d="M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612" /><path d="M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2" /></svg>`,
      bnovoServiceId: null,
    },
    {
      id: 'horse',
      category: 'active',
      title: 'Конная прогулка',
      description: 'Прогулка верхом по реликтовому лесу 1,5–2 часа на спокойных лошадях с инструктором.',
      price: '1 500 ₽',
      priceValue: 1500,
      unit: 'guest',
      unitLabel: 'за человека',
      icon: `<svg ${i}><path d="M7 10l-.85 8.507a1.357 1.357 0 0 0 1.35 1.493h.146a2 2 0 0 0 1.857 -1.257l.994 -2.486a2 2 0 0 1 1.857 -1.257h1.292a2 2 0 0 1 1.857 1.257l.994 2.486a2 2 0 0 0 1.857 1.257h.146a1.37 1.37 0 0 0 1.364 -1.494l-.864 -9.506h-8c0 -3 -3 -5 -6 -5l-3 6l2 2l3 -2" /></svg>`,
      bnovoServiceId: null,
    },
    {
      id: 'fishing',
      category: 'active',
      title: 'Рыбалка',
      description: 'Горная форель в чистейших реках Гунибского района. Удочки и снасти предоставляем.',
      price: '800 ₽',
      priceValue: 800,
      unit: 'session',
      unitLabel: 'за услугу',
      icon: `<svg ${i}><path d="M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56c0 1.747 .64 3.345 1.699 4.571" /><path d="M2 9.504c7.715 8.647 14.75 10.265 20 2.498c-5.25 -7.761 -12.285 -6.142 -20 2.504" /><path d="M18 11v.01" /><path d="M11.5 10.5c-.667 1 -.667 2 0 3" /></svg>`,
      bnovoServiceId: null,
    },

    // === ОЗДОРОВЛЕНИЕ ===
    {
      id: 'sauna',
      category: 'wellness',
      title: 'Сауна и русская баня',
      description: 'Парная, веники, простыни, тапочки, травяной чай. Сеанс 2 часа, до 6 человек.',
      price: '2 000 ₽',
      priceValue: 2000,
      unit: 'session',
      unitLabel: 'за сеанс',
      icon: `<svg ${i}><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1" /><path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25" /><path d="M4 21l1 -1.5" /><path d="M20 21l-1 -1.5" /></svg>`,
      bnovoServiceId: null,
    },

    // === СЕРВИС ===
    {
      id: 'transfer',
      category: 'service',
      title: 'Трансфер из Махачкалы',
      description: 'Аэропорт или ж/д вокзал Махачкалы — пансионат. Комфортный автомобиль, до 4 пассажиров.',
      price: '5 000 ₽',
      priceValue: 5000,
      unit: 'session',
      unitLabel: 'в одну сторону',
      icon: `<svg ${i}><path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" /></svg>`,
      bnovoServiceId: null,
    },
    {
      id: 'bbq',
      category: 'service',
      title: 'Барбекю-зона',
      description: 'Оборудованная площадка с мангалом, шампурами, дровами. Мясо привозите своё или закажите у нас.',
      price: '1 000 ₽',
      priceValue: 1000,
      unit: 'session',
      unitLabel: 'за услугу',
      icon: `<svg ${i}><path d="M19 8h-14a6 6 0 0 0 6 6h2a6 6 0 0 0 6 -5.775l0 -.225" /><path d="M17 20a2 2 0 1 1 0 -4a2 2 0 0 1 0 4" /><path d="M15 14l1 2" /><path d="M9 14l-3 6" /><path d="M15 18h-8" /><path d="M15 5v-1" /><path d="M12 5v-1" /><path d="M9 5v-1" /></svg>`,
      bnovoServiceId: null,
    },
    {
      id: 'campfire',
      category: 'service',
      title: 'Вечерний костёр',
      description: 'Костёр на специальной площадке в лесу. Чай, тёплые пледы, треск дров и горы под звёздами.',
      price: '500 ₽',
      priceValue: 500,
      unit: 'session',
      unitLabel: 'за услугу',
      icon: `<svg ${i}><path d="M4 21l16 -4" /><path d="M20 21l-16 -4" /><path d="M12 15a4 4 0 0 0 4 -4c0 -3 -2 -3 -2 -8c-4 2 -6 5 -6 8a4 4 0 0 0 4 4" /></svg>`,
      bnovoServiceId: null,
    },
  ]
}

export function getExtra(id: string): ExtraDef | undefined {
  return useBookingExtras().find(e => e.id === id)
}
