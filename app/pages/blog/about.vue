<template>
  <div>
    <UiAppHeader solid @book="showBooking = true" />

    <!-- Hero -->
    <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-40 pb-16 md:pb-24">
      <img :src="`${base}images/hero/hero-1.jpg`" alt="" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-sand-900/72"></div>

      <div class="container relative z-10">
        <UiBreadcrumbs
          variant="dark"
          :items="[
            { label: 'Главная', href: base },
            { label: 'Блог', href: `${base}blog` },
            { label: 'О пансионате' },
          ]"
          class="mb-6"
        />
        <h1 class="text-h1 text-white mb-5 max-w-200">
          Что такое <span class="section-title-accent">Радде</span>
        </h1>
        <p class="text-body-lg text-white/80 max-w-150">
          Пансионат в природном парке «Верхний Гуниб», на 1700 метрах, в реликтовом берёзовом лесу. Двенадцать номеров, домашняя кухня, конюшня, баня и абсолютная тишина.
        </p>
      </div>
    </section>

    <!-- Цифры -->
    <section class="bg-sand-50 py-12 md:py-16 border-b border-sand-200">
      <div class="container">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          <div v-for="stat in stats" :key="stat.label" class="text-center md:text-left">
            <span class="font-display font-500 text-sand-900 block leading-none mb-2" style="font-size: clamp(2rem, 4.5vw, 3rem)">{{ stat.value }}</span>
            <span class="text-small text-sand-700">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Главное про место -->
    <section class="bg-sand-50 section-padding">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <span class="text-label text-olive-600 mb-4 block">Локация</span>
            <h2 class="text-h2 text-sand-900 mb-6">
              Реликтовый лес<br>
              <span class="section-title-accent">на высоте 1700 метров</span>
            </h2>
            <p class="text-body text-sand-700 mb-5">
              Пансионат стоит в природном парке «Верхний Гуниб» — одном из самых живописных уголков Дагестана. Вокруг — реликтовый берёзовый лес и горные луга. Сама берёза Радде, в честь которой названо это место, — эндемик Кавказа, занесённый в Красную книгу.
            </p>
            <p class="text-body text-sand-700 mb-5">
              На 1700 метрах воздух разрежённый и чистый, ночное небо — без засветки больших городов, утром в долине ниже стелется туман. Это другая Россия: не курортная, а тихая и созерцательная.
            </p>
            <p class="text-body text-sand-700">
              До центра Гуниба от пансионата 10 минут. До Махачкалы — около 4 часов на машине, асфальт до самого ресепшн. Подробно про дорогу — в статье <a :href="`${base}blog/kak-dobratsya`" class="post-link">«Как добраться до Радде»</a>.
            </p>
          </div>
          <div class="relative">
            <div class="aspect-4/5 rounded-3 overflow-hidden shadow-xl">
              <img :src="`${base}images/hero/hero-3.jpg`" alt="Пансионат Радде в горах" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-olive-100 rounded-3 -z-1"></div>
            <div class="absolute -top-4 -right-4 w-16 h-16 bg-amber-400/20 rounded-full -z-1"></div>
          </div>
        </div>
      </div>
    </section>

    <UiEthnicDivider variant="medium" />

    <!-- Что есть в пансионате -->
    <section class="bg-sand-100 section-padding">
      <div class="container">
        <UiSectionHeader label="Что есть в пансионате" align="left" class="mb-10 max-w-150">
          <template #default>
            Двенадцать номеров и всё, <span class="section-title-accent">что нужно для отдыха</span>
          </template>
        </UiSectionHeader>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="feat in features" :key="feat.title" class="feature-card">
            <div class="feature-icon" v-html="feat.icon"></div>
            <h3 class="font-display font-500 text-sand-900 mb-2" style="font-size: 1.15rem">{{ feat.title }}</h3>
            <p class="text-small text-sand-700 leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <UiEthnicDivider variant="light" />

    <!-- Философия -->
    <section class="bg-sand-50 section-padding">
      <div class="container">
        <article class="post-prose mx-auto">
          <span class="text-label text-olive-600 mb-4 block text-center">Философия</span>
          <h2 class="text-h2 text-sand-900 text-center mb-10">
            Как мы <span class="section-title-accent">принимаем гостей</span>
          </h2>

          <p>
            Радде делали как место, где хочется задержаться. Не на ночь между двумя точками маршрута, а на неделю, на десять дней — чтобы успеть выдохнуть, погулять по лесу, пообедать без спешки и хотя бы раз посидеть в бане до полуночи.
          </p>

          <h2>Никакой суеты</h2>
          <p>
            У нас нет анимации, шумных программ и громкой музыки во дворе. Тишина — главный ресурс этого места, и мы её бережём. На территории не больше тридцати взрослых одновременно, даже в высокий сезон. Если хочется поговорить — зовите, если хочется тишины — никто не подойдёт.
          </p>

          <h2>Домашняя кухня</h2>
          <p>
            Кухня в пансионате — про быт, а не про впечатления. Хинкал и чуду пекут утром. Молоко, творог и зелень берём у местных хозяйств. Если у вас особенности питания, диета или ребёнок — предупредите при заселении, мы согласуем меню под вас. Подробнее про дагестанскую кухню — в <a :href="`${base}blog/dagestanskaya-kuhnya`" class="post-link">отдельной статье</a>.
          </p>

          <h2>Гостеприимство по-горски</h2>
          <p>
            В горах Дагестана гость — не клиент, а гость. Это не маркетинг, это правда работает. Если идёт дождь — встретят с зонтом. Если устали с дороги — принесут чай прямо в номер. Если хочется поехать на пикник — соберут термос и лепёшки в дорогу. Так у нас принято.
          </p>

          <h2>Помощь с маршрутом</h2>
          <p>
            На ресепшн всегда есть свежий список, что посмотреть в районе, какие тропы открыты, где сейчас красивый закат и куда лучше заехать на обед. Сами организуем трансферы, экскурсии и конные прогулки — со своими водителями и инструкторами. Подробно про активности — в наших статьях про <a :href="`${base}blog/dostoprimechatelnosti`" class="post-link">достопримечательности</a> и <a :href="`${base}blog/konnye-progulki`" class="post-link">конные прогулки</a>.
          </p>
        </article>
      </div>
    </section>

    <UiEthnicDivider variant="medium" />

    <!-- Кому подходит -->
    <section class="bg-sand-100 section-padding">
      <div class="container">
        <UiSectionHeader label="Для кого Радде" align="left" class="mb-10 max-w-150">
          <template #default>
            Кому здесь будет <span class="section-title-accent">особенно хорошо</span>
          </template>
        </UiSectionHeader>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="aud in audiences" :key="aud.title" class="audience-card">
            <span class="audience-num">{{ aud.num }}</span>
            <h3 class="font-display font-500 text-sand-900 mb-3" style="font-size: 1.15rem">{{ aud.title }}</h3>
            <p class="text-small text-sand-700 leading-relaxed mb-4">{{ aud.desc }}</p>
            <a v-if="aud.link" :href="aud.link.href" class="text-small font-600 text-amber-600 hover:text-amber-700 inline-flex items-center gap-1">
              {{ aud.link.label }}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-sand-900 py-16 md:py-20 relative overflow-hidden">
      <img :src="`${base}images/hero/hero-4.jpg`" alt="" class="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div class="absolute inset-0 bg-gradient-to-r from-sand-900 via-sand-900/85 to-sand-900/40"></div>
      <div class="container relative z-10">
        <div class="max-w-150">
          <span class="text-label text-amber-400 mb-4 block">Бронирование</span>
          <h2 class="text-h2 text-white mb-5">
            Приезжайте <span class="section-title-accent">в Радде</span>
          </h2>
          <p class="text-body-lg text-white/80 mb-8">
            Свяжитесь с нами, мы поможем выбрать номер по составу гостей и сезону, подскажем оптимальные даты и оформим трансфер от аэропорта.
          </p>
          <div class="flex flex-wrap gap-3">
            <button type="button" @click="showBooking = true" class="btn-primary inline-flex items-center gap-2">
              Забронировать
            </button>
            <a :href="`${base}contacts`" class="btn-secondary btn-secondary--dark inline-flex items-center gap-2">
              Связаться с пансионатом
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <UiSiteFooter />

    <UiBookingModal v-model="showBooking" />
  </div>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
