<template>
  <div class="bg-sand-50 min-h-screen pt-32 pb-16">
    <UiAppHeader />
    <div class="container">
      <!-- Title block -->
      <div class="mb-16">
        <span class="text-label text-olive-600 mb-4 block">Дизайн-система</span>
        <h1 class="text-h1 text-sand-900 mb-4">
          Радде <span class="section-title-accent">— живой каталог</span>
        </h1>
        <p class="text-body-lg text-sand-700 max-w-160">
          Единый источник правды для интерфейса. Меняешь токен или компонент здесь — меняется на сайте, и наоборот.
          Все блоки на странице используют те же файлы, что и главная.
        </p>
      </div>

      <!-- Table of contents -->
      <nav class="bg-white border border-sand-200 rounded-3 p-6 mb-16">
        <h2 class="text-label text-sand-500 mb-4">Содержание</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <a v-for="s in sections" :key="s.id" :href="`#${s.id}`"
             class="text-body text-sand-700 hover:text-amber-600 transition-colors">
            {{ s.title }}
          </a>
        </div>
      </nav>

      <!-- ================== ОСНОВЫ ================== -->

      <!-- 1. Цвета -->
      <section id="colors" class="ds-section">
        <h2 class="ds-h2">Цветовая палитра</h2>
        <p class="ds-lead">Из логотипа: бежевый Sand, оливковый Olive, янтарный Amber. Все шкалы определены в <code>uno.config.ts</code>.</p>

        <h3 class="ds-h3">Sand — основная</h3>
        <div class="flex flex-wrap gap-3 mb-8">
          <div v-for="n in sandShades" :key="n"
               class="w-20 h-20 rounded-2 flex items-end p-2 text-2.5 font-500 shadow-sm"
               :class="[`bg-sand-${n}`, Number(n) >= 600 ? 'text-sand-100' : 'text-sand-800']">
            {{ n }}
          </div>
        </div>

        <h3 class="ds-h3">Olive — акцент из логотипа</h3>
        <div class="flex flex-wrap gap-3 mb-8">
          <div v-for="n in oliveShades" :key="n"
               class="w-20 h-20 rounded-2 flex items-end p-2 text-2.5 font-500 shadow-sm"
               :class="[`bg-olive-${n}`, Number(n) >= 500 ? 'text-olive-100' : 'text-olive-800']">
            {{ n }}
          </div>
        </div>

        <h3 class="ds-h3">Amber — CTA / действия</h3>
        <div class="flex flex-wrap gap-3 mb-4">
          <div v-for="n in ['400','500','600','700']" :key="n"
               class="w-20 h-20 rounded-2 flex items-end p-2 text-2.5 font-500 shadow-sm text-white"
               :class="`bg-amber-${n}`">
            {{ n }}
          </div>
        </div>
      </section>

      <!-- 2. Типографика -->
      <section id="typography" class="ds-section">
        <h2 class="ds-h2">Типографика</h2>
        <p class="ds-lead">Manrope для заголовков, Source Sans 3 для тела, Cormorant Garamond Italic для акцентных слов. Минимум <strong>16px</strong> для всех текстовых элементов сайта.</p>

        <div class="space-y-8">
          <div>
            <span class="text-label text-sand-500 block mb-2">H1 — Manrope 500</span>
            <h1 class="text-h1 text-sand-900">Место силы в горах Дагестана</h1>
            <code class="ds-code">.text-h1 = text-display + text-8 md:text-12 lg:text-14</code>
          </div>
          <div>
            <span class="text-label text-sand-500 block mb-2">H1 с акцентом — Cormorant Italic 500, 1.3em</span>
            <h1 class="text-h1 text-sand-900">Место <span class="section-title-accent">силы</span></h1>
            <code class="ds-code">.section-title-accent</code>
          </div>
          <div>
            <span class="text-label text-sand-500 block mb-2">H2</span>
            <h2 class="text-h2 text-sand-900">Номера <span class="section-title-accent">и категории</span></h2>
          </div>
          <div>
            <span class="text-label text-sand-500 block mb-2">H3</span>
            <h3 class="text-h3 text-sand-900">Люкс с панорамной спальней</h3>
          </div>
          <div>
            <span class="text-label text-sand-500 block mb-2">Body Large — Source Sans 3</span>
            <p class="text-body-lg text-sand-800 max-w-140">
              Пансионат Радде расположен на высоте 1700 метров в реликтовом лесу Гунибского района.
            </p>
          </div>
          <div>
            <span class="text-label text-sand-500 block mb-2">Body — Source Sans 3</span>
            <p class="text-body text-sand-700 max-w-140">
              Здесь вас ждут тёплое горское гостеприимство, вкусная домашняя кухня, чистейший горный воздух.
            </p>
          </div>
          <div>
            <span class="text-label text-sand-500 block mb-2">Small / Caption</span>
            <p class="text-small text-sand-600">Санузел в коридоре — один на два номера</p>
          </div>
          <div>
            <span class="text-label text-sand-500 block mb-2">Label (uppercase, tracking)</span>
            <span class="text-label text-olive-600">О пансионате</span>
            <span class="text-label text-sand-500 ml-6">Размещение</span>
            <span class="text-label text-amber-500 ml-6">Забронировать</span>
          </div>

          <!-- Намеренные исключения из 16px -->
          <div class="bg-amber-400/8 border border-amber-400/20 rounded-2 p-5 mt-6">
            <h4 class="text-body font-600 text-sand-900 mb-3">Исключения из правила 16px baseline</h4>
            <ul class="text-small text-sand-700 space-y-1.5 list-disc pl-5">
              <li><code>.text-label</code> — 14px uppercase tracking-widest (за счёт письма крупных и пробелов читается крупнее)</li>
              <li><code>.review-source</code> — мини-бейдж источника отзыва (Яндекс/2ГИС/Сайт), 14px</li>
              <li><code>.badge--included / --price</code> — бейдж в углу карточки услуги, 14px</li>
              <li><code>.blog-badge</code> — бейдж категории на фото статьи, 14px</li>
              <li><code>.footer-desc</code> — описание под лого футера, 13px</li>
              <li><code>.footer-meta</code> — copyright и Meta-disclaimer, 12px</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 3. Брейкпоинты -->
      <section id="breakpoints" class="ds-section">
        <h2 class="ds-h2">Брейкпоинты и адаптив</h2>
        <p class="ds-lead">5 точек в UnoCSS. Mobile-first: классы без префикса = mobile, <code>md:</code>/<code>lg:</code> прибавляют для крупных.</p>

        <div class="bg-white border border-sand-200 rounded-3 overflow-hidden mb-6">
          <table class="w-full text-body">
            <thead class="bg-sand-100 text-sand-800">
              <tr>
                <th class="text-left p-4 font-600">Префикс</th>
                <th class="text-left p-4 font-600">От, px</th>
                <th class="text-left p-4 font-600">Целевые устройства</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-sand-100 text-sand-700">
              <tr><td class="p-4"><code>xs:</code></td><td class="p-4">375</td><td class="p-4">Мелкие смартфоны (SE, Mini)</td></tr>
              <tr><td class="p-4"><code>sm:</code></td><td class="p-4">640</td><td class="p-4">Большие смартфоны</td></tr>
              <tr><td class="p-4"><code>md:</code></td><td class="p-4">768</td><td class="p-4">Планшеты — портрет</td></tr>
              <tr><td class="p-4"><code>lg:</code></td><td class="p-4">1024</td><td class="p-4">Планшеты-ландшафт, ноутбуки</td></tr>
              <tr><td class="p-4"><code>xl:</code></td><td class="p-4">1280</td><td class="p-4">Десктопы</td></tr>
            </tbody>
          </table>
        </div>

        <p class="text-small text-sand-700">
          Ширины тестирования: <strong>360–414</strong> mobile · <strong>768–834</strong> tablet · <strong>1280–1440</strong> laptop · <strong>1920</strong> desktop.
        </p>
      </section>

      <!-- 4. Грид и контейнер -->
      <section id="grid" class="ds-section">
        <h2 class="ds-h2">Контейнер и section-padding</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white border border-sand-200 rounded-3 p-6">
            <h3 class="ds-h3 mb-2">.container</h3>
            <p class="text-small text-sand-700 mb-3">Максимальная ширина контента с отступами по краям.</p>
            <code class="ds-code">max-w-1100px mx-auto px-5 md:px-8</code>
          </div>
          <div class="bg-white border border-sand-200 rounded-3 p-6">
            <h3 class="ds-h3 mb-2">.section-padding</h3>
            <p class="text-small text-sand-700 mb-3">Вертикальные отступы секций.</p>
            <code class="ds-code">py-20 md:py-26 (80 / 104px)</code>
          </div>
        </div>
      </section>

      <!-- ================== АТОМЫ ================== -->

      <!-- 5. Кнопки -->
      <section id="buttons" class="ds-section">
        <h2 class="ds-h2">Кнопки</h2>

        <h3 class="ds-h3">На светлом фоне</h3>
        <div class="flex flex-wrap gap-4 items-center mb-2">
          <button class="btn-primary">Забронировать</button>
          <button class="btn-secondary">Подробнее</button>
          <button class="btn-ghost">Как добраться</button>
        </div>
        <code class="ds-code">.btn-primary · .btn-secondary · .btn-ghost</code>

        <h3 class="ds-h3 mt-8">На тёмном фоне</h3>
        <div class="bg-sand-900 rounded-3 p-8 flex flex-wrap gap-4 items-center">
          <button class="btn bg-amber-500 text-white px-7 py-3.5 text-3.5 font-600 hover:bg-amber-600 rounded-2">Забронировать</button>
          <button class="btn bg-white/10 backdrop-blur-sm text-white border border-white/20 px-7 py-3.5 text-3.5 hover:bg-white/20 rounded-2">Подробнее</button>
          <button class="btn bg-transparent text-white/70 px-4 py-2 text-3.5 hover:text-white rounded-2">Ссылка</button>
        </div>
      </section>

      <!-- 6. Ссылки и ArrowLink -->
      <section id="links" class="ds-section">
        <h2 class="ds-h2">Ссылки со стрелкой — UiArrowLink</h2>
        <p class="ds-lead">Универсальная inline-ссылка с правой стрелкой. Заменяет повторяющийся паттерн в Intro, Blog, Faq и др.</p>

        <div class="space-y-4 mb-2">
          <UiArrowLink href="#" variant="amber">Узнать больше о Радде</UiArrowLink>
          <br/>
          <UiArrowLink href="#" variant="sand">Все статьи</UiArrowLink>
        </div>
        <code class="ds-code">&lt;UiArrowLink href="..." variant="amber|sand"&gt;Текст&lt;/UiArrowLink&gt;</code>
      </section>

      <!-- 7. Чипы -->
      <section id="chips" class="ds-section">
        <h2 class="ds-h2">Чипы — характеристики и удобства</h2>
        <p class="ds-lead">Используются в карточках номеров и везде, где нужно показать набор тегов.</p>

        <h3 class="ds-h3">Spec chip — выделенные характеристики</h3>
        <div class="flex flex-wrap gap-2 mb-2">
          <span class="spec-chip">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/>
              <path d="M2 7h14M7 2v14" stroke="currentColor" stroke-width="1.3"/>
            </svg>
            50 м²
          </span>
          <span class="spec-chip">King-size</span>
          <span class="spec-chip">до 4 гостей</span>
          <span class="spec-chip">Панорама на горы</span>
        </div>
        <code class="ds-code">.spec-chip — оливковый фон + olive-200 border + olive-700 текст</code>

        <h3 class="ds-h3 mt-6">Amenity chip — нейтральные теги</h3>
        <div class="flex flex-wrap gap-2 mb-2">
          <span class="amenity-chip">Wi-Fi</span>
          <span class="amenity-chip">Камин</span>
          <span class="amenity-chip">Балкон</span>
          <span class="amenity-chip">Мини-бар</span>
          <button class="amenity-chip amenity-chip--more">ещё 3</button>
        </div>
        <code class="ds-code">.amenity-chip · .amenity-chip--more</code>
      </section>

      <!-- 8. Поля ввода -->
      <section id="inputs" class="ds-section">
        <h2 class="ds-h2">Поля ввода</h2>

        <h3 class="ds-h3">Светлая тема — модалки, формы на светлом фоне</h3>
        <div class="max-w-100 space-y-4 mb-8">
          <div>
            <label class="label-light">Имя</label>
            <input type="text" placeholder="Как к вам обращаться" class="input-light" />
          </div>
          <div>
            <label class="label-light">Телефон</label>
            <input type="tel" placeholder="+7 (900) 000-00-00" class="input-light" />
          </div>
          <div>
            <label class="label-light">Комментарий</label>
            <textarea placeholder="Пожелания, вопросы..." class="input-light" style="height:auto;min-height:80px;padding:12px 16px;resize:vertical;line-height:1.5"></textarea>
          </div>
        </div>
        <code class="ds-code">.input-light · .label-light</code>

        <h3 class="ds-h3 mt-8">Тёмная тема — Hero booking, тёмные секции</h3>
        <div class="bg-sand-900 rounded-3 p-8 max-w-100 space-y-4 mb-2">
          <div>
            <label class="label-dark">Заезд</label>
            <input type="text" placeholder="02.04.2026" class="input-dark" />
          </div>
          <div>
            <label class="label-dark">Телефон</label>
            <input type="tel" placeholder="+7 (900) 000-00-00" class="input-dark" />
          </div>
        </div>
        <code class="ds-code">.input-dark · .label-dark</code>
      </section>

      <!-- 9. Этнический разделитель -->
      <section id="divider" class="ds-section">
        <h2 class="ds-h2">Этнический разделитель — UiEthnicDivider</h2>

        <h3 class="ds-h3">На светлом фоне</h3>
        <div class="bg-sand-50 rounded-2 border border-sand-200 mb-6">
          <UiEthnicDivider variant="light" />
        </div>

        <h3 class="ds-h3">На тёмном фоне</h3>
        <div class="bg-sand-900 rounded-2">
          <UiEthnicDivider :dark="true" />
        </div>
      </section>

      <!-- 10. Социальные иконки -->
      <section id="social" class="ds-section">
        <h2 class="ds-h2">Социальные иконки — UiSocialIcons</h2>
        <p class="ds-lead">Используются в бургер-меню (sm) и в футере контактов (md).</p>

        <h3 class="ds-h3">Размер sm — 44×44, для мобильного меню</h3>
        <div class="bg-sand-900 rounded-3 p-6 mb-6">
          <UiSocialIcons size="sm" />
        </div>

        <h3 class="ds-h3">Размер md — 48×48, кружок, для футера</h3>
        <div class="bg-sand-900 rounded-3 p-6">
          <UiSocialIcons size="md" :gap="4" />
        </div>
      </section>

      <!-- 11. Mobile action button -->
      <section id="mobile-action" class="ds-section">
        <h2 class="ds-h2">Mobile action button — .mobile-action-btn</h2>
        <p class="ds-lead">Кнопка-иконка 40×40 с обводкой. На lg+ автоматически скрыта (display: none). Используется в шапке для телефона/бургера на мобильных.</p>

        <div class="bg-sand-900 rounded-3 p-6 flex gap-3">
          <button class="mobile-action-btn" aria-label="Позвонить">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"/>
            </svg>
          </button>
          <button class="mobile-action-btn" aria-label="Меню">
            <div class="w-6 flex flex-col gap-1.5">
              <span class="block h-0.5 bg-white rounded w-6"></span>
              <span class="block h-0.5 bg-white rounded w-4 ml-auto"></span>
              <span class="block h-0.5 bg-white rounded w-5 ml-auto"></span>
            </div>
          </button>
        </div>
      </section>

      <!-- 12. Scroll hint -->
      <section id="scroll-hint" class="ds-section">
        <h2 class="ds-h2">Подсказка горизонтального скролла — UiScrollHint</h2>
        <p class="ds-lead">Пилюля под mobile-каруселями (Услуги, Галерея). Показывается ТОЛЬКО когда контент реально шире контейнера — отслеживается через ResizeObserver + проверка <code>scrollWidth &gt; clientWidth</code>.</p>

        <div class="flex justify-center mb-4">
          <UiScrollHint>Скролльте, чтобы увидеть все услуги</UiScrollHint>
        </div>
        <code class="ds-code">&lt;UiScrollHint v-show="isMobile && hasOverflow"&gt;...&lt;/UiScrollHint&gt;</code>
      </section>

      <!-- 13. Section header -->
      <section id="section-header" class="ds-section">
        <h2 class="ds-h2">Заголовок секции — UiSectionHeader</h2>
        <p class="ds-lead">Единый компонент для лейбла + h2 в каждой секции главной. Заменяет 9 повторов вручную.</p>

        <h3 class="ds-h3">Центрированный (по умолчанию)</h3>
        <div class="bg-white border border-sand-200 rounded-3 p-8 mb-6">
          <UiSectionHeader label="Размещение" title="Выберите" accent="номер" />
        </div>
        <code class="ds-code">&lt;UiSectionHeader label="Размещение" title="Выберите" accent="номер" /&gt;</code>

        <h3 class="ds-h3 mt-8">Слева — для split-layout (Reviews, Location)</h3>
        <div class="bg-white border border-sand-200 rounded-3 p-8 mb-6">
          <UiSectionHeader label="Отзывы гостей" title="Что говорят" accent="наши гости" align="left" />
        </div>

        <h3 class="ds-h3 mt-8">С кастомным slot — для сложного контента (Intro, Location)</h3>
        <div class="bg-white border border-sand-200 rounded-3 p-8 mb-6">
          <UiSectionHeader label="О пансионате" align="left">
            Реликтовый лес<br>
            <span class="section-title-accent">на высоте 1700 метров</span>
          </UiSectionHeader>
        </div>

        <h3 class="ds-h3 mt-8">Тёмная тема — на тёмном фоне (ContactFooter)</h3>
        <div class="bg-sand-900 rounded-3 p-8 mb-6">
          <UiSectionHeader label="Контакты" align="left" dark>
            Связаться<br>
            <span class="font-accent italic font-500 text-sand-400 text-[1.3em]">с нами</span>
          </UiSectionHeader>
        </div>

        <h3 class="ds-h3 mt-8">С actions справа от заголовка (Blog)</h3>
        <div class="bg-white border border-sand-200 rounded-3 p-8 mb-2">
          <UiSectionHeader label="Блог" align="left">
            <template #default>
              Полезное <span class="section-title-accent">о Радде</span>
            </template>
            <template #actions>
              <UiArrowLink href="#">Все статьи</UiArrowLink>
            </template>
          </UiSectionHeader>
        </div>
        <code class="ds-code">&lt;UiSectionHeader&gt; #default — h2 контент, #actions — справа от h2 &lt;/UiSectionHeader&gt;</code>
      </section>

      <!-- ================== КАРТОЧКИ ================== -->

      <!-- 14. Карточка номера -->
      <section id="room-card" class="ds-section">
        <h2 class="ds-h2">Карточка номера — UiRoomCard</h2>
        <p class="ds-lead">Полная карточка с фото-каруселью, чипами характеристик/удобств, ценой и CTA. Используется в Rooms.vue и будет использоваться на странице /rooms.</p>

        <UiRoomCard :room="demoRoom" @details="onDemo" @lightbox="onDemo" />
        <code class="ds-code mt-6 block">&lt;UiRoomCard :room="..." :reverse="..." @details="..." @lightbox="..." /&gt;</code>
      </section>

      <!-- 15. Карточка отзыва -->
      <section id="review-card" class="ds-section">
        <h2 class="ds-h2">Карточка отзыва — UiReviewCard</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-2">
          <UiReviewCard v-for="r in demoReviews" :key="r.id" :review="r" @open="onDemo" />
        </div>
        <code class="ds-code">&lt;UiReviewCard :review="..." @open="..." /&gt;</code>
      </section>

      <!-- 16. Карточка статьи -->
      <section id="blog-card" class="ds-section">
        <h2 class="ds-h2">Карточка блога — UiBlogCard</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-2">
          <UiBlogCard v-for="(p, i) in demoPosts" :key="i" :post="p" />
        </div>
        <code class="ds-code">&lt;UiBlogCard :post="..." :width="..." /&gt;</code>
      </section>

      <!-- 17. Карточка услуги -->
      <section id="service-card" class="ds-section">
        <h2 class="ds-h2">Карточка услуги — UiServiceCard</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-2">
          <UiServiceCard v-for="s in demoServices" :key="s.id" :service="s" @open="onDemo" />
        </div>
        <code class="ds-code">&lt;UiServiceCard :service="..." @open="..." /&gt;</code>
      </section>

      <!-- 18. УТП мозаика -->
      <section id="usp-card" class="ds-section">
        <h2 class="ds-h2">Карточка УТП — UiUspCard</h2>
        <p class="ds-lead">Фото-фон + градиент + контент в нижней части. Wide / narrow для grid-12 мозаики.</p>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 mb-2">
          <UiUspCard
            image="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80"
            title="Эмоциональная перезагрузка"
            description="Расположены в заповедном парке — далеко от городской суеты."
            wide
            class="md:col-span-7"
          />
          <UiUspCard
            image="https://images.unsplash.com/photo-1567532900872-f4e906cbf06a?w=800&q=80"
            title="Гастрономия"
            description="Домашняя кухня горного Дагестана."
            class="md:col-span-5"
          />
        </div>
        <code class="ds-code">&lt;UiUspCard image="..." title="..." description="..." :wide="..." /&gt;</code>
      </section>

      <!-- 19. FAQ Item -->
      <section id="faq-item" class="ds-section">
        <h2 class="ds-h2">FAQ — UiFaqItem</h2>

        <div class="max-w-160 space-y-3 mb-2">
          <UiFaqItem
            v-for="(q, i) in demoFaqs"
            :key="i"
            :question="q.question"
            :answer="q.answer"
            :open="dsOpenFaq === i"
            @toggle="dsOpenFaq = dsOpenFaq === i ? null : i"
          />
        </div>
        <code class="ds-code">&lt;UiFaqItem :question="..." :answer="..." :open="..." @toggle="..." /&gt;</code>
      </section>

      <!-- 20. Tip card -->
      <section id="tip-card" class="ds-section">
        <h2 class="ds-h2">Карточка совета — UiTipCard</h2>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
          <UiTipCard
            v-for="t in demoTips"
            :key="t.title"
            :icon="t.icon"
            :title="t.title"
            :text="t.text"
          />
        </div>
        <code class="ds-code">&lt;UiTipCard :icon="..." :title="..." :text="..." /&gt;</code>
      </section>

      <!-- 21. Route card -->
      <section id="route-card" class="ds-section">
        <h2 class="ds-h2">Карточка маршрута — UiRouteCard</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
          <UiRouteCard v-for="r in demoRoutes" :key="r.id" :route="r" @open="onDemo" />
        </div>
        <code class="ds-code">&lt;UiRouteCard :route="..." @open="..." /&gt;</code>
      </section>

      <!-- ================== ПАТТЕРНЫ ================== -->

      <!-- 22. Mobile horizontal scroll -->
      <section id="mobile-scroll" class="ds-section">
        <h2 class="ds-h2">Mobile-горизонтальный скролл</h2>
        <p class="ds-lead">Используется в Услугах и Галерее. На mobile (≤767px) грид превращается в горизонтальную ленту.</p>

        <div class="bg-white border border-sand-200 rounded-3 p-6">
          <h4 class="text-body font-600 text-sand-900 mb-3">Рецепт</h4>
          <ol class="text-small text-sand-700 space-y-2 list-decimal pl-5">
            <li>На mobile (max-width: 767px): <code>display: flex; overflow-x: auto; scroll-snap-type: x mandatory</code></li>
            <li>Карточка: <code>flex: 0 0 78%; max-width: 320px; scroll-snap-align: start</code> — даёт peek справа</li>
            <li>Edge-to-edge через отрицательные margin: <code>margin: 0 -20px; padding: 0 20px</code></li>
            <li>Скрыть scrollbar: <code>scrollbar-width: none; ::-webkit-scrollbar { display: none }</code></li>
            <li>Под лентой — <code>UiScrollHint</code> с условием <code>v-show="isMobile && hasOverflow"</code> (через ResizeObserver)</li>
            <li>На md+ возвращаем grid: <code>display: grid; grid-template-columns: 1fr 1fr (1fr); overflow: visible; margin: 0; padding: 0</code></li>
          </ol>
        </div>
      </section>

      <!-- 23. iOS Hero fix -->
      <section id="app-height" class="ds-section">
        <h2 class="ds-h2">iOS Hero фикс — --app-height</h2>
        <p class="ds-lead">CSS-переменная <code>--app-height</code> хранит реальную высоту viewport. Решает прыжок Hero при сжатии адресной строки в iOS Safari (где <code>100vh</code> и <code>100svh</code> ведут себя нестабильно на iOS &lt;15.4).</p>

        <div class="bg-white border border-sand-200 rounded-3 p-6">
          <h4 class="text-body font-600 text-sand-900 mb-3">Как работает</h4>
          <ol class="text-small text-sand-700 space-y-2 list-decimal pl-5 mb-4">
            <li>В <code>app.vue</code> при <code>onMounted</code> снимаем <code>window.innerHeight</code> и пишем в CSS-переменную <code>--app-height</code></li>
            <li>Повторно через <code>setTimeout(200)</code> — iOS отдаёт финальный <code>innerHeight</code> только после первого кадра</li>
            <li>Подписываемся ТОЛЬКО на <code>orientationchange</code>, НЕ на <code>resize</code>/<code>scroll</code> — иначе вернётся прыжок</li>
            <li>В Hero: <code>min-height: var(--app-height, 100svh)</code> с тройным fallback</li>
          </ol>
          <code class="ds-code">var(--app-height, 100svh)</code>
        </div>
      </section>

      <!-- 24. Animations -->
      <section id="animations" class="ds-section">
        <h2 class="ds-h2">Анимации переходов</h2>
        <p class="ds-lead">Единые transition-классы из <code>global.css</code> для всех popup'ов и dropdown'ов.</p>

        <div class="grid md:grid-cols-2 gap-4 mb-2">
          <div class="bg-white border border-sand-200 rounded-2 p-5">
            <h4 class="text-body font-600 text-sand-900 mb-1">popup-*</h4>
            <p class="text-small text-sand-700">Модалки. scale(0.95) + translateY(10px) → scale(1), 0.3s cubic-bezier</p>
          </div>
          <div class="bg-white border border-sand-200 rounded-2 p-5">
            <h4 class="text-body font-600 text-sand-900 mb-1">dropdown-*</h4>
            <p class="text-small text-sand-700">Выпадающие меню. opacity(0) + translateY(-6px) → normal, 0.2s</p>
          </div>
          <div class="bg-white border border-sand-200 rounded-2 p-5">
            <h4 class="text-body font-600 text-sand-900 mb-1">slide-*</h4>
            <p class="text-small text-sand-700">Мобильное меню. opacity(0) + translateY(-8px) → normal, 0.3s</p>
          </div>
          <div class="bg-white border border-sand-200 rounded-2 p-5">
            <h4 class="text-body font-600 text-sand-900 mb-1">backdrop-*</h4>
            <p class="text-small text-sand-700">Затемнение фона модалок. opacity 0 → 1, 0.3s</p>
          </div>
          <div class="bg-white border border-sand-200 rounded-2 p-5 md:col-span-2">
            <h4 class="text-body font-600 text-sand-900 mb-1">GSAP ScrollTrigger.revealUp()</h4>
            <p class="text-small text-sand-700">Появление при скролле. translateY(60px) + opacity(0) → normal, 1s power3.out, trigger top 85%</p>
          </div>
        </div>
      </section>

      <!-- 25. Media controls -->
      <section id="media-controls" class="ds-section">
        <h2 class="ds-h2">Media controls — стрелки и точки</h2>
        <p class="ds-lead">Единые стрелки (32×32) и точки (8px) для всех галерей и каруселей: Hero, Rooms, Reviews, Blog, Lightbox.</p>

        <h3 class="ds-h3">Тёмная (поверх фото)</h3>
        <div class="bg-sand-200 rounded-2 p-6 flex gap-2 mb-6">
          <button class="media-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="media-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <div class="flex items-center gap-1.5 ml-4">
            <button class="media-dot bg-white w-5"></button>
            <button class="media-dot bg-white/50 w-2"></button>
            <button class="media-dot bg-white/50 w-2"></button>
          </div>
        </div>

        <h3 class="ds-h3">Светлая (внутри секции)</h3>
        <div class="bg-white border border-sand-200 rounded-2 p-6 flex gap-2">
          <button class="media-arrow media-arrow--light"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="media-arrow media-arrow--light"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <div class="flex items-center gap-1.5 ml-4">
            <button class="media-dot bg-sand-800 w-5"></button>
            <button class="media-dot bg-sand-300 w-2"></button>
            <button class="media-dot bg-sand-300 w-2"></button>
          </div>
        </div>
      </section>

      <!-- 26. Logo -->
      <section id="logo" class="ds-section">
        <h2 class="ds-h2">Логотип</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-3 border border-sand-200 p-8 flex items-center justify-center">
            <img :src="`${base}images/logo-color.png`" alt="Логотип цветной" class="h-28 w-auto" />
          </div>
          <div class="bg-sand-900 rounded-3 p-8 flex items-center justify-center">
            <img :src="`${base}images/logo-white.png`" alt="Логотип белый" class="h-28 w-auto" />
          </div>
          <div class="bg-sand-200 rounded-3 p-8 flex items-center justify-center">
            <img :src="`${base}images/logo-color.png`" alt="Логотип на бежевом" class="h-28 w-auto" />
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { Room } from '../components/ui/RoomCard.vue'
import type { Review } from '../components/ui/ReviewCard.vue'
import type { BlogPost } from '../components/ui/BlogCard.vue'
import type { Service } from '../components/ui/ServiceCard.vue'
import type { RouteCardData } from '../components/ui/RouteCard.vue'

