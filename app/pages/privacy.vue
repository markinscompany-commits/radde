<template>
  <div>
    <UiAppHeader solid @book="showBooking = true" />

    <!-- Хлебная крошка + заголовок -->
    <section class="bg-sand-50 pt-32 md:pt-40 pb-12 md:pb-16">
      <div class="container">
        <a :href="base" class="inline-flex items-center gap-2 text-small text-sand-700 hover:text-amber-600 transition-colors mb-6">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 12L3 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          На главную
        </a>
        <span class="text-label text-olive-600 mb-4 block">Документы</span>
        <h1 class="text-h1 text-sand-900 mb-5 max-w-180">
          Политика <span class="section-title-accent">конфиденциальности</span>
        </h1>
        <p class="text-body-lg text-sand-700 max-w-130">
          Мы бережно относимся к личным данным гостей пансионата. На этой странице — что и зачем мы собираем, сколько храним и как вы можете удалить свои данные.
        </p>
        <span class="text-small text-sand-600 block mt-6">Редакция от 2&nbsp;мая 2026&nbsp;г.</span>
      </div>
    </section>

    <!-- Содержание -->
    <section class="bg-sand-50 pb-20 md:pb-26">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- TOC -->
          <aside class="lg:col-span-4">
            <div class="lg:sticky lg:top-28 bg-white border border-sand-200 rounded-3 p-5">
              <span class="text-label text-sand-500 mb-4 block">Содержание</span>
              <ol class="flex flex-col gap-2.5">
                <li v-for="(s, i) in sections" :key="s.id">
                  <a :href="`#${s.id}`" class="toc-link">
                    <span class="toc-num">{{ i + 1 }}</span>
                    {{ s.title }}
                  </a>
                </li>
              </ol>
            </div>
          </aside>

          <!-- Тело -->
          <article class="lg:col-span-8 prose-radde">
            <section id="general" class="prose-section">
              <h2>1. Общие положения</h2>
              <p>
                Настоящая политика регулирует обработку персональных данных гостей и&nbsp;посетителей сайта пансионата Радде. Оператор данных — пансионат Радде, расположенный по&nbsp;адресу: {{ contacts.address.full }}.
              </p>
              <p>
                Используя сайт и&nbsp;оставляя на&nbsp;нём заявки, вы&nbsp;подтверждаете, что ознакомились с&nbsp;этой политикой и&nbsp;даёте согласие на&nbsp;обработку ваших персональных данных в&nbsp;объёме и&nbsp;на&nbsp;условиях, описанных ниже.
              </p>
            </section>

            <section id="data" class="prose-section">
              <h2>2. Какие данные мы собираем</h2>
              <ul>
                <li>имя, по&nbsp;которому к&nbsp;вам обращаться;</li>
                <li>номер телефона и&nbsp;адрес электронной почты;</li>
                <li>даты заезда и&nbsp;выезда, состав гостей (взрослые, дети);</li>
                <li>текст сообщения или&nbsp;комментария к&nbsp;заявке;</li>
                <li>технические данные браузера и&nbsp;cookie&nbsp;— анонимная статистика посещений.</li>
              </ul>
              <p>
                Мы&nbsp;не&nbsp;собираем паспортные данные через сайт. Документы для&nbsp;поселения предъявляются непосредственно на&nbsp;ресепшн пансионата.
              </p>
            </section>

            <section id="purpose" class="prose-section">
              <h2>3. Зачем мы используем данные</h2>
              <ul>
                <li>чтобы связаться с&nbsp;вами по&nbsp;заявке и&nbsp;уточнить детали проживания;</li>
                <li>чтобы забронировать выбранный номер и&nbsp;подтвердить даты;</li>
                <li>чтобы организовать трансфер, экскурсии и&nbsp;дополнительные услуги, если вы&nbsp;их&nbsp;заказали;</li>
                <li>чтобы соблюдать требования российского законодательства в&nbsp;сфере гостиничной деятельности;</li>
                <li>чтобы улучшать сайт и&nbsp;сервис на&nbsp;основе обезличенной статистики.</li>
              </ul>
            </section>

            <section id="storage" class="prose-section">
              <h2>4. Сроки и место хранения</h2>
              <p>
                Заявки и&nbsp;контакты, полученные через сайт, хранятся в&nbsp;информационных системах оператора на&nbsp;серверах, расположенных на&nbsp;территории Российской Федерации. Срок хранения — до&nbsp;3&nbsp;лет с&nbsp;даты обращения, после чего данные удаляются или&nbsp;обезличиваются.
              </p>
              <p>
                Данные о&nbsp;состоявшемся проживании хранятся в&nbsp;объёме и&nbsp;в&nbsp;сроки, предусмотренные требованиями к&nbsp;средствам размещения в&nbsp;Российской Федерации.
              </p>
            </section>

            <section id="sharing" class="prose-section">
              <h2>5. Передача третьим лицам</h2>
              <p>
                Мы&nbsp;не&nbsp;продаём и&nbsp;не&nbsp;передаём ваши данные сторонним компаниям в&nbsp;маркетинговых целях. Передача возможна только в&nbsp;следующих случаях:
              </p>
              <ul>
                <li>сервисам, обеспечивающим работу сайта и&nbsp;бронирования (хостинг, система управления бронями), в&nbsp;объёме, необходимом для&nbsp;их&nbsp;функционирования;</li>
                <li>государственным органам по&nbsp;запросу в&nbsp;рамках действующего законодательства;</li>
                <li>с&nbsp;вашего отдельного согласия — например, для&nbsp;организации трансфера через стороннего перевозчика.</li>
              </ul>
            </section>

            <section id="rights" class="prose-section">
              <h2>6. Ваши права</h2>
              <p>Вы&nbsp;в&nbsp;любой момент можете:</p>
              <ul>
                <li>запросить, какие именно ваши данные мы&nbsp;храним;</li>
                <li>попросить уточнить или&nbsp;исправить данные;</li>
                <li>отозвать согласие и&nbsp;потребовать удалить данные, если их&nbsp;хранение не&nbsp;обязательно по&nbsp;закону;</li>
                <li>отказаться от&nbsp;информационных рассылок, если вы&nbsp;на&nbsp;них подписывались.</li>
              </ul>
            </section>

            <section id="cookies" class="prose-section">
              <h2>7. Cookie и аналитика</h2>
              <p>
                Сайт использует cookie-файлы для&nbsp;корректной работы интерфейса и&nbsp;сбора обезличенной статистики посещений. Вы&nbsp;можете отключить cookie в&nbsp;настройках браузера&nbsp;— часть функциональности сайта при&nbsp;этом может работать ограниченно.
              </p>
            </section>

            <section id="contact" class="prose-section">
              <h2>8. Как с нами связаться</h2>
              <p>
                По&nbsp;любым вопросам, связанным с&nbsp;обработкой персональных данных, пишите на&nbsp;<a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a> или&nbsp;звоните по&nbsp;телефону <a :href="`tel:${contacts.phone.tel}`">{{ contacts.phone.display }}</a>. Мы&nbsp;ответим в&nbsp;разумный срок и&nbsp;поможем разобраться.
              </p>
              <p>
                Также вы&nbsp;можете оставить запрос через <a :href="`${base}contacts`">страницу контактов</a>&nbsp;— мы&nbsp;свяжемся первыми.
              </p>
            </section>

            <section id="changes" class="prose-section">
              <h2>9. Изменения политики</h2>
              <p>
                Мы&nbsp;можем уточнять политику&nbsp;— например, при&nbsp;изменениях в&nbsp;законодательстве или&nbsp;при&nbsp;появлении новых сервисов на&nbsp;сайте. Актуальная редакция всегда доступна по&nbsp;этой ссылке. Дата последнего обновления указана в&nbsp;начале страницы.
              </p>
            </section>
          </article>
        </div>
      </div>
    </section>

    <UiSiteFooter />

    <UiBookingModal v-model="showBooking" />
  </div>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
