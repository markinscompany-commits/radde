<template>
  <div>
    <UiAppHeader solid @book="showBooking = true" />

    <!-- Хлебная крошка + заголовок -->
    <section class="bg-sand-50 pt-32 md:pt-40 pb-12 md:pb-16">
      <div class="container">
        <UiBreadcrumbs
          variant="light"
          :items="[
            { label: 'Главная', href: base },
            { label: 'Политика конфиденциальности' },
          ]"
          class="mb-6"
        />
        <h1 class="text-h1 text-sand-900 mb-5 max-w-180">
          Политика <span class="section-title-accent">конфиденциальности</span>
        </h1>
        <p class="text-body-lg text-sand-700 max-w-130">
          Мы бережно относимся к личным данным гостей пансионата. На этой странице — что и зачем мы собираем, сколько храним и как вы можете удалить свои данные.
        </p>
        <span class="text-small text-sand-600 block mt-6">Редакция от 4&nbsp;июня 2026&nbsp;г.</span>
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
                Настоящая политика разработана в&nbsp;соответствии с&nbsp;Федеральным законом от&nbsp;27.07.2006 №&nbsp;152-ФЗ «О&nbsp;персональных данных» (с&nbsp;учётом изменений Федерального закона от&nbsp;30.11.2024 №&nbsp;420-ФЗ) и&nbsp;определяет порядок обработки и&nbsp;защиты персональных данных посетителей сайта radde.ru.
              </p>
              <p><strong>Оператор персональных данных:</strong></p>
              <ul>
                <li>Наименование: {{ contacts.legal.entityName }}</li>
                <li>ИНН: {{ contacts.legal.inn }}</li>
                <li>ОГРН/ОГРНИП: {{ contacts.legal.ogrn }}</li>
                <li>Адрес: {{ contacts.legal.address }}</li>
                <li>Email для&nbsp;вопросов о&nbsp;персональных данных: <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a></li>
                <li>Телефон: <a :href="`tel:${contacts.phone.tel}`">{{ contacts.phone.display }}</a></li>
              </ul>
              <p>
                Используя сайт и&nbsp;оставляя на&nbsp;нём заявки, вы&nbsp;подтверждаете, что ознакомились с&nbsp;этой политикой и&nbsp;даёте согласие на&nbsp;обработку ваших персональных данных в&nbsp;объёме и&nbsp;на&nbsp;условиях, описанных ниже.
              </p>
            </section>

            <section id="data" class="prose-section">
              <h2>2. Состав обрабатываемых данных</h2>
              <p>В&nbsp;зависимости от&nbsp;используемой формы оператор может обрабатывать:</p>
              <ul>
                <li>фамилию, имя&nbsp;и&nbsp;при&nbsp;желании отчество гостя;</li>
                <li>номер телефона и&nbsp;адрес электронной почты;</li>
                <li>город проживания (откуда едет гость) — для&nbsp;планирования трансфера;</li>
                <li>даты заезда и&nbsp;выезда, состав гостей (взрослые, дети);</li>
                <li>выбранную категорию номера и&nbsp;дополнительные услуги;</li>
                <li>текст сообщения или&nbsp;комментария к&nbsp;заявке;</li>
                <li>обезличенные технические данные: IP-адрес, файлы cookie, информация о&nbsp;браузере и&nbsp;устройстве, источник перехода.</li>
              </ul>
              <p>
                Биометрические и&nbsp;паспортные данные через сайт не&nbsp;собираются. Документы для&nbsp;поселения предъявляются непосредственно на&nbsp;ресепшн пансионата согласно требованиям Постановления Правительства РФ №&nbsp;1912 от&nbsp;27.11.2025 (в&nbsp;силе с&nbsp;01.03.2026).
              </p>
            </section>

            <section id="purpose" class="prose-section">
              <h2>3. Цели обработки</h2>
              <ul>
                <li>оформление и&nbsp;подтверждение заявки на&nbsp;бронирование, связь с&nbsp;гостем по&nbsp;уточняющим вопросам;</li>
                <li>организация заселения, трансфера, экскурсий и&nbsp;иных услуг, заказанных гостем;</li>
                <li>оказание услуг средства размещения в&nbsp;соответствии с&nbsp;Постановлением Правительства РФ №&nbsp;1912;</li>
                <li>исполнение обязанностей оператора по&nbsp;152-ФЗ и&nbsp;иным актам РФ (налоговый учёт, ведение реестра проживающих);</li>
                <li>улучшение работы сайта на&nbsp;основе обезличенной статистики.</li>
              </ul>
            </section>

            <section id="legal" class="prose-section">
              <h2>4. Правовые основания</h2>
              <p>Обработка персональных данных осуществляется на&nbsp;следующих основаниях:</p>
              <ul>
                <li>согласие субъекта персональных данных, выраженное путём проставления отметки в&nbsp;форме на&nbsp;сайте (ч.&nbsp;1 ст.&nbsp;6, ст.&nbsp;9 152-ФЗ);</li>
                <li>заключение и&nbsp;исполнение договора оказания гостиничных услуг, стороной которого является субъект (п.&nbsp;5 ч.&nbsp;1 ст.&nbsp;6 152-ФЗ);</li>
                <li>исполнение обязанностей, возложенных на&nbsp;оператора законодательством РФ (п.&nbsp;2 ч.&nbsp;1 ст.&nbsp;6 152-ФЗ).</li>
              </ul>
            </section>

            <section id="storage" class="prose-section">
              <h2>5. Сроки и место хранения</h2>
              <p>
                Все персональные данные, собираемые через сайт, хранятся в&nbsp;информационных системах оператора и&nbsp;его процессоров, расположенных на&nbsp;серверах в&nbsp;Российской Федерации (требование п.&nbsp;5 ст.&nbsp;18 152-ФЗ&nbsp;— обязательная локализация).
              </p>
              <p>
                Срок хранения заявок и&nbsp;контактов, полученных через сайт, — до&nbsp;3&nbsp;лет с&nbsp;даты обращения, после чего данные удаляются или&nbsp;обезличиваются. Данные о&nbsp;состоявшемся проживании хранятся в&nbsp;соответствии с&nbsp;требованиями к&nbsp;средствам размещения и&nbsp;налоговым законодательством.
              </p>
            </section>

            <section id="sharing" class="prose-section">
              <h2>6. Передача третьим лицам</h2>
              <p>
                Оператор не&nbsp;продаёт и&nbsp;не&nbsp;передаёт персональные данные сторонним компаниям в&nbsp;маркетинговых целях. Передача возможна только в&nbsp;следующих случаях:
              </p>
              <ul>
                <li>в&nbsp;систему управления бронированием Bnovo (сервис, обеспечивающий шахматку номеров и&nbsp;статусы броней) — на&nbsp;серверах в&nbsp;РФ;</li>
                <li>в&nbsp;счётчик веб-аналитики Яндекс.Метрика (ООО «Яндекс») — обезличенные данные о&nbsp;поведении на&nbsp;сайте, серверы в&nbsp;РФ;</li>
                <li>в&nbsp;виджет Яндекс.Карт для&nbsp;отображения местоположения пансионата;</li>
                <li>государственным органам по&nbsp;запросу в&nbsp;рамках действующего законодательства;</li>
                <li>с&nbsp;вашего отдельного согласия — например, для&nbsp;организации трансфера через стороннего перевозчика.</li>
              </ul>
              <p>
                Трансграничная передача персональных данных в&nbsp;иностранные государства не&nbsp;осуществляется.
              </p>
            </section>

            <section id="rights" class="prose-section">
              <h2>7. Права субъекта персональных данных</h2>
              <p>В&nbsp;соответствии со&nbsp;ст.&nbsp;14, 15, 17 152-ФЗ&nbsp;вы&nbsp;вправе:</p>
              <ul>
                <li>получить сведения о&nbsp;факте обработки и&nbsp;её&nbsp;целях;</li>
                <li>требовать уточнения, блокирования или&nbsp;уничтожения некорректных или&nbsp;незаконно обрабатываемых данных;</li>
                <li>отозвать согласие на&nbsp;обработку в&nbsp;любой момент — направив письменный запрос на&nbsp;email <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a>;</li>
                <li>обжаловать действия или&nbsp;бездействие оператора в&nbsp;Роскомнадзор (<a href="https://rkn.gov.ru" target="_blank" rel="noopener">rkn.gov.ru</a>) или&nbsp;в&nbsp;суд.</li>
              </ul>
              <p>
                Запросы рассматриваются в&nbsp;30-дневный срок с&nbsp;момента получения.
              </p>
            </section>

            <section id="cookies" class="prose-section">
              <h2>8. Cookie и веб-аналитика</h2>
              <p>
                Сайт использует cookie-файлы трёх категорий:
              </p>
              <ul>
                <li><strong>Технические</strong> — необходимы для&nbsp;работы сайта (сессия, форма бронирования, выбор языка). Используются без&nbsp;согласия.</li>
                <li><strong>Аналитические</strong> — Яндекс.Метрика, обезличенная статистика посещений. Подключаются после&nbsp;вашего согласия в&nbsp;cookie-баннере.</li>
                <li><strong>Маркетинговые</strong> — пиксели рекламных систем (при&nbsp;их&nbsp;использовании). Подключаются после&nbsp;вашего согласия в&nbsp;cookie-баннере.</li>
              </ul>
              <p>
                Управлять согласием можно через cookie-баннер при&nbsp;первом визите или&nbsp;удалив cookie в&nbsp;настройках браузера&nbsp;— баннер появится снова.
              </p>
            </section>

            <section id="security" class="prose-section">
              <h2>9. Меры защиты</h2>
              <p>Оператор применяет необходимые правовые, организационные и&nbsp;технические меры для&nbsp;защиты персональных данных от&nbsp;неправомерного доступа, изменения, копирования или&nbsp;уничтожения, в&nbsp;том&nbsp;числе:</p>
              <ul>
                <li>передача данных только по&nbsp;защищённому каналу&nbsp;HTTPS;</li>
                <li>разграничение прав доступа сотрудников;</li>
                <li>резервное копирование баз данных;</li>
                <li>назначение лица, ответственного за&nbsp;организацию обработки персональных данных.</li>
              </ul>
              <p>
                В&nbsp;случае утечки персональных данных оператор уведомит Роскомнадзор в&nbsp;срок не&nbsp;более 24&nbsp;часов с&nbsp;момента её&nbsp;обнаружения, а&nbsp;затем&nbsp;— в&nbsp;течение 72&nbsp;часов&nbsp;— направит результаты внутреннего расследования (п.&nbsp;3.1 ст.&nbsp;21 152-ФЗ).
              </p>
            </section>

            <section id="contact" class="prose-section">
              <h2>10. Как с&nbsp;нами связаться</h2>
              <p>
                По&nbsp;любым вопросам, связанным с&nbsp;обработкой персональных данных, пишите на&nbsp;<a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a> или&nbsp;звоните по&nbsp;телефону <a :href="`tel:${contacts.phone.tel}`">{{ contacts.phone.display }}</a>. Мы&nbsp;ответим в&nbsp;разумный срок и&nbsp;поможем разобраться.
              </p>
              <p>
                Также вы&nbsp;можете оставить запрос через <a :href="`${base}contacts`">страницу контактов</a>&nbsp;— мы&nbsp;свяжемся первыми.
              </p>
            </section>

            <section id="changes" class="prose-section">
              <h2>11. Изменения политики</h2>
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
  { id: 'data', title: 'Состав данных' },
  { id: 'purpose', title: 'Цели обработки' },
  { id: 'legal', title: 'Правовые основания' },
  { id: 'storage', title: 'Сроки и место хранения' },
  { id: 'sharing', title: 'Передача третьим лицам' },
  { id: 'rights', title: 'Ваши права' },
  { id: 'cookies', title: 'Cookie и аналитика' },
  { id: 'security', title: 'Меры защиты' },
  { id: 'contact', title: 'Как с нами связаться' },
  { id: 'changes', title: 'Изменения политики' },
]

useSiteMeta({
  title: 'Политика конфиденциальности — Пансионат Радде',
  description: 'Как пансионат Радде обрабатывает и хранит персональные данные гостей и посетителей сайта. Соответствие 152-ФЗ.',
  path: '/privacy',
})
useHead({
  meta: [{ name: 'robots', content: 'noindex, follow' }],
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