const showBooking = ref(false)

const stats = [
  { value: '1700', label: 'метров над уровнем моря' },
  { value: '12', label: 'уютных номеров' },
  { value: '4.8', label: 'рейтинг на Яндекс Картах' },
  { value: '10', label: 'минут до центра Гуниба' },
]

const features = [
  {
    title: 'Просторные номера',
    desc: 'От стандартов на двоих до семейных люксов с панорамными окнами. Тёплые полы, подушки на выбор, халаты и тапочки.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13"/><path d="M3 16h18"/><path d="M7 8V6a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2"/></svg>',
  },
  {
    title: 'Домашняя кухня',
    desc: 'Завтрак, обед и ужин в нашей столовой. Хинкал, чуду, лепёшки в дровяной печи. Детское меню по запросу.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18"/><path d="M5 11V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4"/><path d="M5 11v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4v-6"/></svg>',
  },
  {
    title: 'Баня с купелью',
    desc: 'Дровяная баня с панорамным окном на горы. Купель в снегу зимой и обливание родниковой водой летом.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6"/><path d="M9 5l3-3 3 3"/><path d="M5 22h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/><path d="M9 14h.01M12 14h.01M15 14h.01M9 18h.01M12 18h.01M15 18h.01"/></svg>',
  },
  {
    title: 'Конюшня',
    desc: 'Лошади под седло для прогулок по лесу и горным маршрутам. Инструктор, шлем, лошадь по уровню — всё в комплекте.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18a3 3 0 0 0 3-3V8a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v0a3 3 0 0 0 3 3h0"/><path d="M5 18l-2 4M19 11l2-4M11 5l-2-3M13 21h-3"/></svg>',
  },
  {
    title: 'Прогулочные тропы',
    desc: 'Маршруты разной сложности прямо от ресепшн: от часовой прогулки до полудневного похода с инструктором.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l4-9 4 5 4-7 6 11"/><circle cx="9" cy="6" r="2"/></svg>',
  },
  {
    title: 'Трансфер',
    desc: 'Встретим в аэропорту Махачкалы или на вокзале. Седан, минивэн или микроавтобус — по составу гостей.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l1-5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2l1 5"/><path d="M3 11h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z"/><circle cx="7" cy="15" r="1"/><circle cx="17" cy="15" r="1"/></svg>',
  },
  {
    title: 'Wi-Fi и связь',
    desc: 'Wi-Fi покрывает всю территорию. Сотовая связь стабильная — все российские операторы. Не отключаемся от мира, если не хотим.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a16 16 0 0 1 20 0"/><path d="M5 12a11 11 0 0 1 14 0"/><path d="M8 15a6 6 0 0 1 8 0"/><circle cx="12" cy="18.5" r="1" fill="currentColor"/></svg>',
  },
  {
    title: 'Парковка',
    desc: 'Закрытая парковка на территории. Места хватает всем гостям, даже в высокий сезон. Видеонаблюдение круглосуточно.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
  },
  {
    title: 'Гостиная и библиотека',
    desc: 'Камин, мягкие диваны, книги о Дагестане, настольные игры. Любимое место гостей вечером после прогулки.',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"/></svg>',
  },
]