useHead({
  title: 'Дизайн-система — Радде',
})

const base = useRuntimeConfig().app.baseURL || '/'

const sandShades = ['50','100','200','300','400','500','600','700','800','900']
const oliveShades = ['50','100','200','300','400','500','600','700','800','900']

const sections = [
  { id: 'colors', title: 'Цвета' },
  { id: 'typography', title: 'Типографика' },
  { id: 'breakpoints', title: 'Брейкпоинты' },
  { id: 'grid', title: 'Контейнер' },
  { id: 'buttons', title: 'Кнопки' },
  { id: 'links', title: 'ArrowLink' },
  { id: 'chips', title: 'Чипы' },
  { id: 'inputs', title: 'Поля ввода' },
  { id: 'divider', title: 'Разделитель' },
  { id: 'social', title: 'Соцсети' },
  { id: 'mobile-action', title: 'Mobile action' },
  { id: 'scroll-hint', title: 'Scroll hint' },
  { id: 'section-header', title: 'SectionHeader' },
  { id: 'room-card', title: 'RoomCard' },
  { id: 'review-card', title: 'ReviewCard' },
  { id: 'blog-card', title: 'BlogCard' },
  { id: 'service-card', title: 'ServiceCard' },
  { id: 'usp-card', title: 'UspCard' },
  { id: 'faq-item', title: 'FaqItem' },
  { id: 'tip-card', title: 'TipCard' },
  { id: 'route-card', title: 'RouteCard' },
  { id: 'mobile-scroll', title: 'Mobile scroll' },
  { id: 'app-height', title: '--app-height' },
  { id: 'animations', title: 'Анимации' },
  { id: 'media-controls', title: 'Media controls' },
  { id: 'logo', title: 'Логотип' },
]

