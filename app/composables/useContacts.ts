/**
 * Единый источник правды для всех контактных данных пансионата.
 * Используется в шапке, футере, форме бронирования, странице /contacts.
 * Изменишь телефон/мессенджер здесь — поменяется на всём сайте.
 */
/**
 * Юридические реквизиты — обязательны на сайте по ст. 9, 10 Закона
 * № 2300-1 «О защите прав потребителей» и Постановлению № 1912 (с 01.03.2026).
 * Заполнить, когда клиент пришлёт регистрационные документы.
 *
 * egrksm — номер реестровой записи в ЕГРКСМ (Единый госреестр
 * классифицированных средств размещения), обязателен с 01.03.2026.
 */
export interface SiteLegal {
  entityName: string       // полное наименование ООО/ИП
  inn: string              // ИНН
  ogrn: string             // ОГРН/ОГРНИП
  address: string          // юридический адрес
  egrksm: string           // номер реестровой записи ЕГРКСМ
  classification: string   // тип/категория (например, «Пансионат, без категории»)
}

export interface SiteContacts {
  phone: { display: string; tel: string }
  email: string
  address: { short: string; full: string; mapUrl: string }
  schedule: string
  whatsapp: string
  telegram: string
  max: string
  instagram: string
  legal: SiteLegal
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
  // PLACEHOLDER — заменить, когда клиент пришлёт регистрационные данные
  // и пройдёт самооценку в ЕГРКСМ (Постановление № 1951 от 27.12.2024).
  legal: {
    entityName: 'ИП «Пансионат Радде»',
    inn: '0000000000',
    ogrn: '000000000000000',
    address: 'Республика Дагестан, Гунибский район, с. Гуниб',
    egrksm: 'будет указан после регистрации в реестре',
    classification: 'Пансионат',
  },
}

export function useContacts(): SiteContacts {
  return CONTACTS
}