const contacts = useContacts()
const showBooking = ref(false)

const sections = [
  { id: 'general', title: 'Общие положения' },
  { id: 'data', title: 'Какие данные собираем' },
  { id: 'purpose', title: 'Зачем используем' },
  { id: 'storage', title: 'Сроки и место хранения' },
  { id: 'sharing', title: 'Передача третьим лицам' },
  { id: 'rights', title: 'Ваши права' },
  { id: 'cookies', title: 'Cookie и аналитика' },
  { id: 'contact', title: 'Как с нами связаться' },
  { id: 'changes', title: 'Изменения политики' },
]

useHead({
  title: 'Политика конфиденциальности — Пансионат Радде',
  meta: [
    { name: 'description', content: 'Как пансионат Радде обрабатывает и хранит персональные данные гостей и посетителей сайта.' },
    { name: 'robots', content: 'noindex, follow' },
  ],
})
</script>

<style scoped>
.toc-link {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  color: #6B5B4A;
  text-decoration: none;
  transition: color 0.2s;
  line-height: 1.4;
  scroll-margin-top: 6rem;
}
.toc-link:hover {
  color: #C17F3E;
}
.toc-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #FAF6F0;
  color: #8B6F47;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.prose-section {
  scroll-margin-top: 6rem;
}
.prose-section + .prose-section {
  margin-top: 2.5rem;
}

.prose-radde :deep(h2) {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: clamp(1.4rem, 2.4vw, 1.8rem);
  color: #2C2416;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.prose-radde :deep(p) {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 17px;
  line-height: 1.7;
  color: #4A3F2E;
  margin-bottom: 1rem;
}

.prose-radde :deep(ul) {
  list-style: none;
  padding-left: 0;
  margin-bottom: 1rem;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 17px;
  line-height: 1.65;
  color: #4A3F2E;
}
.prose-radde :deep(li) {
  position: relative;
  padding-left: 22px;
  margin-bottom: 0.5rem;
}
.prose-radde :deep(li::before) {
  content: '';
  position: absolute;
  left: 6px;
  top: 0.7em;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #C17F3E;
}

.prose-radde :deep(a) {
  color: #A66B32;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgba(166, 107, 50, 0.3);
  transition: color 0.2s, text-decoration-color 0.2s;
}
.prose-radde :deep(a:hover) {
  color: #8B5728;
  text-decoration-color: #A66B32;
}
</style>
