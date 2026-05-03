<template>
  <div>
    <UiAppHeader solid @book="scrollToTop" />

    <!-- Hero strip -->
    <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-40 pb-10 md:pb-14">
      <img :src="`${base}images/hero/hero-1.jpg`" alt="" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-sand-900/82"></div>

      <div class="container relative z-10">
        <UiBreadcrumbs
          variant="dark"
          :items="[
            { label: 'Главная', href: base },
            { label: 'Бронирование' },
          ]"
          class="mb-6"
        />
        <div class="max-w-180">
          <span class="text-label text-amber-400 mb-4 block">Бронирование</span>
          <h1 class="text-h1 text-white mb-5">
            Соберите свой <span class="section-title-accent text-sand-300">отдых</span>
          </h1>
          <p class="text-body-lg text-white/75 max-w-130">
            Пять простых шагов: выберите даты, номер и услуги — мы свяжемся в&nbsp;течение 15&nbsp;минут, чтобы подтвердить бронь.
          </p>
        </div>
      </div>
    </section>

    <!-- Quiz form -->
    <section class="bg-sand-50 section-padding">
      <div class="container">

        <!-- Progress -->
        <div class="quiz-progress mb-8 md:mb-10">
          <div class="quiz-progress__steps">
            <button
              v-for="s in steps"
              :key="s.id"
              type="button"
              class="quiz-progress__step"
              :class="{
                'quiz-progress__step--active': step === s.id,
                'quiz-progress__step--done': stepIsDone(s.id),
                'quiz-progress__step--clickable': stepIsDone(s.id) || s.id < step,
              }"
              :disabled="!(stepIsDone(s.id) || s.id < step)"
              @click="goToStep(s.id)"
            >
              <span class="quiz-progress__num">
                <svg v-if="stepIsDone(s.id)" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span v-else>{{ s.id }}</span>
              </span>
              <span class="quiz-progress__label">{{ s.label }}</span>
            </button>
          </div>
          <div class="quiz-progress__bar">
            <div class="quiz-progress__fill" :style="{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }"></div>
          </div>
        </div>

        <!-- Step content -->
        <div class="max-w-1100px mx-auto">
          <Transition name="step" mode="out-in">
            <!-- ============ STEP 1 — DATES + GUESTS ============ -->
            <div v-if="step === 1" key="1" class="quiz-step">
              <div class="quiz-step__head">
                <span class="quiz-step__label">Шаг 1 из 5</span>
                <h2 class="quiz-step__title">Когда вы хотели бы&nbsp;приехать?</h2>
                <p class="quiz-step__sub">Выберите даты заезда и&nbsp;количество гостей — это поможет нам показать вам только доступные номера.</p>
              </div>

              <div class="quiz-card">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label class="label-light">Дата заезда</label>
                    <UiDatePicker v-model="state.arrival" :min-date="todayIso" placeholder="Выберите дату" />
                  </div>
                  <div>
                    <label class="label-light">Дата выезда</label>
                    <UiDatePicker v-model="state.departure" :min-date="checkOutMin" placeholder="Выберите дату" />
                  </div>
                  <div>
                    <label class="label-light">Взрослые</label>
                    <div class="counter-light">
                      <button type="button" @click="state.adults = Math.max(1, state.adults - 1)" class="counter-light__btn" :disabled="state.adults <= 1">&minus;</button>
                      <span class="counter-light__val">{{ state.adults }}</span>
                      <button type="button" @click="state.adults = Math.min(10, state.adults + 1)" class="counter-light__btn">+</button>
                    </div>
                  </div>
                  <div>
                    <label class="label-light">Дети <span class="text-sand-500 text-3.5 font-400">(до 12 лет)</span></label>
                    <div class="counter-light">
                      <button type="button" @click="state.children = Math.max(0, state.children - 1)" class="counter-light__btn" :disabled="state.children <= 0">&minus;</button>
                      <span class="counter-light__val">{{ state.children }}</span>
                      <button type="button" @click="state.children = Math.min(6, state.children + 1)" class="counter-light__btn">+</button>
                    </div>
                  </div>
                </div>

                <div v-if="nights > 0" class="quiz-card__hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 7v5l3 3"/></svg>
                  <span>{{ formattedRange }} — <b>{{ nights }} {{ nightsWord }}</b>, {{ guestSummary }}</span>
                </div>
              </div>

              <div class="quiz-nav">
                <span></span>
                <button type="button" class="btn-primary" :disabled="!canProceedStep1" @click="goToStep(2)">
                  К&nbsp;выбору номера
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="ml-1.5 inline-block"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>

            <!-- ============ STEP 2 — ROOM ============ -->
            <div v-else-if="step === 2" key="2" class="quiz-step">
              <div class="quiz-step__head">
                <span class="quiz-step__label">Шаг 2 из 5</span>
                <h2 class="quiz-step__title">Выберите <span class="section-title-accent text-amber-600">номер</span></h2>
                <p class="quiz-step__sub">
                  Доступность на&nbsp;<b>{{ formattedRange }}</b>, {{ guestSummary }} ({{ nights }} {{ nightsWord }}).
                </p>
              </div>

              <div v-if="availLoading" class="quiz-loader">
                <div class="quiz-spinner"></div>
                <span>Проверяем доступность номеров…</span>
              </div>

              <div v-else-if="availableRooms.length === 0" class="quiz-empty">
                Не&nbsp;удалось загрузить номера. Попробуйте обновить страницу.
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div
                  v-for="r in availableRooms"
                  :key="r.id"
                  class="room-pick"
                  :class="{
                    'room-pick--active': state.roomId === r.id,
                    'room-pick--unfit': !r.fitsGuests,
                  }"
                >
                  <div class="room-pick__photo">
                    <img :src="r.images[0]" :alt="r.name" loading="lazy" />
                    <span v-if="state.roomId === r.id" class="room-pick__check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="room-pick__avail" :class="r.availableCount <= 2 ? 'room-pick__avail--low' : ''">
                      <svg v-if="r.availableCount <= 2" width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                      Свободно: {{ r.availableCount }} из {{ r.totalCount }}
                    </span>
                  </div>
                  <div class="room-pick__body">
                    <div class="flex items-baseline justify-between gap-3 mb-2">
                      <h3 class="font-display font-500 text-sand-900 text-5">{{ r.name }}</h3>
                      <div class="text-right whitespace-nowrap">
                        <span class="font-display font-500 text-sand-900 text-4.5">{{ r.pricePerNight.toLocaleString('ru-RU') }} ₽</span>
                        <span class="block text-3.5 text-sand-600">/ ночь</span>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-1.5 mb-3">
                      <span class="spec-chip text-3.5! py-1! px-2.5!">{{ r.area }} м²</span>
                      <span class="spec-chip text-3.5! py-1! px-2.5!">{{ r.bed }}</span>
                      <span class="spec-chip text-3.5! py-1! px-2.5!">до {{ r.guests }} гостей</span>
                    </div>
                    <p v-if="!r.fitsGuests" class="text-3.5 text-amber-700 mb-3 flex items-start gap-1.5">
                      <svg class="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                      <span class="leading-snug">Рассчитан до&nbsp;{{ r.guests }} гостей — менеджер предложит доплату за&nbsp;дополнительное место.</span>
                    </p>
                    <p v-else-if="r.note" class="text-3.5 text-amber-700 mb-3 flex items-start gap-1.5">
                      <svg class="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                      <span class="leading-snug">{{ r.note }}</span>
                    </p>
                    <div class="flex items-center gap-3 mt-auto pt-2">
                      <button type="button" class="room-pick__more" @click="openRoomModal(r)">
                        Подробнее
                      </button>
                      <button
                        type="button"
                        class="btn-primary !py-2.5 !px-5 !text-3.5 ml-auto"
                        @click="selectRoom(r.id)"
                      >
                        {{ state.roomId === r.id ? 'Выбран' : 'Выбрать' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="quiz-nav">
                <button type="button" class="btn-secondary" @click="goToStep(1)">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="mr-1.5 inline-block"><path d="M10 3l-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Назад
                </button>
                <button type="button" class="btn-primary" :disabled="!state.roomId" @click="goToStep(3)">
                  К&nbsp;услугам
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="ml-1.5 inline-block"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>

            <!-- ============ STEP 3 — EXTRAS ============ -->
            <div v-else-if="step === 3" key="3" class="quiz-step">
              <div class="quiz-step__head">
                <span class="quiz-step__label">Шаг 3 из 5</span>
                <h2 class="quiz-step__title">Дополнительные <span class="section-title-accent text-amber-600">услуги</span></h2>
                <p class="quiz-step__sub">Завтрак, Wi-Fi, парковка и&nbsp;горный воздух уже включены — добавьте только то, что захотите попробовать сверху. Шаг можно пропустить.</p>
              </div>

              <div class="flex flex-wrap gap-2 mb-6">
                <button
                  v-for="cat in extraCategories"
                  :key="cat.id"
                  type="button"
                  class="extra-tab"
                  :class="extraTab === cat.id ? 'extra-tab--active' : ''"
                  @click="extraTab = cat.id"
                >
                  {{ cat.label }}
                  <span v-if="categoryAddedCount(cat.id) > 0" class="extra-tab__badge">{{ categoryAddedCount(cat.id) }}</span>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div
                  v-for="extra in visibleExtras"
                  :key="extra.id"
                  class="extra-card"
                  :class="getExtraCount(extra.id) > 0 ? 'extra-card--active' : ''"
                >
                  <div class="extra-card__icon" v-html="extra.icon"></div>
                  <div class="extra-card__body">
                    <div class="flex items-start justify-between gap-3 mb-1">
                      <h4 class="font-display font-500 text-sand-900 text-4.5">{{ extra.title }}</h4>
                    </div>
                    <p class="text-small text-sand-700 leading-snug mb-3">{{ extra.description }}</p>
                    <div class="flex items-end justify-between gap-3 flex-wrap">
                      <div>
                        <span class="font-display font-500 text-sand-900 text-4.5">{{ extra.price }}</span>
                        <span class="text-small text-sand-600 ml-1">{{ extra.unitLabel }}</span>
                      </div>
                      <div class="flex items-center gap-2.5">
                        <button
                          v-if="extra.fullDescription"
                          type="button"
                          class="extra-card__more"
                          @click="detailExtra = extra"
                        >Подробнее</button>
                        <div v-if="getExtraCount(extra.id) > 0" class="counter-light counter-light--sm">
                          <button type="button" @click="setExtraCount(extra.id, getExtraCount(extra.id) - 1)" class="counter-light__btn">&minus;</button>
                          <span class="counter-light__val">{{ getExtraCount(extra.id) }}</span>
                          <button type="button" @click="setExtraCount(extra.id, getExtraCount(extra.id) + 1)" class="counter-light__btn">+</button>
                        </div>
                        <button v-else type="button" class="btn-secondary !py-2 !px-4 !text-3.5" @click="setExtraCount(extra.id, 1)">
                          Добавить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="quiz-nav">
                <button type="button" class="btn-secondary" @click="goToStep(2)">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="mr-1.5 inline-block"><path d="M10 3l-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Назад
                </button>
                <button type="button" class="btn-primary" @click="goToStep(4)">
                  {{ state.extras.length > 0 ? 'К контактам' : 'Пропустить шаг' }}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="ml-1.5 inline-block"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>

            <!-- ============ STEP 4 — CONTACTS ============ -->
            <div v-else-if="step === 4" key="4" class="quiz-step">
              <div class="quiz-step__head">
                <span class="quiz-step__label">Шаг 4 из 5</span>
                <h2 class="quiz-step__title">Куда вам <span class="section-title-accent text-amber-600">позвонить</span></h2>
                <p class="quiz-step__sub">Менеджер свяжется с&nbsp;вами в&nbsp;течение 15&nbsp;минут, чтобы подтвердить бронь и&nbsp;ответить на&nbsp;вопросы.</p>
              </div>

              <div class="quiz-card">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="label-light">Имя <span class="text-amber-600">*</span></label>
                    <input v-model="state.guest.firstName" type="text" placeholder="Имя" class="input-light" />
                  </div>
                  <div>
                    <label class="label-light">Фамилия</label>
                    <input v-model="state.guest.lastName" type="text" placeholder="Фамилия" class="input-light" />
                  </div>
                  <div>
                    <label class="label-light">Телефон <span class="text-amber-600">*</span></label>
                    <input :value="state.guest.phone" @input="handlePhone" @keydown="phoneMaskKeydown" type="tel" placeholder="+7 (900) 000-00-00" class="input-light" />
                  </div>
                  <div>
                    <label class="label-light">Email</label>
                    <input v-model="state.guest.email" type="email" placeholder="you@example.com" class="input-light" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="label-light">Пожелания и&nbsp;комментарий <span class="text-sand-500">(необязательно)</span></label>
                    <textarea v-model="state.comment" placeholder="Время заезда, диета, нужен трансфер из аэропорта…" rows="3" class="input-light" style="height:auto;min-height:100px;padding:12px 16px;resize:vertical;line-height:1.5"></textarea>
                  </div>
                </div>
              </div>

              <div class="quiz-nav">
                <button type="button" class="btn-secondary" @click="goToStep(3)">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="mr-1.5 inline-block"><path d="M10 3l-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Назад
                </button>
                <button type="button" class="btn-primary" :disabled="!canProceedStep4" @click="goToStep(5)">
                  К сводке
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="ml-1.5 inline-block"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>

            <!-- ============ STEP 5 — SUMMARY ============ -->
            <div v-else-if="step === 5" key="5" class="quiz-step">
              <div class="quiz-step__head">
                <span class="quiz-step__label">Шаг 5 из 5</span>
                <h2 class="quiz-step__title">Проверьте <span class="section-title-accent text-amber-600">бронь</span></h2>
                <p class="quiz-step__sub">Если всё верно — отправьте заявку, и&nbsp;мы свяжемся с&nbsp;вами в&nbsp;течение 15&nbsp;минут.</p>
              </div>

              <div class="quiz-card summary-card">
                <!-- Dates / guests -->
                <div class="summary-section">
                  <div class="flex items-baseline justify-between gap-3 mb-3">
                    <h3 class="summary-section__title">Даты и&nbsp;гости</h3>
                    <button type="button" class="summary-edit" @click="goToStep(1)">Изменить</button>
                  </div>
                  <div class="summary-row"><span class="summary-label">Заезд</span><span class="summary-value">{{ formatDate(state.arrival) }}</span></div>
                  <div class="summary-row"><span class="summary-label">Выезд</span><span class="summary-value">{{ formatDate(state.departure) }}</span></div>
                  <div class="summary-row"><span class="summary-label">Длительность</span><span class="summary-value">{{ nights }} {{ nightsWord }}</span></div>
                  <div class="summary-row"><span class="summary-label">Гости</span><span class="summary-value">{{ guestSummary }}</span></div>
                </div>

                <!-- Room -->
                <div class="summary-section">
                  <div class="flex items-baseline justify-between gap-3 mb-3">
                    <h3 class="summary-section__title">Номер</h3>
                    <button type="button" class="summary-edit" @click="goToStep(2)">Изменить</button>
                  </div>
                  <div v-if="selectedAvailable" class="flex items-start gap-4">
                    <img :src="selectedAvailable.images[0]" :alt="selectedAvailable.name" class="w-20 h-20 md:w-24 md:h-24 rounded-2 object-cover flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                      <div class="font-display font-500 text-sand-900 text-5 mb-1">{{ selectedAvailable.name }}</div>
                      <div class="text-3.5 text-sand-700 mb-2">{{ selectedAvailable.area }} м² · {{ selectedAvailable.bed }} · до {{ selectedAvailable.guests }} гостей</div>
                      <div class="text-3.5 text-sand-700">{{ selectedAvailable.pricePerNight.toLocaleString('ru-RU') }} ₽ × {{ nights }} {{ nightsWord }} = <b>{{ totals.roomTotal.toLocaleString('ru-RU') }} ₽</b></div>
                    </div>
                  </div>
                  <div v-else class="text-sand-600 italic">Номер не&nbsp;выбран</div>
                </div>

                <!-- Extras -->
                <div v-if="state.extras.length > 0" class="summary-section">
                  <div class="flex items-baseline justify-between gap-3 mb-3">
                    <h3 class="summary-section__title">Услуги</h3>
                    <button type="button" class="summary-edit" @click="goToStep(3)">Изменить</button>
                  </div>
                  <div v-for="line in summaryExtras" :key="line.id" class="summary-row summary-row--multiline">
                    <div class="flex-1 min-w-0">
                      <div class="font-body text-4 text-sand-900">{{ line.title }}</div>
                      <div class="text-3.5 text-sand-600">{{ line.formula }}</div>
                    </div>
                    <span class="summary-amount">{{ line.amount.toLocaleString('ru-RU') }} ₽</span>
                  </div>
                </div>

                <!-- Contacts -->
                <div class="summary-section">
                  <div class="flex items-baseline justify-between gap-3 mb-3">
                    <h3 class="summary-section__title">Контакты</h3>
                    <button type="button" class="summary-edit" @click="goToStep(4)">Изменить</button>
                  </div>
                  <div class="summary-row"><span class="summary-label">Имя</span><span class="summary-value">{{ state.guest.firstName }} {{ state.guest.lastName }}</span></div>
                  <div class="summary-row"><span class="summary-label">Телефон</span><span class="summary-value">{{ state.guest.phone }}</span></div>
                  <div v-if="state.guest.email" class="summary-row"><span class="summary-label">Email</span><span class="summary-value">{{ state.guest.email }}</span></div>
                  <div v-if="state.comment" class="summary-row summary-row--multiline">
                    <span class="summary-label">Комментарий</span>
                    <span class="summary-value text-left">{{ state.comment }}</span>
                  </div>
                </div>

                <!-- Total -->
                <div class="summary-total">
                  <span class="font-body text-4 text-sand-700">Итого</span>
                  <span class="font-display font-500 text-sand-900 text-7">{{ totals.total.toLocaleString('ru-RU') }} ₽</span>
                </div>
                <p class="text-small text-sand-600 leading-snug mb-5">
                  Окончательная стоимость подтверждается менеджером после проверки доступности номера на&nbsp;выбранные даты.
                </p>

                <button
                  type="button"
                  class="btn-primary w-full py-4 text-4"
                  :disabled="submitting"
                  @click="submit"
                >
                  {{ submitting ? 'Отправляем…' : 'Отправить заявку' }}
                </button>

                <p class="text-small text-sand-700 mt-4 leading-relaxed text-center">
                  Нажимая «Отправить заявку», вы соглашаетесь с
                  <a :href="`${base}privacy`" class="text-sand-900 underline underline-offset-2 hover:text-amber-600 transition-colors">политикой конфиденциальности</a>.
                </p>
              </div>

              <div class="quiz-nav">
                <button type="button" class="btn-secondary" @click="goToStep(4)">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="mr-1.5 inline-block"><path d="M10 3l-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Назад
                </button>
                <button
                  v-if="hasAnySelection"
                  type="button"
                  class="reset-link"
                  @click="resetAll"
                >
                  Очистить и&nbsp;начать заново
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Room details modal (для шага 2) -->
    <UiRoomDetailsModal
      :room="detailRoom"
      action="select"
      select-label="Выбрать этот номер"
      @close="detailRoom = null"
      @select="r => { selectRoom(r.id); detailRoom = null }"
    />

    <!-- Extra details modal (для шага 3) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="detailExtra" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/60 backdrop-blur-sm" @click.self="detailExtra = null">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-130 max-h-[90vh] overflow-y-auto shadow-2xl modal-body" data-lenis-prevent>
            <div class="px-7 md:px-9 pt-7 pb-5 border-b border-sand-200">
              <div class="flex items-center gap-4">
                <div class="modal-icon-wrap flex-shrink-0" v-html="detailExtra.icon"></div>
                <h3 class="flex-1 font-display font-500 text-sand-900 min-w-0" style="font-size: clamp(1.4rem, 3vw, 1.7rem)">{{ detailExtra.title }}</h3>
                <button @click="detailExtra = null" class="flex-shrink-0 w-9 h-9 rounded-full bg-sand-200/90 hover:bg-sand-300 flex items-center justify-center transition-colors border-none cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
            <div class="px-7 md:px-9 py-6">
              <p class="font-body text-4 text-sand-800 leading-relaxed">{{ detailExtra.fullDescription || detailExtra.description }}</p>
            </div>
            <div class="px-7 md:px-9 py-5 border-t border-sand-200 flex items-center justify-between bg-sand-100/50 gap-3 flex-wrap">
              <div>
                <span class="font-display font-500 text-sand-900" style="font-size: clamp(1.2rem, 2vw, 1.5rem)">{{ detailExtra.price }}</span>
                <span class="text-small text-sand-600 ml-1">{{ detailExtra.unitLabel }}</span>
              </div>
              <button
                type="button"
                class="btn-primary"
                @click="addExtraFromModal"
              >
                {{ getExtraCount(detailExtra.id) > 0 ? 'Уже добавлено' : 'Добавить к брони' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <UiSiteFooter />
  </div>
</template>

<script setup lang="ts">
import type { ExtraDef } from '~/composables/useBookingExtras'

const base = useRuntimeConfig().app.baseURL || '/'
const route = useRoute()

useHead({
  title: 'Бронирование — Радде',
  meta: [
    { name: 'description', content: 'Соберите свой отдых в пансионате Радде: даты, номер, услуги. Менеджер подтвердит бронь в течение 15 минут.' },
    { name: 'robots', content: 'noindex, follow' },
  ],
})

const extras = useBookingExtras()
const { state, nights, setRoom, setExtraCount, getExtraCount, reset } = useBookingStore()
const { onInput: phoneMaskInput, onKeydown: phoneMaskKeydown } = usePhoneMask()
const toast = useToast()

// ----- Steps -----
const steps = [
  { id: 1, label: 'Даты' },
  { id: 2, label: 'Номер' },
  { id: 3, label: 'Услуги' },
  { id: 4, label: 'Контакты' },
  { id: 5, label: 'Сводка' },
] as const
type StepId = typeof steps[number]['id']

const step = ref<StepId>(1)

const todayIso = computed(() => new Date().toISOString().slice(0, 10))
const checkOutMin = computed(() => {
  const a = state.value.arrival || todayIso.value
  const d = new Date(a)
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
})

watch(() => state.value.arrival, (val) => {
  if (val && state.value.departure && state.value.departure <= val) {
    const d = new Date(val)
    d.setDate(d.getDate() + 1)
    state.value.departure = d.toISOString().slice(0, 10)
  }
})

// ----- Availability -----
const adultsRef = computed(() => state.value.adults)
const childrenRef = computed(() => state.value.children)
const arrivalRef = computed(() => state.value.arrival)
const departureRef = computed(() => state.value.departure)

const { rooms: availableRooms, loading: availLoading } = useAvailableRooms({
  arrival: arrivalRef,
  departure: departureRef,
  adults: adultsRef,
  children: childrenRef,
})

const selectedAvailable = computed(() => availableRooms.value.find(r => r.id === state.value.roomId))

function selectRoom(id: string) {
  setRoom(state.value.roomId === id ? null : id)
}

// ----- Step navigation -----
const canProceedStep1 = computed(() => !!state.value.arrival && !!state.value.departure && nights.value > 0)
const canProceedStep4 = computed(() =>
  state.value.guest.firstName.trim().length > 0
  && state.value.guest.phone.replace(/\D/g, '').length >= 11,
)

function stepIsDone(id: StepId): boolean {
  if (id === 1) return canProceedStep1.value
  if (id === 2) return !!state.value.roomId
  if (id === 3) return step.value > 3 // шаг услуг можно пропустить — отметим как «пройден» если перешли дальше
  if (id === 4) return canProceedStep4.value
  return false
}

function goToStep(target: StepId) {
  // Валидация только при движении вперёд
  if (target > step.value) {
    if (step.value === 1 && !canProceedStep1.value) {
      toast.error('Выберите даты заезда и выезда')
      return
    }
    if (step.value === 2 && !state.value.roomId && target !== 2) {
      toast.error('Выберите номер')
      return
    }
    if (step.value === 4 && !canProceedStep4.value) {
      toast.error('Заполните имя и телефон')
      return
    }
  }
  step.value = target
  scrollToTop()
}

// ----- Pre-select room from URL -----
onMounted(() => {
  const roomId = route.query.room
  if (typeof roomId === 'string') {
    setRoom(roomId)
    // если номер был выбран извне и даты валидны — сразу на шаг 2
    if (canProceedStep1.value) step.value = 2
  }
  const extraId = route.query.extra
  if (typeof extraId === 'string' && extras.find(e => e.id === extraId)) {
    if (getExtraCount(extraId) === 0) setExtraCount(extraId, 1)
  }
})

// ----- Extras -----
const extraCategories = [
  { id: 'all', label: 'Все' },
  { id: 'food', label: 'Питание' },
  { id: 'active', label: 'Активный отдых' },
  { id: 'wellness', label: 'Оздоровление' },
  { id: 'service', label: 'Сервис' },
] as const
type ExtraCatId = typeof extraCategories[number]['id']
const extraTab = ref<ExtraCatId>('all')

const visibleExtras = computed(() => {
  if (extraTab.value === 'all') return extras
  return extras.filter(e => e.category === extraTab.value)
})

function categoryAddedCount(catId: ExtraCatId): number {
  if (catId === 'all') return state.value.extras.length
  const ids = new Set(extras.filter(e => e.category === catId).map(e => e.id))
  return state.value.extras.filter(s => ids.has(s.id)).length
}

const detailExtra = ref<ExtraDef | null>(null)
function addExtraFromModal() {
  if (!detailExtra.value) return
  if (getExtraCount(detailExtra.value.id) === 0) setExtraCount(detailExtra.value.id, 1)
  detailExtra.value = null
}

// ----- Room modal -----
const detailRoom = ref<typeof availableRooms.value[0] | null>(null)
function openRoomModal(r: typeof availableRooms.value[0]) {
  detailRoom.value = r
}

// ----- Phone -----
function handlePhone(e: Event) {
  state.value.guest.phone = phoneMaskInput(e)
}

// ----- Summary helpers -----
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()} ${months[d.getMonth()]}`
}
const formattedRange = computed(() => `${formatDate(state.value.arrival)} — ${formatDate(state.value.departure)}`)
const nightsWord = computed(() => {
  const n = nights.value
  if (n % 10 === 1 && n % 100 !== 11) return 'ночь'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'ночи'
  return 'ночей'
})
const guestSummary = computed(() => {
  const a = state.value.adults
  const c = state.value.children
  const aWord = a % 10 === 1 && a % 100 !== 11 ? 'взрослый' : 'взрослых'
  const parts = [`${a} ${aWord}`]
  if (c > 0) {
    const cWord = c % 10 === 1 && c % 100 !== 11 ? 'ребёнок' : ([2, 3, 4].includes(c % 10) && ![12, 13, 14].includes(c % 100) ? 'ребёнка' : 'детей')
    parts.push(`${c} ${cWord}`)
  }
  return parts.join(' + ')
})

// ----- Totals (используем актуальную цену из availability) -----
const totals = computed(() => {
  const room = selectedAvailable.value
  const n = Math.max(1, nights.value)
  const roomTotal = room ? room.pricePerNight * n : 0
  let extrasTotal = 0
  for (const sel of state.value.extras) {
    const meta = extras.find(e => e.id === sel.id)
    if (!meta) continue
    extrasTotal += extraSubtotal(meta, sel.count, state.value.adults, n)
  }
  return { roomTotal, extrasTotal, total: roomTotal + extrasTotal }
})

const summaryExtras = computed(() => {
  return state.value.extras
    .map(sel => {
      const meta = extras.find(e => e.id === sel.id)
      if (!meta) return null
      const n = Math.max(1, nights.value)
      const amount = extraSubtotal(meta, sel.count, state.value.adults, n)
      let formula = ''
      switch (meta.unit) {
        case 'guest':
          formula = `${meta.priceValue.toLocaleString('ru-RU')} ₽ × ${state.value.adults} чел × ${n} ${nightsWord.value}`
          if (sel.count > 1) formula = `${sel.count} × ` + formula
          break
        case 'night':
          formula = `${meta.priceValue.toLocaleString('ru-RU')} ₽ × ${n} ${nightsWord.value}`
          if (sel.count > 1) formula = `${sel.count} × ` + formula
          break
        case 'session':
          formula = sel.count > 1 ? `${meta.priceValue.toLocaleString('ru-RU')} ₽ × ${sel.count}` : `${meta.priceValue.toLocaleString('ru-RU')} ₽`
          break
      }
      return { id: meta.id, title: meta.title, formula, amount }
    })
    .filter((x): x is { id: string; title: string; formula: string; amount: number } => x !== null)
})

const hasAnySelection = computed(() =>
  !!state.value.roomId
  || state.value.extras.length > 0
  || state.value.guest.firstName
  || state.value.guest.phone
  || state.value.comment,
)

// ----- Submit -----
const submitting = ref(false)

async function submit() {
  if (!state.value.roomId) {
    toast.error('Вернитесь на шаг 2 и выберите номер')
    return
  }
  if (!canProceedStep4.value) {
    toast.error('Заполните имя и телефон на шаге 4')
    return
  }
  if (nights.value <= 0) {
    toast.error('Дата выезда должна быть позже даты заезда')
    return
  }

  submitting.value = true

  // Готовим payload в формате Bnovo. Когда подключим API — здесь fetch к серверу-проксю.
  const room = selectedAvailable.value
  const payload = {
    arrival: state.value.arrival,
    departure: state.value.departure,
    rooms: [{
      room_type_id: room?.bnovoRoomTypeId ?? null,
      rate_id: room?.bnovoRateId ?? null,
      guests: [{ adults: state.value.adults, children: state.value.children }],
    }],
    guest: {
      first_name: state.value.guest.firstName,
      last_name: state.value.guest.lastName,
      email: state.value.guest.email,
      phone: state.value.guest.phone,
    },
    extras: state.value.extras.map(sel => {
      const meta = extras.find(e => e.id === sel.id)
      return { id: meta?.bnovoServiceId ?? null, slug: sel.id, count: sel.count }
    }),
    comment: state.value.comment,
    total_estimate: totals.value.total,
  }
  // eslint-disable-next-line no-console
  console.log('[booking] outgoing payload', payload)

  if (import.meta.client) {
    try {
      localStorage.setItem('radde_booking_last', JSON.stringify({
        firstName: state.value.guest.firstName,
        phone: state.value.guest.phone,
      }))
    } catch { /* ignore */ }
  }

  await new Promise(resolve => setTimeout(resolve, 800))

  state.value.roomId = null
  state.value.extras = []
  state.value.comment = ''

  window.location.href = `${base}booking/success`
}

function resetAll() {
  reset()
  step.value = 1
  scrollToTop()
}

function scrollToTop() {
  if (!import.meta.client) return
  const lenis = useLenis().instance()
  if (lenis) lenis.scrollTo(0, { duration: 0.6 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* ======== PROGRESS ======== */
.quiz-progress {
  max-width: 900px;
  margin: 0 auto;
}
.quiz-progress__steps {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  margin-bottom: 14px;
}
.quiz-progress__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 4px;
  background: transparent;
  border: none;
  cursor: not-allowed;
  color: #B5A88E;
  transition: color 0.2s;
}
.quiz-progress__step--clickable { cursor: pointer; }
.quiz-progress__step--clickable:hover { color: #6B5B4A; }
.quiz-progress__step--done { color: #6B5B4A; }
.quiz-progress__step--active { color: #2C2416; }
.quiz-progress__num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1.5px solid #E8D5B7;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #B5A88E;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.quiz-progress__step--done .quiz-progress__num {
  background: #5C6B3A;
  border-color: #5C6B3A;
  color: white;
}
.quiz-progress__step--active .quiz-progress__num {
  background: #C17F3E;
  border-color: #C17F3E;
  color: white;
  box-shadow: 0 4px 14px rgba(193, 127, 62, 0.35);
}
.quiz-progress__label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
@media (min-width: 640px) {
  .quiz-progress__num { width: 38px; height: 38px; font-size: 15px; }
  .quiz-progress__label { font-size: 13px; }
}
.quiz-progress__bar {
  position: relative;
  height: 3px;
  background: #F0E6D6;
  border-radius: 999px;
  overflow: hidden;
}
.quiz-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, #5C6B3A, #C17F3E);
  border-radius: 999px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ======== STEP TRANSITIONS ======== */
.step-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.step-leave-active { transition: all 0.25s ease; }
.step-enter-from { opacity: 0; transform: translateY(20px); }
.step-leave-to { opacity: 0; transform: translateY(-10px); }

/* ======== STEP HEAD ======== */
.quiz-step__head {
  text-align: center;
  margin-bottom: 28px;
}
@media (min-width: 768px) { .quiz-step__head { margin-bottom: 36px; } }
.quiz-step__label {
  display: inline-block;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5C6B3A;
  margin-bottom: 12px;
}
.quiz-step__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  color: #2C2416;
  font-size: clamp(1.6rem, 3.2vw, 2.4rem);
  line-height: 1.2;
  margin-bottom: 12px;
}
.quiz-step__sub {
  max-width: 560px;
  margin: 0 auto;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  color: #6B5B4A;
  line-height: 1.6;
}

/* ======== QUIZ CARD (форма-обёртка) ======== */
.quiz-card {
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 8px 32px rgba(44, 36, 22, 0.05);
}
@media (min-width: 768px) { .quiz-card { padding: 32px; } }
.quiz-card__hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #F0E6D6;
  color: #5C6B3A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
}

/* ======== QUIZ NAV ======== */
.quiz-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
  flex-wrap: wrap;
}
.reset-link {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B5B4A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.reset-link:hover { color: #2C2416; }

/* ======== LIGHT COUNTER ======== */
.counter-light {
  display: flex;
  align-items: center;
  background: white;
  border: 1.5px solid #E0D5C8;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.counter-light:hover { border-color: #C17F3E; }
.counter-light--sm { border-width: 1px; border-radius: 7px; }
.counter-light__btn {
  width: 44px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B5B4A;
  font-size: 18px;
  font-weight: 600;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.counter-light--sm .counter-light__btn { width: 32px; height: 32px; font-size: 14px; }
.counter-light__btn:hover:not(:disabled) {
  color: #2C2416;
  background: #FAF6F0;
}
.counter-light__btn:disabled { opacity: 0.3; cursor: default; }
.counter-light__val {
  flex: 1;
  text-align: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2C2416;
  min-width: 32px;
  padding: 0 6px;
}

/* ======== ROOM PICK CARDS ======== */
.room-pick {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.room-pick:hover {
  border-color: #D4BC96;
  box-shadow: 0 8px 24px rgba(44, 36, 22, 0.06);
}
.room-pick--active {
  border-color: #C17F3E;
  box-shadow: 0 12px 28px rgba(193, 127, 62, 0.18);
}
.room-pick--unfit { opacity: 0.85; }
.room-pick__photo {
  position: relative;
  aspect-ratio: 16 / 10;
  background: #F0E6D6;
  overflow: hidden;
}
.room-pick__photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.room-pick:hover .room-pick__photo img { transform: scale(1.04); }
.room-pick__check {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #C17F3E;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(193, 127, 62, 0.4);
}
.room-pick__avail {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(44, 36, 22, 0.85);
  backdrop-filter: blur(4px);
  color: white;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}
.room-pick__avail--low {
  background: rgba(193, 127, 62, 0.92);
}
.room-pick__body {
  padding: 18px 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.room-pick__more {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #C17F3E;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 0;
  transition: color 0.2s;
}
.room-pick__more:hover { color: #A0653A; }

/* ======== EXTRA CATEGORY TABS ======== */
.extra-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #6B5B4A;
  background: transparent;
  border: 1.5px solid #E0D5C8;
  border-radius: 999px;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.2s;
}
@media (min-width: 640px) { .extra-tab { font-size: 15px; padding: 8px 16px; } }
.extra-tab:hover { border-color: #C17F3E; }
.extra-tab--active {
  background: #2C2416;
  border-color: #2C2416;
  color: #FAF6F0;
}
.extra-tab__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: #C17F3E;
  color: white;
  font-size: 12px;
  font-weight: 700;
}

/* ======== EXTRA CARDS ======== */
.extra-card {
  display: flex;
  gap: 14px;
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 14px;
  padding: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.extra-card--active {
  border-color: #C17F3E;
  box-shadow: 0 8px 18px rgba(193, 127, 62, 0.12);
}
.extra-card__icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #F4F6EE, #E8ECDC);
  color: #5B7A3A;
  display: flex;
  align-items: center;
  justify-content: center;
}
.extra-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.extra-card__more {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B5B4A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 0;
  transition: color 0.2s;
}
.extra-card__more:hover { color: #C17F3E; }

/* ======== LOADER / EMPTY ======== */
.quiz-loader, .quiz-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 60px 20px;
  text-align: center;
  color: #6B5B4A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
}
.quiz-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #F0E6D6;
  border-top-color: #C17F3E;
  border-radius: 50%;
  animation: quiz-spin 0.8s linear infinite;
}
@keyframes quiz-spin { to { transform: rotate(360deg); } }

/* ======== SUMMARY ======== */
.summary-card { padding: 22px; }
@media (min-width: 768px) { .summary-card { padding: 32px; } }
.summary-section {
  padding-bottom: 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid #F0E6D6;
}
.summary-section:last-of-type { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
.summary-section__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #2C2416;
}
.summary-edit {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B5B4A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 0;
  transition: color 0.2s;
}
.summary-edit:hover { color: #C17F3E; }
.summary-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}
.summary-row--multiline {
  align-items: flex-start;
  flex-wrap: wrap;
}
.summary-label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  color: #6B5B4A;
}
.summary-value {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2C2416;
  text-align: right;
}
.summary-amount {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #2C2416;
  white-space: nowrap;
}
.summary-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 2px solid #F0E6D6;
  margin-bottom: 6px;
}

/* ======== MODAL (extra) ======== */
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
.modal-enter-active { transition: opacity 0.3s ease; }
.modal-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-leave-active > div:last-child { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from { opacity: 0; }
.modal-enter-from > div:last-child { opacity: 0; transform: scale(0.95) translateY(10px); }
.modal-leave-to { opacity: 0; }
.modal-leave-to > div:last-child { opacity: 0; transform: scale(0.97); }
</style>
