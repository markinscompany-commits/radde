<template>
  <div>
    <UiAppHeader solid @book="showBooking = true" />

    <section class="bg-sand-50 pt-32 md:pt-40 pb-12 md:pb-16">
      <div class="container">
        <UiBreadcrumbs
          variant="light"
          :items="[
            { label: 'Главная', href: base },
            { label: 'Публичная оферта' },
          ]"
          class="mb-6"
        />
        <h1 class="text-h1 text-sand-900 mb-5 max-w-180">
          Публичная <span class="section-title-accent">оферта</span>
        </h1>
        <p class="text-body-lg text-sand-700 max-w-130">
          Договор оказания гостиничных услуг пансионата «Радде». Оформляя бронь на&nbsp;сайте, вы&nbsp;принимаете условия этого договора.
        </p>
        <span class="text-small text-sand-600 block mt-6">Редакция от 4&nbsp;июня 2026&nbsp;г.</span>
      </div>
    </section>

    <section class="bg-sand-50 pb-20 md:pb-26">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
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

          <article class="lg:col-span-8 prose-radde">
            <section id="terms" class="prose-section">
              <h2>1. Общие положения</h2>
              <p>
                Настоящий документ является публичной офертой (предложением заключить договор) {{ contacts.legal.entityName }} (далее&nbsp;— «Исполнитель») об&nbsp;оказании услуг по&nbsp;временному размещению (проживанию) в&nbsp;пансионате «Радде».
              </p>
              <p>
                Оформление бронирования на&nbsp;сайте radde.ru с&nbsp;проставлением отметки о&nbsp;согласии является акцептом оферты&nbsp;— полным и&nbsp;безоговорочным принятием её&nbsp;условий (ст.&nbsp;437, 438 ГК&nbsp;РФ). С&nbsp;этого момента между гостем и&nbsp;Исполнителем заключается договор на&nbsp;изложенных ниже условиях.
              </p>
            </section>

            <section id="subject" class="prose-section">
              <h2>2. Предмет договора</h2>
              <p>
                Исполнитель предоставляет гостю номер выбранной категории на&nbsp;выбранные даты, а&nbsp;также сопутствующие услуги (завтрак и&nbsp;иные включённые в&nbsp;тариф услуги). Дополнительные услуги (питание сверх включённого, экскурсии, трансфер и&nbsp;пр.) оказываются по&nbsp;желанию гостя и&nbsp;оплачиваются отдельно при&nbsp;заселении.
              </p>
              <p>
                Категории номеров, их&nbsp;вместимость и&nbsp;актуальная стоимость отображаются на&nbsp;странице бронирования на&nbsp;основании данных системы управления номерным фондом.
              </p>
            </section>

            <section id="booking" class="prose-section">
              <h2>3. Бронирование и подтверждение</h2>
              <ul>
                <li>Гость выбирает даты, состав гостей и&nbsp;категорию номера и&nbsp;оставляет заявку с&nbsp;контактными данными.</li>
                <li>Бронь считается подтверждённой после внесения аванса (если он&nbsp;предусмотрен выбранным тарифом) либо после подтверждения Исполнителем по&nbsp;телефону или&nbsp;в&nbsp;мессенджере.</li>
                <li>Если на&nbsp;момент обработки заявки выбранный номер оказался занят, Исполнитель сообщает об&nbsp;этом и&nbsp;предлагает альтернативные даты или&nbsp;номер; внесённый аванс при&nbsp;этом возвращается в&nbsp;полном объёме либо переносится.</li>
              </ul>
            </section>

            <section id="payment" class="prose-section">
              <h2>4. Стоимость и порядок оплаты</h2>
              <ul>
                <li>Стоимость проживания указывается в&nbsp;рублях за&nbsp;весь период и&nbsp;зависит от&nbsp;категории номера, дат и&nbsp;состава гостей.</li>
                <li>Если тариф предусматривает аванс&nbsp;— он&nbsp;вносится онлайн через защищённый платёжный шлюз; остаток оплачивается при&nbsp;заселении наличными или&nbsp;банковским переводом.</li>
                <li>Дополнительные услуги оплачиваются отдельно при&nbsp;заселении и&nbsp;в&nbsp;сумму аванса не&nbsp;входят.</li>
              </ul>
            </section>

            <section id="checkin" class="prose-section">
              <h2>5. Заезд и выезд</h2>
              <p>
                Заезд&nbsp;— с&nbsp;14:00, выезд&nbsp;— до&nbsp;12:00. Ранний заезд и&nbsp;поздний выезд возможны по&nbsp;согласованию и&nbsp;при&nbsp;наличии свободных номеров. При&nbsp;заселении гость предъявляет документ, удостоверяющий личность (для&nbsp;несовершеннолетних&nbsp;— документы в&nbsp;соответствии с&nbsp;законодательством РФ).
              </p>
            </section>

            <section id="cancel" class="prose-section">
              <h2>6. Отмена брони и возврат</h2>
              <ul>
                <li><strong>Более 7&nbsp;дней</strong> до&nbsp;заезда&nbsp;— отмена бесплатно, аванс возвращается полностью.</li>
                <li><strong>За&nbsp;3–7&nbsp;дней</strong> до&nbsp;заезда&nbsp;— удерживается стоимость первой ночи.</li>
                <li><strong>Менее 3&nbsp;дней</strong> до&nbsp;заезда или&nbsp;неявка&nbsp;— аванс не&nbsp;возвращается.</li>
                <li>При&nbsp;форс-мажоре (закрытие дорог, отмена авиарейсов, болезнь с&nbsp;подтверждением) условия пересматриваются индивидуально.</li>
              </ul>
              <p>Возврат аванса производится тем&nbsp;же способом, которым он&nbsp;был внесён, в&nbsp;срок до&nbsp;10&nbsp;рабочих дней.</p>
            </section>

            <section id="parties" class="prose-section">
              <h2>7. Права и обязанности сторон</h2>
              <p><strong>Исполнитель обязуется</strong> предоставить номер заявленной категории и&nbsp;качества, обеспечить заявленные включённые услуги, бережно относиться к&nbsp;данным гостя.</p>
              <p><strong>Гость обязуется</strong> своевременно оплатить услуги, соблюдать правила проживания и&nbsp;пожарной безопасности, бережно относиться к&nbsp;имуществу пансионата и&nbsp;возместить ущерб в&nbsp;случае его&nbsp;причинения.</p>
            </section>

            <section id="liability" class="prose-section">
              <h2>8. Ответственность и форс-мажор</h2>
              <p>
                Стороны несут ответственность в&nbsp;соответствии с&nbsp;законодательством РФ. Исполнитель не&nbsp;несёт ответственности за&nbsp;неисполнение обязательств вследствие обстоятельств непреодолимой силы (стихийные бедствия, закрытие дорог, действия органов власти и&nbsp;т.&nbsp;п.).
              </p>
            </section>

            <section id="pdn" class="prose-section">
              <h2>9. Персональные данные</h2>
              <p>
                Обработка персональных данных гостя осуществляется в&nbsp;соответствии с&nbsp;<a :href="`${base}privacy`">Политикой конфиденциальности</a> и&nbsp;Федеральным законом №&nbsp;152-ФЗ «О&nbsp;персональных данных».
              </p>
            </section>

            <section id="requisites" class="prose-section">
              <h2>10. Реквизиты Исполнителя</h2>
              <ul>
                <li>{{ contacts.legal.entityName }}</li>
                <li>ИНН: {{ contacts.legal.inn }}</li>
                <li>ОГРНИП: {{ contacts.legal.ogrn }}</li>
                <li>Адрес: {{ contacts.legal.address }}</li>
                <li>Реестровая запись (классификация): {{ contacts.legal.egrksm }} — {{ contacts.legal.classification }}</li>
                <li>Телефон: <a :href="`tel:${contacts.phone.tel}`">{{ contacts.phone.display }}</a></li>
                <li>Email: <a :href="`mailto:${contacts.email}`">{{ contacts.email }}</a></li>
              </ul>
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
  { id: 'terms', title: 'Общие положения' },
  { id: 'subject', title: 'Предмет договора' },
  { id: 'booking', title: 'Бронирование' },
  { id: 'payment', title: 'Стоимость и оплата' },
  { id: 'checkin', title: 'Заезд и выезд' },
  { id: 'cancel', title: 'Отмена и возврат' },
  { id: 'parties', title: 'Права и обязанности' },
  { id: 'liability', title: 'Ответственность' },
  { id: 'pdn', title: 'Персональные данные' },
  { id: 'requisites', title: 'Реквизиты' },
]

useSiteMeta({
  title: 'Публичная оферта — Пансионат Радде',
  description: 'Договор оказания гостиничных услуг пансионата Радде: бронирование, оплата, заезд и выезд, отмена и возврат.',
  path: '/offer',
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
.toc-link:hover { color: #C17F3E; }
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

.prose-section { scroll-margin-top: 6rem; }
.prose-section + .prose-section { margin-top: 2.5rem; }

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
.prose-radde :deep(strong) { color: #2C2416; font-weight: 600; }
</style>
