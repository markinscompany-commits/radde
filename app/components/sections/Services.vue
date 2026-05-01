<template>
  <section id="services" class="py-20 md:py-26 bg-sand-50 relative overflow-hidden">
    <!-- Subtle texture -->
    <div class="absolute inset-0 opacity-3 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%236B5B4A&quot; fill-opacity=&quot;0.4&quot;%3E%3Ccircle cx=&quot;1&quot; cy=&quot;1&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

    <div class="container relative z-1">
      <!-- Header -->
      <div class="text-center mb-14">
        <span class="text-label text-olive-600 mb-4 block">Услуги</span>
        <h2 ref="titleRef" class="text-h2 font-500 text-sand-900">
          Всё для вашего <span class="section-title-accent">комфорта</span>
        </h2>
      </div>

      <!-- Tabs -->
      <div ref="tabsRef" class="mb-10">
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="(cat, i) in categories"
            :key="cat.id"
            @click="activeTab = cat.id"
            class="tab-btn"
            :class="[
              activeTab === cat.id ? 'tab-btn--active' : '',
              cat.id === 'included' ? 'tab-btn--included' : '',
              cat.id === 'all' ? 'tab-btn--all' : '',
            ]"
          >
            <span class="tab-icon" v-html="cat.icon"></span>
            <span>{{ cat.label }}</span>
          </button>
        </div>
      </div>

      <!-- Cards grid -->
      <div ref="gridRef" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Transition name="grid-fade" mode="out-in">
          <div :key="activeTab + '-' + expanded" class="contents">
          <div
            v-for="(service, si) in visibleServices"
            :key="service.id"
            class="service-card"
            :style="{ animationDelay: si * 0.06 + 's' }"
          >
            <!-- Top: icon + badge -->
            <div class="flex items-start justify-between mb-4">
              <div class="service-icon-wrap" v-html="service.icon"></div>
              <span v-if="service.included" class="badge badge--included">Включено</span>
              <span v-else-if="service.price" class="badge badge--price">{{ service.price }}</span>
            </div>

            <!-- Content -->
            <h3 class="font-display font-500 text-sand-900 mb-2" style="font-size: clamp(1.15rem, 2vw, 1.35rem)">{{ service.title }}</h3>
            <p class="font-body text-4 text-sand-700 leading-relaxed mb-4 service-desc">{{ service.description }}</p>

            <!-- Meta row -->
            <div v-if="service.duration || service.format" class="flex flex-wrap items-center gap-3 mb-5 text-sand-600">
              <span v-if="service.duration" class="flex items-center gap-1.5 font-body text-4 font-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 7v5l3 3" /></svg>
                {{ service.duration }}
              </span>
              <span v-if="service.format" class="flex items-center gap-1.5 font-body text-4 font-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5.5" r="3" /><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
                {{ service.format }}
              </span>
            </div>

            <!-- CTA -->
            <div class="mt-auto pt-4 border-t border-sand-100 flex items-center justify-between">
              <button @click="openDetail(service)" class="font-body text-4 font-600 text-amber-600 hover:text-amber-700 transition-colors bg-transparent border-none cursor-pointer p-0">
                Подробнее
              </button>
              <button v-if="!service.included" class="font-body text-4 font-600 text-sand-700 bg-sand-100 hover:bg-sand-200 px-3.5 py-1.5 rounded-full border-none cursor-pointer transition-colors" disabled>
                Добавить к брони
              </button>
            </div>
          </div>
          </div>
        </Transition>
      </div>

      <!-- Показать ещё -->
      <Transition name="show-more">
        <div v-if="activeServices.length > 6 && !expanded" class="text-center mt-8">
          <button @click="expanded = true" class="btn-secondary">
            Показать ещё {{ activeServices.length - 6 }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><path d="M6 9l6 6l6 -6" /></svg>
          </button>
        </div>
      </Transition>
    </div>

    <!-- Detail modal -->
    <Teleport to="body">
      <Transition name="svc-modal">
        <div v-if="detailService" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/60 backdrop-blur-sm" @click.self="closeDetail">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-130 max-h-[90vh] overflow-y-auto shadow-2xl z-10 modal-body" data-lenis-prevent>

            <!-- Header: icon + name + close, aligned -->
            <div class="px-7 md:px-9 pt-7 pb-5 border-b border-sand-200">
              <div class="flex items-center gap-4">
                <div class="modal-icon-wrap flex-shrink-0" v-html="detailService.icon"></div>
                <h3 class="flex-1 font-display font-500 text-sand-900 min-w-0" style="font-size: clamp(1.4rem, 3vw, 1.8rem)">{{ detailService.title }}</h3>
                <button @click="closeDetail" class="flex-shrink-0 w-9 h-9 rounded-full bg-sand-200/90 hover:bg-sand-300 flex items-center justify-center transition-colors border-none cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="px-7 md:px-9 py-6">
              <p class="font-body text-4 text-sand-800 leading-relaxed mb-6">{{ detailService.fullDescription }}</p>

              <!-- Dynamic sections -->
              <div v-for="(section, si) in detailService.sections" :key="si" class="mb-6 last:mb-0">
                <h4 class="font-display font-500 text-4.5 text-sand-800 mb-2">{{ section.title }}</h4>
                <p class="font-body text-4 text-sand-700 leading-relaxed whitespace-pre-line">{{ section.content }}</p>
              </div>

              <!-- Meta info — styled block like room specs -->
              <div v-if="detailService.duration || detailService.format" class="flex flex-wrap items-center gap-3 mt-6 bg-olive-50 border border-olive-100 rounded-2.5 px-4 py-3">
                <span v-if="detailService.duration" class="flex items-center gap-2">
                  <svg class="text-olive-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 7v5l3 3" /></svg>
                  <span class="font-body text-4 font-600 text-olive-700">{{ detailService.duration }}</span>
                </span>
                <div v-if="detailService.duration && detailService.format" class="w-px h-3.5 bg-olive-200"></div>
                <span v-if="detailService.format" class="flex items-center gap-2">
                  <svg class="text-olive-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5.5" r="3" /><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" /></svg>
                  <span class="font-body text-4 font-600 text-olive-700">{{ detailService.format }}</span>
                </span>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-7 md:px-9 py-5 border-t border-sand-200 flex items-center justify-between bg-sand-100/50">
              <div v-if="!detailService.included && detailService.price">
                <span class="font-display font-500 text-sand-900" style="font-size: clamp(1.2rem, 2vw, 1.5rem)">{{ detailService.price }}</span>
              </div>
              <div v-else>
                <span class="font-body text-4 font-600 text-olive-700">Включено в стоимость проживания</span>
              </div>
              <button class="btn-primary opacity-50 cursor-default" disabled>Добавить к брони</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
interface ServiceSection {
  title: string
  content: string
}

interface Service {
  id: string
  category: string
  icon: string
  title: string
  description: string
  fullDescription: string
  sections: ServiceSection[]
  included: boolean
  price: string
  duration: string
  format: string
}

const titleRef = ref<HTMLElement>()
const tabsRef = ref<HTMLElement>()
const gridRef = ref<HTMLElement>()
const activeTab = ref('included')
const expanded = ref(false)
const detailService = ref<Service | null>(null)

// Reset expanded when tab changes
watch(activeTab, () => { expanded.value = false })

const i = {
  s: 'width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"',
  t: 'width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"',
}

// Tab icons (smaller)
const categories = [
  {
    id: 'included',
    label: 'Включено',
    icon: `<svg ${i.t}><path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" /><path d="M15 19l2 2l4 -4" /></svg>`,
  },
  {
    id: 'all',
    label: 'Все',
    icon: `<svg ${i.t}><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /></svg>`,
  },
  {
    id: 'food',
    label: 'Питание',
    icon: `<svg ${i.t}><path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12m0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" /></svg>`,
  },
  {
    id: 'active',
    label: 'Активный отдых',
    icon: `<svg ${i.t}><path d="M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612" /><path d="M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2" /></svg>`,
  },
  {
    id: 'wellness',
    label: 'Оздоровление',
    icon: `<svg ${i.t}><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1" /><path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25" /><path d="M4 21l1 -1.5" /><path d="M20 21l-1 -1.5" /></svg>`,
  },
  {
    id: 'service',
    label: 'Сервис',
    icon: `<svg ${i.t}><path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" /></svg>`,
  },
]

const services: Service[] = [
  // === ВКЛЮЧЕНО ===
  {
    id: 'wifi',
    category: 'included',
    icon: `<svg ${i.s}><path d="M12 18l.01 0" /><path d="M9.172 15.172a4 4 0 0 1 5.656 0" /><path d="M6.343 12.343a8 8 0 0 1 11.314 0" /><path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0" /></svg>`,
    title: 'Бесплатный Wi-Fi',
    description: 'Высокоскоростной интернет на всей территории пансионата — в номерах, холле и зонах отдыха.',
    fullDescription: 'Стабильный Wi-Fi доступен круглосуточно на всей территории пансионата. Подходит для видеозвонков и работы.',
    sections: [
      { title: 'Покрытие', content: 'Все номера, холл, ресторан, терраса' },
    ],
    included: true, price: '', duration: '', format: '',
  },
  {
    id: 'parking',
    category: 'included',
    icon: `<svg ${i.s}><path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" /><path d="M10 16v-8h2.667c.736 0 1.333 .895 1.333 2s-.597 2 -1.333 2h-2.667" /></svg>`,
    title: 'Парковка',
    description: 'Бесплатная охраняемая парковка на территории. Место гарантировано для каждого номера.',
    fullDescription: 'Просторная парковка рядом с пансионатом. Ваш автомобиль будет в безопасности на протяжении всего отдыха.',
    sections: [
      { title: 'Условия', content: 'Бесплатно для всех гостей пансионата. Одно место на номер, дополнительные по запросу.' },
    ],
    included: true, price: '', duration: '', format: '',
  },
  {
    id: 'playground',
    category: 'included',
    icon: `<svg ${i.s}><path d="M6 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M16 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M2 5h2.5l1.632 4.897a6 6 0 0 0 5.693 4.103h2.675a5.5 5.5 0 0 0 0 -11h-.5v6" /><path d="M6 9h14" /><path d="M9 17l1 -3" /><path d="M16 14l1 3" /></svg>`,
    title: 'Детская площадка',
    description: 'Безопасная игровая зона на свежем воздухе — качели, горки, песочница среди деревьев.',
    fullDescription: 'Оборудованная детская площадка на территории пансионата, в окружении реликтового леса. Дети играют на свежем горном воздухе под присмотром.',
    sections: [
      { title: 'Что есть', content: 'Качели, горки, песочница, лесенки. Мягкое покрытие для безопасности.' },
      { title: 'Для кого', content: 'Дети от 2 до 12 лет. Дети до 6 лет — только в сопровождении взрослых.' },
    ],
    included: true, price: '', duration: '', format: '',
  },
  {
    id: 'heating',
    category: 'included',
    icon: `<svg ${i.s}><path d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235" /></svg>`,
    title: 'Отопление',
    description: 'В номерах всегда тепло и комфортно — даже прохладными горными вечерами на высоте 1700 метров.',
    fullDescription: 'Автономная система отопления работает по необходимости. На высоте 1700 метров ночные температуры могут опускаться до +5°C даже летом — в номерах всегда комфортные 22-24°C.',
    sections: [],
    included: true, price: '', duration: '', format: '',
  },
  {
    id: 'linens',
    category: 'included',
    icon: `<svg ${i.s}><path d="M5 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M22 17v-3h-20" /><path d="M2 8v9" /><path d="M12 14h10v-2a3 3 0 0 0 -3 -3h-7v5" /></svg>`,
    title: 'Постельное бельё и полотенца',
    description: 'Чистое бельё и мягкие полотенца. Смена по запросу или каждые 3 дня.',
    fullDescription: 'В каждом номере — чистое постельное бельё из натуральных тканей и комплект полотенец (банное, для рук, для ног). Смена белья каждые 3 дня или по запросу.',
    sections: [],
    included: true, price: '', duration: '', format: '',
  },

  // === ПИТАНИЕ ===
  {
    id: 'breakfast',
    category: 'food',
    icon: `<svg ${i.s}><path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" /><path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" /><path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" /><path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5" /></svg>`,
    title: 'Завтрак',
    description: 'Сытный домашний завтрак из местных продуктов — каши, выпечка, яйца, сыры, чай из горных трав.',
    fullDescription: 'Каждое утро — домашний завтрак из свежих местных продуктов. Горячие каши, домашняя выпечка, яйца, дагестанские сыры, мёд, масло, чай из горных трав.',
    sections: [
      { title: 'Время', content: '8:00 — 10:00 (по выходным до 11:00)' },
      { title: 'Формат', content: 'Шведский стол. Свежая выпечка и горячее обновляются каждый час.' },
    ],
    included: true, price: '', duration: '8:00 — 10:00', format: '',
  },
  {
    id: 'lunch',
    category: 'food',
    icon: `<svg ${i.s}><path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12m0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3" /></svg>`,
    title: 'Обед',
    description: 'Полноценный обед из трёх блюд — супы, горячее из баранины и говядины, свежие салаты.',
    fullDescription: 'Обед — это сердце дагестанского гостеприимства. Наваристые супы, горячее из местной баранины и говядины, свежие салаты из овощей с грядки, домашний хлеб.',
    sections: [
      { title: 'Время', content: '13:00 — 15:00' },
      { title: 'Меню', content: 'Салат + суп + горячее + напиток. Меню меняется ежедневно. Порции от души.' },
    ],
    included: false, price: 'от 600 ₽', duration: '13:00 — 15:00', format: '',
  },
  {
    id: 'dinner',
    category: 'food',
    icon: `<svg ${i.s}><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008" /><path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" /><path d="M19 11h2m-1 -1v2" /></svg>`,
    title: 'Ужин',
    description: 'Вечерняя трапеза в тёплой атмосфере — блюда национальной кухни, свежий хлеб, травяной чай.',
    fullDescription: 'Ужин в пансионате — время, когда горы за окном становятся фиолетовыми, а на столе появляются лучшие блюда дагестанской кухни. Хинкал, чуду, курзе, свежий хлеб из тандыра.',
    sections: [
      { title: 'Время', content: '18:30 — 20:30' },
      { title: 'Особенности', content: 'Меню по предзаказу. Возможен вегетарианский вариант. Детское меню по запросу.' },
    ],
    included: false, price: 'от 700 ₽', duration: '18:30 — 20:30', format: '',
  },

  // === АКТИВНЫЙ ОТДЫХ ===
  {
    id: 'excursions',
    category: 'active',
    icon: `<svg ${i.s}><path d="M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612" /><path d="M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2" /></svg>`,
    title: 'Экскурсии',
    description: 'Индивидуальные и групповые поездки по Гунибскому району — водопады, крепости, аулы-призраки.',
    fullDescription: 'Откройте Дагестан с опытным гидом. Древние крепости, затерянные аулы, водопады, смотровые площадки с видом на весь Кавказ. Маршруты от простых до сложных.',
    sections: [
      { title: 'Популярные маршруты', content: 'Гунибская крепость — 2 часа\nВодопад Тобот — 4 часа\nАул-призрак Гамсутль — 5-6 часов\nСулакский каньон — целый день' },
      { title: 'Условия', content: 'Группы от 2 человек. Транспорт, гид, вода включены. Минимум за день до поездки.' },
    ],
    included: false, price: 'от 2 000 ₽', duration: '2-8 часов', format: 'группы и индивид.',
  },
  {
    id: 'horse',
    category: 'active',
    icon: `<svg ${i.s}><path d="M7 10l-.85 8.507a1.357 1.357 0 0 0 1.35 1.493h.146a2 2 0 0 0 1.857 -1.257l.994 -2.486a2 2 0 0 1 1.857 -1.257h1.292a2 2 0 0 1 1.857 1.257l.994 2.486a2 2 0 0 0 1.857 1.257h.146a1.37 1.37 0 0 0 1.364 -1.494l-.864 -9.506h-8c0 -3 -3 -5 -6 -5l-3 6l2 2l3 -2" /><path d="M22 14v-2a3 3 0 0 0 -3 -3" /></svg>`,
    title: 'Конные прогулки',
    description: 'Прогулка верхом по сосновому лесу на смирных лошадях — подходит для первого знакомства с конным спортом.',
    fullDescription: 'Прогулка верхом по реликтовому лесу на спокойных, обученных лошадях. Инструктор сопровождает группу на всём маршруте. Незабываемые виды на горы прямо из седла.',
    sections: [
      { title: 'Маршрут', content: 'По лесным тропам вокруг пансионата с выходом на смотровую площадку.' },
      { title: 'Для кого', content: 'Подходит новичкам. Дети от 7 лет в сопровождении взрослых. Максимальный вес всадника — 100 кг.' },
      { title: 'Что взять', content: 'Удобную закрытую обувь, длинные брюки. Шлемы предоставляем.' },
    ],
    included: false, price: 'от 1 500 ₽', duration: '1.5 — 2 часа', format: 'группы до 6 чел.',
  },
  {
    id: 'hiking',
    category: 'active',
    icon: `<svg ${i.s}><path d="M12 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M7 21l3 -4" /><path d="M16 21l-2 -4l-3 -3l1 -6" /><path d="M6 12l2 -3l4 -1l3 3l3 1" /></svg>`,
    title: 'Пешие маршруты',
    description: 'Тропы разной сложности прямо от пансионата — от лёгких семейных прогулок до серьёзных горных треков.',
    fullDescription: 'Пансионат расположен в сердце горного леса — десятки троп начинаются прямо от порога. От 30-минутных прогулок с детьми до многочасовых восхождений с перепадом высот.',
    sections: [
      { title: 'Маршруты', content: 'Лесная тропа (30 мин, семейная)\nТропа к водопаду (2 часа, средняя)\nВосхождение на Гуниб-гору (4-5 часов, сложная)' },
      { title: 'Можно с гидом', content: 'Гид-проводник — 1 500 ₽ за группу. Знает каждую тропу и расскажет историю каждого камня.' },
    ],
    included: true, price: '', duration: 'от 30 мин', format: 'самостоятельно или с гидом',
  },
  {
    id: 'fishing',
    category: 'active',
    icon: `<svg ${i.s}><path d="M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56c0 1.747 .64 3.345 1.699 4.571" /><path d="M2 9.504c7.715 8.647 14.75 10.265 20 2.498c-5.25 -7.761 -12.285 -6.142 -20 2.504" /><path d="M18 11v.01" /><path d="M11.5 10.5c-.667 1 -.667 2 0 3" /></svg>`,
    title: 'Рыбалка',
    description: 'Горная форель в чистейших реках Гунибского района. Удочки и снасти предоставляем.',
    fullDescription: 'Рыбалка на горной реке в окрестностях пансионата. Чистейшая вода, тишина и горная форель. Всё снаряжение предоставляем — приезжайте с пустыми руками.',
    sections: [
      { title: 'Что ловится', content: 'Горная форель. Сезон: май — сентябрь.' },
      { title: 'Снаряжение', content: 'Удочки, наживка, стульчик — всё включено в стоимость.' },
    ],
    included: false, price: 'от 800 ₽', duration: 'без ограничений', format: '',
  },

  // === ОЗДОРОВЛЕНИЕ ===
  {
    id: 'sauna',
    category: 'wellness',
    icon: `<svg ${i.s}><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1" /><path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25" /><path d="M4 21l1 -1.5" /><path d="M20 21l-1 -1.5" /></svg>`,
    title: 'Сауна и русская баня',
    description: 'Русская баня на дровах и финская сауна с видом на лес. Веники, чай с горными травами.',
    fullDescription: 'Настоящая русская баня на берёзовых дровах — с паром, вениками и ледяным обливанием. Рядом — финская сауна для тех, кто предпочитает сухой жар. После парной — травяной чай на террасе с видом на вековые сосны.',
    sections: [
      { title: 'Что включено', content: 'Парная, веники (берёзовый, дубовый), простыни, тапочки, травяной чай.' },
      { title: 'Расписание', content: 'Ежедневно с 16:00 до 22:00. Сеанс 2 часа. Бронировать минимум за 3 часа.' },
      { title: 'Ограничения', content: 'Одновременно до 6 человек. Не рекомендуется при сердечно-сосудистых заболеваниях.' },
    ],
    included: false, price: 'от 2 000 ₽', duration: '2 часа', format: 'до 6 чел.',
  },
  {
    id: 'air',
    category: 'wellness',
    icon: `<svg ${i.s}><path d="M16 5l3 3l-2 1l4 4l-3 1l4 4h-9" /><path d="M15 21l0 -3" /><path d="M8 13l-2 -2" /><path d="M8 12l2 -2" /></svg>`,
    title: 'Горный воздух и тишина',
    description: 'На высоте 1700 метров, вдали от города — чистейший воздух реликтового леса и абсолютная тишина.',
    fullDescription: 'Пансионат Радде находится на высоте 1700 метров в окружении реликтового леса. Здесь нет промышленных объектов, шумных дорог и городской пыли. Сама природа — ваш оздоровительный курс.',
    sections: [
      { title: 'Что это значит', content: 'Воздух в горном лесу содержит на 40% больше кислорода. Фитонциды хвойных деревьев укрепляют иммунитет. Первые три дня организм перестраивается — потом вы почувствуете прилив энергии.' },
    ],
    included: true, price: '', duration: '', format: '',
  },

  // === СЕРВИС ===
  {
    id: 'transfer',
    category: 'service',
    icon: `<svg ${i.s}><path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" /></svg>`,
    title: 'Трансфер',
    description: 'Встретим в аэропорту Махачкалы или в любой точке Дагестана. Комфортный автомобиль, опытный водитель.',
    fullDescription: 'Не нужно думать о логистике — мы организуем трансфер из аэропорта Махачкалы, железнодорожного вокзала или любого города Дагестана. Комфортный автомобиль, водитель, который знает каждый поворот горного серпантина.',
    sections: [
      { title: 'Откуда', content: 'Аэропорт Махачкалы — 3-4 часа\nЖ/д вокзал Махачкалы — 3-4 часа\nДербент — 4-5 часов\nГуниб (центр) — 30 минут' },
      { title: 'Условия', content: 'Бронировать минимум за сутки. Встреча с табличкой. Детское кресло по запросу.' },
    ],
    included: false, price: 'от 5 000 ₽', duration: '3-4 часа', format: 'до 4 пассажиров',
  },
  {
    id: 'bbq',
    category: 'service',
    icon: `<svg ${i.s}><path d="M19 8h-14a6 6 0 0 0 6 6h2a6 6 0 0 0 6 -5.775l0 -.225" /><path d="M17 20a2 2 0 1 1 0 -4a2 2 0 0 1 0 4" /><path d="M15 14l1 2" /><path d="M9 14l-3 6" /><path d="M15 18h-8" /><path d="M15 5v-1" /><path d="M12 5v-1" /><path d="M9 5v-1" /></svg>`,
    title: 'Барбекю-зоны',
    description: 'Оборудованные площадки для барбекю с мангалами, столами и видом на горы. Мясо можно купить у нас.',
    fullDescription: 'Три оборудованные зоны для барбекю на территории пансионата — каждая с видом на горы. Мангал, шампуры, решётки, стол и скамейки. Дрова и уголь предоставляем.',
    sections: [
      { title: 'Что включено', content: 'Мангал, шампуры, решётка, дрова/уголь, стол, скамейки, освещение.' },
      { title: 'Мясо и продукты', content: 'Можете привезти своё или заказать у нас: баранина, говядина, курица. Заказ минимум за 3 часа.' },
      { title: 'Время', content: 'С 11:00 до 22:00. Бронировать на ресепшен.' },
    ],
    included: false, price: 'от 1 000 ₽', duration: 'без ограничений', format: '',
  },
  {
    id: 'campfire',
    category: 'service',
    icon: `<svg ${i.s}><path d="M4 21l16 -4" /><path d="M20 21l-16 -4" /><path d="M12 15a4 4 0 0 0 4 -4c0 -3 -2 -3 -2 -8c-4 2 -6 5 -6 8a4 4 0 0 0 4 4" /></svg>`,
    title: 'Вечерний костёр',
    description: 'Костёр в лесу с видом на звёзды — чай, истории и горский покой. Организуем для вашей компании.',
    fullDescription: 'Вечером, когда темнеет и горы становятся силуэтами на фоне звёздного неба — мы разводим костёр на специальной площадке. Чай из горных трав, тёплые пледы, треск дров и абсолютная тишина.',
    sections: [
      { title: 'Когда', content: 'Ежедневно с наступлением темноты (с 20:00-21:00). По погоде.' },
      { title: 'Что включено', content: 'Костёр, дрова, чай, пледы.' },
    ],
    included: false, price: 'от 500 ₽', duration: 'вечер', format: 'для компании',
  },
]

const activeServices = computed(() => {
  if (activeTab.value === 'all') return services
  return services.filter(s => s.category === activeTab.value)
})

const visibleServices = computed(() => {
  if (expanded.value) return activeServices.value
  return activeServices.value.slice(0, 6)
})

function getServicesByCategory(catId: string) {
  if (catId === 'all') return services
  return services.filter(s => s.category === catId)
}

function openDetail(service: Service) {
  detailService.value = service
  document.body.style.overflow = 'hidden'
  useLenis().instance()?.stop()
  history.replaceState(null, '', `#service-${service.id}`)
}

function closeDetail() {
  detailService.value = null
  document.body.style.overflow = ''
  useLenis().instance()?.start()
  history.replaceState(null, '', window.location.pathname)
}

onMounted(() => {
  if (!import.meta.client) return

  // Open service modal from URL hash
  const hash = window.location.hash
  if (hash.startsWith('#service-')) {
    const id = hash.replace('#service-', '')
    const found = services.find(s => s.id === id)
    if (found) {
      // Switch to correct tab
      activeTab.value = found.category
      setTimeout(() => openDetail(found), 500)
    }
  }
})
</script>

<style scoped>
/* Tab buttons */
.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #6B5B4A;
  background: transparent;
  border: 1.5px solid #E8D5B7;
  border-radius: 999px;
  padding: 9px 18px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}