const audiences = [
  {
    num: '01',
    title: 'Семьям с детьми',
    desc: 'Спокойная территория, домашнее питание, конные прогулки от 6 лет, безопасные тропы. Кроватка и стульчик — по запросу.',
    link: { label: 'Подробнее', href: `${base}blog/semeynyy-otdyh` },
  },
  {
    num: '02',
    title: 'Парам на перезагрузку',
    desc: 'Уютные люксы, баня с панорамным окном, ужин в номер по запросу. Тихо, романтично, без шума.',
    link: undefined,
  },
  {
    num: '03',
    title: 'Любителям активного отдыха',
    desc: 'Конные маршруты, горные тропы, водопады и каньоны рядом. Сами организуем дневные выезды с гидом.',
    link: { label: 'Что посмотреть', href: `${base}blog/dostoprimechatelnosti` },
  },
  {
    num: '04',
    title: 'Тем, кто едет зимой',
    desc: 'Снег по пояс, печной дым, баня и тишина. Зимний Дагестан недооценивают зря — это отдельный опыт.',
    link: { label: 'Про зиму', href: `${base}blog/zimniy-dagestan` },
  },
]

useHead({
  title: 'О пансионате Радде — Радде',
  meta: [
    { name: 'description', content: 'Пансионат Радде на высоте 1700 метров в природном парке «Верхний Гуниб»: 12 номеров, домашняя кухня, баня, конюшня, прогулочные тропы.' },
  ],
})
</script>

<style scoped>
.post-meta-chip {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 3px 12px;
  border-radius: 999px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: white;
  letter-spacing: 0.02em;
}

.feature-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 16px;
  padding: 24px;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.feature-card:hover {
  border-color: #E8D5B7;
  box-shadow: 0 8px 24px rgba(44, 36, 22, 0.06);
  transform: translateY(-2px);
}
.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #F4F6EE;
  color: #6B7C3D;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.audience-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 16px;
  padding: 28px 24px;
  transition: border-color 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.audience-card:hover {
  border-color: #E8D5B7;
  box-shadow: 0 8px 24px rgba(44, 36, 22, 0.06);
}
.audience-num {
  display: inline-block;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.6rem;
  color: #C17F3E;
  margin-bottom: 12px;
}

.btn-secondary--dark {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.25);
  color: white;
}
.btn-secondary--dark:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.4);
}

.post-prose {
  max-width: 760px;
}

.post-prose :deep(p) {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 17px;
  line-height: 1.75;
  color: #4A3F2E;
  margin-bottom: 1.25rem;
}

.post-prose :deep(h2) {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: clamp(1.4rem, 2.4vw, 1.75rem);
  color: #2C2416;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.25;
}

.post-link {
  color: #A66B32;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgba(166, 107, 50, 0.3);
  transition: color 0.2s, text-decoration-color 0.2s;
}
.post-link:hover {
  color: #8B5728;
  text-decoration-color: #A66B32;
}
</style>