const dsOpenFaq = ref<number | null>(0)

const demoRoom = reactive<Room>({
  name: 'Люкс с панорамной спальней',
  area: 35,
  bed: 'King-size',
  guests: 3,
  view: 'Панорама на горы',
  price: '7 000',
  description: 'Панорамные окна от пола до потолка. Просыпаетесь с видом на горные вершины и реликтовый лес — незабываемое начало каждого дня.',
  fullDescription: 'Полное описание...',
  note: '',
  tags: ['Панорамные окна', 'Терраса', 'Дождевой душ', 'Собственный санузел', 'Мини-бар', 'Кресло у окна'],
  images: [`${base}images/rooms/panorama/1.jpg`],
  activePhoto: 0,
})

const demoReviews: Review[] = [
  { id: 'd1', source: 'yandex', author: 'Алина М.', rating: 5, date: 'Март 2026', text: 'Невероятное место! Тишина, чистый воздух, вкуснейшая еда. Дети были в восторге.', fullText: 'Полная версия...' },
  { id: 'd2', source: '2gis', author: 'Руслан К.', rating: 5, date: 'Февраль 2026', text: 'Приехали на выходные и не хотели уезжать. Виды из окон просто космос.' },
  { id: 'd3', source: 'site', author: 'Мария Д.', rating: 5, date: 'Январь 2026', text: 'Идеальное место для перезагрузки. Никакого шума, только птицы и ветер.' },
]