.tab-btn:hover:not(.tab-btn--active) {
  border-color: #C17F3E;
  background: rgba(193, 127, 62, 0.04);
}
.tab-btn--active {
  background: #2C2416;
  border-color: #2C2416;
  color: #FAF6F0;
}
.tab-btn--active:hover {
  background: #2C2416;
  border-color: #2C2416;
  color: #FAF6F0;
}
/* "Включено" tab — olive/green */
.tab-btn--included {
  border-color: #D1D9B9;
  color: #4A6330;
  background: rgba(91, 122, 58, 0.04);
}
.tab-btn--included:hover:not(.tab-btn--active) {
  border-color: #8FA363;
  background: rgba(91, 122, 58, 0.08);
}
.tab-btn--included.tab-btn--active {
  background: #4A6330;
  border-color: #4A6330;
  color: #F4F6EE;
}
.tab-btn--included.tab-btn--active:hover {
  background: #4A6330;
  border-color: #4A6330;
  color: #F4F6EE;
}
/* "Все" tab — warm terracotta */
.tab-btn--all {
  border-color: #D4A088;
  color: #8B4E3A;
  background: rgba(139, 78, 58, 0.04);
}
.tab-btn--all:hover:not(.tab-btn--active) {
  border-color: #C08670;
  background: rgba(139, 78, 58, 0.08);
}
.tab-btn--all.tab-btn--active {
  background: #8B4E3A;
  border-color: #8B4E3A;
  color: #FBF0EB;
}
.tab-btn--all.tab-btn--active:hover {
  background: #8B4E3A;
  border-color: #8B4E3A;
  color: #FBF0EB;
}
.tab-icon {
  display: flex;
  align-items: center;
  opacity: 0.7;
}
.tab-btn--active .tab-icon {
  opacity: 1;
  color: #FAF6F0;
}
.tab-btn--included .tab-icon {
  color: #4A6330;
}
.tab-btn--included.tab-btn--active .tab-icon {
  color: #F4F6EE;
}
.tab-btn--all .tab-icon {
  color: #8B4E3A;
}
.tab-btn--all.tab-btn--active .tab-icon {
  color: #FBF0EB;
}

