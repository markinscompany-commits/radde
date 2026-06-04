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
  egrksm: string           // номер реестровой записи в реестре классификации (ЕРОК)
  classification: string   // тип/категория средства размещения
  registryUrl: string      // ссылка на запись в реестре tourism.fsa.gov.ru
  vypiskaUrl: string       // ссылка на PDF-выписку из реестра (лежит в public/docs)
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
    display: '+7 (988) 277-77-55',
    tel: '+79882777755',
  },
  email: 'info@radde.ru',
  address: {
    short: 'Республика Дагестан, Гунибский район',
    full: 'Республика Дагестан, Гунибский район, с. Гуниб, пансионат Радде',
    mapUrl: 'https://yandex.ru/maps/-/CPfFnT2P',
  },
  schedule: 'Работаем круглосуточно',
  whatsapp: 'https://wa.me/79882777755',
  telegram: 'https://t.me/radde_pansion',
  max: 'https://max.ru/radde_pansion',
  instagram: 'https://www.instagram.com/pansionat_radde/',
  // Реквизиты из выписки ЕРОК (Росаккредитация) + реквизитов ИП, 2026.
  legal: {
    entityName: 'ИП Нахибашева Индира Нурмагомедовна',
    inn: '056296889839',
    ogrn: '316057100110150',
    address: '368340, Республика Дагестан, Гунибский район, с. Гуниб',
    egrksm: 'С052026022444',
    classification: 'Гостиница, без категории',
    registryUrl: 'https://tourism.fsa.gov.ru/ru/resorts/hotels/019cdc36-cb7f-7894-b94e-7a4928d8e994/about-resort',
    vypiskaUrl: 'docs/vypiska-reestr-radde.pdf', // префикс base добавляется в шаблоне
  },
}

export function useContacts(): SiteContacts {
  return CONTACTS
}
