/**
 * Единый источник правды для всех контактных данных пансионата.
 * Используется в шапке, футере, форме бронирования, странице /contacts.
 * Изменишь телефон/мессенджер здесь — поменяется на всём сайте.
 */
export interface SiteContacts {
  phone: { display: string; tel: string }
  email: string
  address: { short: string; full: string; mapUrl: string }
  schedule: string
  whatsapp: string
  telegram: string
  max: string
  instagram: string
}

const CONTACTS: SiteContacts = {
  phone: {
    display: '+7 (900) 123-45-67',
    tel: '+79001234567',
  },
  email: 'info@radde.ru',
  address: {
    short: 'Республика Дагестан, Гунибский район',
    full: 'Республика Дагестан, Гунибский район, с. Гуниб, пансионат Радде',
    mapUrl: 'https://yandex.ru/maps/-/CPfFnT2P',
  },
  schedule: 'Ежедневно с 9:00 до 21:00',
  whatsapp: 'https://wa.me/79001234567',
  telegram: 'https://t.me/radde_pansion',
  max: 'https://max.ru/radde_pansion',
  instagram: 'https://www.instagram.com/radde.pansion',
}

export function useContacts(): SiteContacts {
  return CONTACTS
}