/* Service card */
.service-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #F0E6D6;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(44, 36, 22, 0.04);
}
.service-card:hover {
  box-shadow: 0 8px 30px rgba(44, 36, 22, 0.08);
  border-color: #E8D5B7;
  transform: translateY(-2px);
}

.service-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Icon wrappers */
.service-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #F4F6EE, #E8ECDC);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5B7A3A;
  flex-shrink: 0;
}

.modal-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #F4F6EE, #E8ECDC);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5B7A3A;
  flex-shrink: 0;
}

/* Badges */
.badge {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}
/* badge — намеренное исключение из правила min 16px:
   мини-бейдж в углу карточки, иначе ломает layout */
.badge--included {
  background: #E8F0E0;
  color: #4A6330;
}
.badge--price {
  background: #FAF0E4;
  color: #A66B32;
}

/* Grid fade transition (tab switching) */
.grid-fade-enter-active {
  transition: opacity 0.5s ease 0.15s;
}
.grid-fade-enter-active .service-card {
  animation: cardReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.grid-fade-leave-active {
  transition: opacity 0.3s ease;
}
.grid-fade-enter-from {
  opacity: 0;
}
.grid-fade-leave-to {
  opacity: 0;
}

/* .contents helper for transition wrapper */
.contents {
  display: contents;
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Show more button fade */
.show-more-enter-active { transition: all 0.4s ease; }
.show-more-leave-active { transition: all 0.3s ease; }
.show-more-enter-from { opacity: 0; transform: translateY(10px); }
.show-more-leave-to { opacity: 0; transform: translateY(-5px); }

/* Modal */
.svc-modal-enter-active { transition: opacity 0.3s ease; }
.svc-modal-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.svc-modal-leave-active { transition: opacity 0.2s ease; }
.svc-modal-leave-active > div:last-child { transition: transform 0.2s ease, opacity 0.2s ease; }
.svc-modal-enter-from { opacity: 0; }
.svc-modal-enter-from > div:last-child { opacity: 0; transform: scale(0.95) translateY(10px); }
.svc-modal-leave-to { opacity: 0; }
.svc-modal-leave-to > div:last-child { opacity: 0; transform: scale(0.97); }
</style>