const demoPosts: BlogPost[] = [
  { title: 'Как добраться до пансионата Радде', excerpt: 'Подробная инструкция: маршруты из Махачкалы, трансфер, что учесть в дороге.', category: 'Путешествие', readTime: '5 мин чтения', image: `${base}images/hero/hero-3.jpg`, href: '#' },
  { title: 'Достопримечательности Гунибского района', excerpt: 'Гунибская крепость, водопады, каньоны и другие места.', category: 'Что посмотреть', readTime: '7 мин чтения', image: `${base}images/usp/landmarks/1.jpg`, href: '#' },
  { title: 'Семейный отдых в горах Дагестана', excerpt: 'Чем заняться с детьми, безопасность, питание.', category: 'Семейный', readTime: '6 мин чтения', image: `${base}images/usp/nature/1.jpg`, href: '#' },
]

const demoServices: Service[] = [
  { id: 's1', category: 'food', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1"/><path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"/><path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"/><path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5"/></svg>', title: 'Завтрак', description: 'Сытный домашний завтрак из местных продуктов.', included: true, price: '', duration: '8:00 — 10:00', format: '' },
  { id: 's2', category: 'active', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612"/><path d="M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2"/></svg>', title: 'Экскурсии', description: 'Индивидуальные и групповые поездки по Гунибскому району.', included: false, price: 'от 2 000 ₽', duration: '2-8 часов', format: 'группы' },
  { id: 's3', category: 'wellness', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1"/><path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25"/></svg>', title: 'Сауна и баня', description: 'Русская баня на дровах и финская сауна с видом на лес.', included: false, price: 'от 2 000 ₽', duration: '2 часа', format: 'до 6 чел.' },
]

const demoFaqs = [
  { question: 'Как добраться до пансионата?', answer: 'Из аэропорта Махачкалы — 3-4 часа на автомобиле. Мы можем организовать трансфер.' },
  { question: 'Есть ли питание?', answer: 'Да, мы предлагаем трёхразовое питание из местных продуктов.' },
]

const demoTips = [
  { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18l.01 0"/><path d="M9.172 15.172a4 4 0 015.656 0"/><path d="M6.343 12.343a8 8 0 0111.314 0"/><path d="M3.515 9.515c4.686-4.687 12.284-4.687 17 0"/></svg>', title: 'Связь', text: 'МТС и Мегафон работают.' },
  { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"/></svg>', title: 'Деньги', text: 'Возьмите 2–5 тыс. ₽ наличными.' },
  { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 18v-6a6 6 0 016-6h2a6 6 0 016 6v6"/></svg>', title: 'Одежда', text: 'Берите тёплый слой и ветровку.' },
  { icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>', title: '3 часа в пути', text: 'От Махачкалы до пансионата.' },
]

const demoRoutes: RouteCardData[] = [
  { id: 'd-airport', label: 'Из аэропорта', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15.157 11.81l4.83 1.295a2 2 0 1 1-1.036 3.863l-14.489-3.882-1.345-6.572 2.898.776 1.414 2.45 2.898.776-.12-7.279 2.898.777 2.052 7.797"/></svg>', iconBg: 'bg-blue-50 text-blue-500', summary: 'Рейсы из Москвы и Петербурга, далее такси или трансфер.', time: '', title: '', detailsHtml: '' },
  { id: 'd-car', label: 'На автомобиле', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17a2 2 0 104 0 2 2 0 00-4 0"/><path d="M15 17a2 2 0 104 0 2 2 0 00-4 0"/><path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 012 2v4"/></svg>', iconBg: 'bg-amber-50 text-amber-600', summary: 'По трассе Р217 через Буйнакск.', time: '', title: '', detailsHtml: '' },
]

function onDemo() {
  // no-op для демонстрации
}
</script>

<style scoped>
.ds-section {
  margin-bottom: 5rem;
  padding-top: 1rem;
  scroll-margin-top: 6rem;
}

.ds-h2 {
  font-family: 'Manrope', system-ui, sans-serif;
  font-weight: 500;
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  color: #2C2416;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #F0E6D6;
}

.ds-h3 {
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6B5B4A;
  margin-bottom: 1rem;
}

.ds-lead {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #4A3F30;
  margin-bottom: 1.5rem;
  max-width: 70ch;
}

.ds-code {
  display: inline-block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  background: #2C2416;
  color: #F0E6D6;
  padding: 6px 10px;
  border-radius: 6px;
  margin-top: 4px;
  word-break: break-all;
}
</style>
