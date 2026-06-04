<template>
  <div>
    <UiAppHeader @book="scrollToTop" />

    <!-- Hero strip -->
    <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-36 pb-8 md:pb-10">
      <UiPicture :src="`${base}images/hero/hero-1.jpg`" alt="Горы Дагестана — пансионат Радде" sizes="100vw" class="absolute inset-0 w-full h-full object-cover" decoding="async" />
      <div class="absolute inset-0 bg-sand-900/82"></div>

      <div class="container relative z-10">
        <UiBreadcrumbs
          variant="dark"
          :items="[
            { label: 'Главная', href: base },
            { label: 'Бронирование' },
          ]"
          class="mb-5"
        />
        <div class="flex items-end justify-between gap-6 flex-wrap">
          <h1 class="text-h1 text-white">
            Ваш <span class="section-title-accent text-sand-300">отдых</span>
          </h1>
          <p class="font-body text-4 text-white/70 max-w-110 mb-2">
            Соберите бронь — аванс&nbsp;15% закрепит её сразу, без&nbsp;звонков и&nbsp;ожидания. Остаток оплачиваете при&nbsp;заселении.
          </p>
        </div>
      </div>
    </section>

    <!-- Checkout layout -->
    <section class="bg-sand-50 py-10 md:py-14">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

          <!-- LEFT: form sections -->
          <div class="md:col-span-7 lg:col-span-8 space-y-5 md:space-y-6">

            <!-- ============ 1. DATES + GUESTS ============ -->
            <div ref="datesSectionRef" class="checkout-card">
              <div class="checkout-head">
                <span class="checkout-num">1</span>
                <h2 class="checkout-title">Даты и&nbsp;<span class="section-title-accent text-amber-600">гости</span></h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div class="md:col-span-2">
                  <label class="label-light">Даты заезда и&nbsp;выезда</label>
                  <UiDateRangePicker
                    v-model:model-start="state.arrival"
                    v-model:model-end="state.departure"
                    variant="light"
                    :min-date="todayIso"
                    placeholder="Выберите даты"
                  />
                </div>
                <div>
                  <label class="label-light">Взрослые</label>
                  <div class="counter-light">
                    <button type="button" @click="state.adults = Math.max(1, state.adults - 1)" class="counter-light__btn" :disabled="state.adults <= 1">&minus;</button>
                    <span class="counter-light__val">{{ state.adults }}</span>
                    <button type="button" @click="incrementAdults" class="counter-light__btn" :disabled="totalGuestsCount >= MAX_GUESTS">+</button>
                  </div>
                </div>
                <div>
                  <label class="label-light">Дети <span class="text-3.5 text-sand-500 font-400">до 17 лет</span></label>
                  <div class="counter-light">
                    <button type="button" @click="decrementChildren" class="counter-light__btn" :disabled="state.children <= 0">&minus;</button>
                    <span class="counter-light__val">{{ state.children }}</span>
                    <button type="button" @click="incrementChildren" class="counter-light__btn" :disabled="totalGuestsCount >= MAX_GUESTS">+</button>
                  </div>
                </div>
              </div>

              <!-- Возрасты детей: табы 0-17. По умолчанию не выбраны — гость обязан указать.
                   Возраст 15+ → ребёнок учитывается в PMS как взрослый (effective*).
                   Дети младше 15 живут в номере бесплатно, но возраст нужен ресепшну
                   (детская кроватка, питание, активности по возрасту). -->
              <div v-if="state.children > 0" class="children-ages">
                <div class="children-ages__title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
                  <span>Возраст детей</span>
                </div>
                <div class="children-ages__list">
                  <div v-for="(_, idx) in state.children" :key="idx" class="children-ages__row">
                    <div class="children-ages__rowhead">
                      <span class="children-ages__label">{{ childOrdinal(idx + 1) }} ребёнок</span>
                      <span v-if="state.childrenAges[idx] == null || state.childrenAges[idx] < 0" class="children-ages__needage">укажите возраст</span>
                    </div>
                    <div class="children-ages__tabs" role="radiogroup" :aria-label="`Возраст ребёнка ${idx + 1}`">
                      <button
                        v-for="age in 18"
                        :key="age - 1"
                        type="button"
                        role="radio"
                        :aria-checked="state.childrenAges[idx] === age - 1"
                        class="children-ages__tab"
                        :class="{
                          'children-ages__tab--active': state.childrenAges[idx] === age - 1,
                          'children-ages__tab--adultlike': age - 1 >= 15,
                        }"
                        @click="state.childrenAges[idx] = age - 1"
                      >
                        {{ age - 1 === 0 ? '<1' : age - 1 }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="nights > 0" class="checkout-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 7v5l3 3"/></svg>
                <span>{{ formattedRange }} · <b>{{ nights }} {{ nightsWord }}</b> · {{ guestSummary }}</span>
              </div>
            </div>

            <!-- ============ 2. ROOM ============ -->
            <div ref="roomSectionRef" class="checkout-card">
              <div class="checkout-head">
                <span class="checkout-num">2</span>
                <h2 class="checkout-title">Выберите <span class="section-title-accent text-amber-600">номер</span></h2>
              </div>

              <div v-if="!canShowRooms" class="checkout-empty">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>
                <span>Сначала выберите даты заезда и&nbsp;выезда</span>
              </div>

              <div v-else-if="availLoading" class="checkout-loading">
                <div class="quiz-spinner"></div>
                <span>Проверяем доступность номеров…</span>
              </div>

              <div v-else-if="availableRooms.length === 0" class="checkout-empty">
                Не удалось загрузить номера. Попробуйте обновить страницу.
              </div>

              <!-- Все категории заняты на запрошенный период целиком -->
              <div v-else-if="allRoomsFullyBooked" class="period-empty">
                <div class="period-empty__icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/><path d="M9 14l6 6M15 14l-6 6"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="period-empty__title">Здесь нет свободных номеров на&nbsp;весь период</h3>
                  <p class="period-empty__sub">С&nbsp;{{ formatDate(state.arrival) }} по&nbsp;{{ formatDate(state.departure) }} ({{ nights }}&nbsp;{{ nightsWord }}) ни&nbsp;одна категория не&nbsp;свободна целиком. Сократите период или&nbsp;выберите другие даты — мы&nbsp;покажем что доступно.</p>
                  <div class="period-empty__actions">
                    <button type="button" class="period-empty__btn" @click="scrollToEl(datesSectionRef)">
                      Изменить даты
                    </button>
                    <button type="button" class="period-empty__btn period-empty__btn--ghost" :disabled="searchingDates" @click="applyNearestWindow(3)">
                      {{ searchingDates ? 'Ищем свободные даты…' : 'Найти ближайшие свободные 3 ночи' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Ни один одиночный номер не вмещает состав (cap-fail).
                   Скрываем сетку карточек целиком — гость идёт сразу в multi-room
                   ниже. Показываем мягкую плашку «Под ваш состав одного номера нет». -->
              <div v-else-if="allRoomsExceedCapacity" class="capacity-empty">
                <div class="capacity-empty__icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="capacity-empty__title">Под&nbsp;{{ totalGuests }}&nbsp;{{ guestsWord(totalGuests) }} одного номера не&nbsp;хватает</h3>
                  <p class="capacity-empty__sub">Самый вместительный у&nbsp;нас — {{ biggestRoomName || 'Люкс' }} до&nbsp;{{ biggestRoomCap || 5 }} гостей. Собираем компанию из&nbsp;нескольких номеров — варианты ниже.</p>
                </div>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div
                  v-for="r in availableRooms"
                  :key="r.id"
                  :data-room-id="r.id"
                  class="room-pick"
                  :class="{
                    'room-pick--active': state.roomId === r.id,
                    'room-pick--unfit': !r.fitsGuests || !r.available,
                  }"
                  :role="r.fitsGuests && r.available ? 'button' : undefined"
                  :tabindex="r.fitsGuests && r.available ? 0 : undefined"
                  @click="pickRoom(r)"
                  @keydown.enter.prevent="pickRoom(r)"
                  @keydown.space.prevent="pickRoom(r)"
                >
                  <div class="room-pick__photo">
                    <img :src="r.images[0]" :alt="r.name" loading="lazy" />
                    <span v-if="state.roomId === r.id" class="room-pick__check">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                  </div>
                  <div class="room-pick__body">
                    <span
                      v-if="r.available && r.availableCount === 1"
                      class="room-pick__last-badge"
                    >Последний номер</span>
                    <div class="flex items-baseline justify-between gap-3 mb-2">
                      <h3 class="font-display font-500 text-sand-900 text-4.5">{{ r.name }}</h3>
                      <div class="text-right whitespace-nowrap">
                        <span class="font-display font-500 text-sand-900 text-4.5">{{ fmtPrice(r.pricePerNight) }} ₽</span>
                        <span class="block text-3 text-sand-600">/ ночь</span>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-1.5 mb-3">
                      <span class="spec-chip text-3.25! py-0.75! px-2!">{{ r.area }} м²</span>
                      <span class="spec-chip text-3.25! py-0.75! px-2!">{{ r.bed }}</span>
                      <span class="spec-chip text-3.25! py-0.75! px-2!">до {{ r.effectiveCapacity }} гостей</span>
                    </div>
                    <!-- Порядок проверок:
                         1) Не помещается по числу гостей → подсказка с лимитом и кнопками
                         2) Доступен, но осталось 0 на эти даты, есть альтернативная дата → кнопка
                         3) Note категории (например «санузел в коридоре»)
                         Универсальный fallback «недоступен» убран — если редкий кейс
                         (fits=true, available=false, нет alternative) — карточка просто disabled. -->
                    <div v-if="!r.fitsGuests" class="room-pick__limit">
                      <p class="room-pick__limit-msg">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="M8 5v3.5M8 10.5h.007"/></svg>
                        <span>Вмещает до&nbsp;{{ r.effectiveCapacity }}&nbsp;{{ guestsWord(r.effectiveCapacity) }} — для&nbsp;{{ state.adults + state.children }}&nbsp;маловато</span>
                      </p>
                      <div class="room-pick__limit-actions">
                        <button v-if="biggestRoomName && biggestRoomCap > r.effectiveCapacity" type="button" class="room-pick__limit-btn room-pick__limit-btn--primary" @click.stop="scrollToBiggestRoom">
                          {{ biggestRoomName }} · до&nbsp;{{ biggestRoomCap }}
                        </button>
                        <button type="button" class="room-pick__limit-btn" @click.stop="suggestSplitRooms">
                          Несколько номеров
                        </button>
                      </div>
                    </div>
                    <button
                      v-else-if="!r.available && r.nextAvailableFrom"
                      type="button"
                      class="room-pick__suggest"
                      @click.stop="applyAlternativeDates(r)"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <path d="M3 10h18M8 2v4M16 2v4"/>
                      </svg>
                      <span>Свободно {{ formatDate(r.nextAvailableFrom) }}{{ r.nextAvailableTo ? `—${formatDate(r.nextAvailableTo)}` : '' }}{{ r.nextAvailableNights ? ` · ${r.nextAvailableNights} ${nightsLabel(r.nextAvailableNights)}` : '' }} — нажмите, чтобы&nbsp;подставить даты</span>
                    </button>
                    <button
                      v-else-if="!r.available && !r.nextAvailableFrom"
                      type="button"
                      class="room-pick__suggest"
                      :disabled="searchingDates"
                      @click.stop="applyNearestWindow(nights, r.id)"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/></svg>
                      <span>{{ searchingDates ? 'Ищем ближайшие свободные даты…' : `Подобрать ближайшие свободные даты на ${nights} ${nightsLabel(nights)}` }}</span>
                    </button>
                    <p v-else-if="r.note" class="text-3.25 text-amber-700 mb-3 flex items-start gap-1.5">
                      <svg class="flex-shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                      <span class="leading-snug">{{ r.note }}</span>
                    </p>
                    <div class="flex items-center justify-between gap-2 mt-auto pt-2">
                      <button type="button" class="room-pick__more" @click.stop="detailRoom = r">
                        Подробнее
                      </button>
                      <button
                        type="button"
                        class="room-pick__select"
                        :class="state.roomId === r.id ? 'room-pick__select--active' : ''"
                        :disabled="!r.available || !r.fitsGuests"
                        @click.stop="selectRoom(r.id)"
                      >
                        <svg v-if="state.roomId === r.id" width="14" height="14" viewBox="0 0 24 24" fill="none" class="mr-1.5 inline-block"><path d="M5 12L10 17L19 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        {{ state.roomId === r.id ? 'Выбран' : 'Выбрать' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ===== Мульти-номер: набор номеров на большую компанию ===== -->
              <div ref="multiRoomSectionRef" v-if="canShowRooms && !availLoading && roomCombinations.length > 0" class="multi-room">
                <div class="multi-room__head">
                  <div class="multi-room__head-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="multi-room__title">Несколько номеров для&nbsp;компании</h3>
                    <p class="multi-room__sub">У&nbsp;вас {{ totalGuests }}&nbsp;{{ guestsWord(totalGuests) }} — соберите бронь из&nbsp;нескольких номеров. Подобрали {{ roomCombinations.length }} вариант{{ roomCombinations.length === 1 ? '' : (roomCombinations.length >= 2 && roomCombinations.length <= 4 ? 'а' : 'ов') }}.</p>
                  </div>
                </div>

                <div class="multi-room__grid">
                  <div
                    v-for="combo in roomCombinations"
                    :key="combo.signature"
                    class="multi-combo"
                    :class="{ 'multi-combo--active': isMultiComboActive(combo) }"
                  >
                    <!-- Превью номеров: фото каждой категории в combo + название + «Подробнее».
                         Гость видит из чего состоит набор и может тапнуть конкретное фото
                         чтобы открыть модалку с полной инфой по номеру. -->
                    <div class="multi-combo__rooms-preview">
                      <button
                        v-for="(item, ix) in combo.items"
                        :key="ix"
                        type="button"
                        class="multi-combo__room"
                        @click.stop="openComboRoomDetails(item.id)"
                        :aria-label="`Подробнее о номере ${roomNameById(item.id)}`"
                      >
                        <span class="multi-combo__room-photo">
                          <img :src="roomFirstPhoto(item.id)" :alt="roomNameById(item.id)" loading="lazy" />
                          <span v-if="item.count > 1" class="multi-combo__room-count">{{ item.count }}×</span>
                        </span>
                        <span class="multi-combo__room-meta">
                          <span class="multi-combo__room-name">{{ roomNameById(item.id) }}</span>
                          <span class="multi-combo__room-more">
                            Подробнее
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4l4 4-4 4"/></svg>
                          </span>
                        </span>
                      </button>
                    </div>

                    <div class="multi-combo__meta-row">
                      <span class="multi-combo__cap">{{ combo.totalCapacity }} {{ peopleSlotsWord(combo.totalCapacity) }}</span>
                      <div class="multi-combo__price">
                        <span class="multi-combo__price-night">от {{ fmtPrice(combo.pricePerNight) }} ₽ / ночь</span>
                        <span v-if="nights > 0" class="multi-combo__price-total">
                          ≈ {{ fmtPrice(combo.pricePerNight * Math.max(1, nights)) }} ₽ за&nbsp;{{ nights }} {{ nightsWord }}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      class="multi-combo__btn"
                      :class="isMultiComboActive(combo) ? 'multi-combo__btn--active' : ''"
                      @click="selectMultiCombo(combo)"
                    >
                      <svg v-if="isMultiComboActive(combo)" width="14" height="14" viewBox="0 0 24 24" fill="none" class="mr-1.5 inline-block"><path d="M5 12L10 17L19 8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      {{ isMultiComboActive(combo) ? 'Этот набор выбран' : 'Выбрать набор' }}
                    </button>
                  </div>
                </div>

              </div>

              <!-- D.5: набор номеров нужен (большая компания или гость нажал
                   «несколько номеров»), но на выбранный период их собрать нельзя —
                   показываем ту же по смыслу плашку «нет свободных», что и для
                   одиночных номеров, а не пустоту. -->
              <div
                v-else-if="canShowRooms && !availLoading && needsMultiRoom && roomCombinations.length === 0 && !allRoomsFullyBooked"
                class="period-empty"
              >
                <div class="period-empty__icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><path d="M14 18l6 0M17 15l0 6"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="period-empty__title">На&nbsp;этот период нет свободных наборов номеров</h3>
                  <p class="period-empty__sub">С&nbsp;{{ formatDate(state.arrival) }} по&nbsp;{{ formatDate(state.departure) }} ({{ nights }}&nbsp;{{ nightsWord }}) не&nbsp;удалось собрать набор номеров на&nbsp;{{ totalGuests }}&nbsp;{{ guestsWord(totalGuests) }}. Сократите период или&nbsp;выберите другие даты — мы&nbsp;покажем что доступно. Либо позвоните, ресепшн подберёт вручную.</p>
                  <div class="period-empty__actions">
                    <button type="button" class="period-empty__btn" @click="scrollToEl(datesSectionRef)">
                      Изменить даты
                    </button>
                    <button type="button" class="period-empty__btn period-empty__btn--ghost" :disabled="searchingDates" @click="applyNearestWindow(3)">
                      {{ searchingDates ? 'Ищем свободные даты…' : 'Найти ближайшие свободные 3 ночи' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ============ 3. EXTRAS ============ -->
            <div class="checkout-card">
              <div class="checkout-head checkout-head--with-optional">
                <span class="checkout-num">3</span>
                <div class="flex-1 min-w-0">
                  <h2 class="checkout-title">Дополнительные <span class="section-title-accent text-amber-600">услуги</span></h2>
                  <span class="checkout-optional checkout-optional--mobile">необязательно</span>
                </div>
                <span class="checkout-optional checkout-optional--desktop">необязательно</span>
              </div>
              <div class="flex flex-wrap gap-2 mb-4">
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

              <div ref="extrasGridRef" class="extras-grid">
                <div
                  v-for="extra in visibleExtras"
                  :key="extra.id"
                  class="extra-card"
                  :class="getExtraCount(extra.id) > 0 ? 'extra-card--active' : ''"
                  @click="extra.fullDescription ? (detailExtra = extra) : null"
                >
                  <div class="extra-card__icon" v-html="extra.icon"></div>
                  <div class="extra-card__body">
                    <h4 class="font-display font-500 text-sand-900 text-4 mb-1">{{ extra.title }}</h4>
                    <p class="text-3.5 text-sand-700 leading-snug mb-3 line-clamp-2">{{ extra.description }}</p>
                    <div class="extra-card__price-row">
                      <span class="font-display font-500 text-sand-900 text-4">от {{ extra.price }}</span>
                    </div>
                    <!-- Услуга = простой переключатель «Добавить / Убрать». Без
                         модификаторов «На скольких / Раз в день» — все услуги
                         оплачиваются отдельно при заселении (фидбек Mark 06.2026). -->
                    <div class="extra-card__actions">
                      <button
                        v-if="extra.fullDescription"
                        type="button"
                        class="extra-card__more"
                        @click.stop="detailExtra = extra"
                      >Подробнее</button>
                      <span v-else></span>
                      <button v-if="getExtraCount(extra.id) === 0" type="button" class="extra-card__add" @click.stop="addExtra(extra)">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="inline-block"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        Добавить
                      </button>
                      <button v-else type="button" class="extra-card__remove" @click.stop="setExtraCount(extra.id, 0)">
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                        Убрать
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mobile scroll hint -->
              <div v-show="extrasShowHint" class="md:hidden flex justify-center mt-3">
                <UiScrollHint>Скролльте, чтобы увидеть все услуги</UiScrollHint>
              </div>
            </div>

            <!-- ============ 4. CONTACTS ============ -->
            <div ref="contactsSectionRef" class="checkout-card">
              <div class="checkout-head">
                <span class="checkout-num">4</span>
                <h2 class="checkout-title">Ваши&nbsp;<span class="section-title-accent text-amber-600">данные</span></h2>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label class="label-light">Имя <span class="text-amber-600">*</span></label>
                  <input
                    ref="nameInputRef"
                    v-model="state.guest.firstName"
                    type="text"
                    placeholder="Иван"
                    autocomplete="given-name"
                    class="input-light"
                    :class="{ 'input-light--error': errorField === 'name' }"
                  />
                </div>
                <div>
                  <label class="label-light">Фамилия <span class="text-amber-600">*</span></label>
                  <input
                    ref="lastNameInputRef"
                    v-model="state.guest.lastName"
                    type="text"
                    placeholder="Петров"
                    autocomplete="family-name"
                    class="input-light"
                    :class="{ 'input-light--error': errorField === 'lastName' }"
                  />
                </div>
                <div>
                  <label class="label-light">Телефон <span class="text-amber-600">*</span></label>
                  <input
                    ref="phoneInputRef"
                    :value="state.guest.phone"
                    @input="handlePhone"
                    @keydown="phoneMaskKeydown"
                    type="tel"
                    placeholder="+7 (900) 000-00-00"
                    class="input-light"
                    :class="{ 'input-light--error': errorField === 'phone' }"
                  />
                </div>
                <div>
                  <label class="label-light">Email <span class="text-amber-600">*</span></label>
                  <input
                    ref="emailInputRef"
                    v-model="state.guest.email"
                    type="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    class="input-light"
                    :class="{ 'input-light--error': errorField === 'email' }"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="label-light">Город <span class="text-sand-500">(откуда вы)</span></label>
                  <input v-model="state.guest.city" type="text" placeholder="Москва" class="input-light" />
                </div>
                <div class="md:col-span-2">
                  <label class="label-light">Пожелания и&nbsp;комментарий <span class="text-sand-500">(необязательно)</span></label>
                  <textarea v-model="state.comment" placeholder="Время заезда, диета, нужен трансфер из аэропорта…" rows="2" class="input-light textarea-light"></textarea>
                </div>
              </div>
            </div>

            <!-- ============ Условия бронирования и отмены ============
                 Требование Постановления Правительства РФ № 1912 (с 01.03.2026):
                 раскрыть на сайте порядок отмены, время заезда/выезда, оплату.
                 Без эквайринга отдельный «Договор-оферта» не нужен. -->
            <div class="rules-card" :class="{ 'rules-card--open': rulesOpen }">
              <button type="button" class="rules-card__toggle" :aria-expanded="rulesOpen" @click="rulesOpen = !rulesOpen">
                <h3 class="rules-card__title">Условия бронирования</h3>
                <span class="rules-card__chev" :class="rulesOpen ? 'rules-card__chev--open' : ''" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4.5l4 4 4-4" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </button>
              <div class="rules-card__body" :class="rulesOpen ? 'rules-card__body--open' : ''">
              <ul class="rules-list">
                <li>
                  <strong>Заезд</strong> с&nbsp;14:00, <strong>выезд</strong> до&nbsp;12:00. Ранний заезд и&nbsp;поздний выезд&nbsp;— по&nbsp;согласованию и&nbsp;при&nbsp;наличии номеров.
                </li>
                <li>
                  <strong>Оплата</strong> наличными при&nbsp;заселении или&nbsp;банковским переводом по&nbsp;реквизитам пансионата. Все цены&nbsp;— в&nbsp;рублях.
                </li>
                <li>
                  <strong>Отмена брони:</strong>
                  <span class="rules-cancel">
                    <span><b>&gt; 7&nbsp;дней</b> до&nbsp;заезда — бесплатно</span>
                    <span><b>3–7&nbsp;дней</b> — удерживается стоимость первой ночи</span>
                    <span><b>&lt; 3&nbsp;дней</b> или&nbsp;неявка — без&nbsp;возврата</span>
                  </span>
                </li>
                <li>
                  При&nbsp;форс-мажоре (закрытие дорог, отмена авиарейсов, болезнь с&nbsp;подтверждением) условия пересматриваем индивидуально.
                </li>
              </ul>
              </div>
            </div>
          </div>

          <!-- RIGHT: sticky summary -->
          <aside class="md:col-span-5 lg:col-span-4 md:sticky md:top-24 md:self-start">
            <div ref="summaryCardRef" class="summary-card">
              <h3 class="summary-card__title">Ваша бронь</h3>

              <!-- Dates -->
              <div class="summary-block">
                <div class="summary-row">
                  <span class="summary-label">Даты</span>
                  <span class="summary-value">{{ formattedRange }}</span>
                </div>
                <div v-if="nights > 0" class="summary-row">
                  <span class="summary-label">Длительность</span>
                  <span class="summary-value">{{ nights }} {{ nightsWord }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Гости</span>
                  <span class="summary-value">{{ guestSummary }}</span>
                </div>
              </div>

              <!-- Room (single) -->
              <div v-if="state.multiRoom && state.multiRoom.length > 0" class="summary-block summary-block--bordered">
                <div class="summary-line">
                  <div class="flex-1 min-w-0">
                    <div class="font-body font-600 text-sand-900 text-4 mb-1 leading-snug">Набор из {{ multiRoomTotalRooms }} {{ peopleSlotsRoomsWord(multiRoomTotalRooms) }}</div>
                    <ul class="multi-room-summary">
                      <li v-for="(item, ix) in state.multiRoom" :key="ix">
                        <span class="multi-room-summary__name">{{ item.count > 1 ? item.count + '× ' : '' }}{{ roomNameById(item.id) }}</span>
                        <span class="multi-room-summary__price">{{ fmtPrice(multiRoomLinePrice(item)) }} ₽</span>
                      </li>
                    </ul>
                    <div class="text-3.25 text-sand-600 leading-snug mt-1">{{ multiRoomComposition }} × {{ Math.max(1, nights) }} {{ nightsWord }}</div>
                  </div>
                  <span class="summary-amount">{{ fmtPrice(totals.roomTotal) }} ₽</span>
                </div>
              </div>
              <div v-else-if="selectedAvailable" class="summary-block summary-block--bordered">
                <div class="summary-line">
                  <div class="flex-1 min-w-0">
                    <div class="font-body font-600 text-sand-900 text-4 mb-0.5 truncate">{{ selectedAvailable.name }}</div>
                    <div class="text-3.25 text-sand-600 leading-snug">{{ roomCompositionLine }}</div>
                    <div class="text-3.25 text-sand-600 leading-snug">{{ fmtPrice(selectedAvailable.pricePerNight) }} ₽ × {{ Math.max(1, nights) }} {{ nightsWord }}</div>
                  </div>
                  <span class="summary-amount">{{ fmtPrice(totals.roomTotal) }} ₽</span>
                </div>
              </div>
              <div v-else class="summary-block summary-block--bordered">
                <span v-if="!state.roomId" class="text-3.5 text-sand-600 italic">Номер ещё не выбран</span>
                <span v-else class="summary-roomwarn">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007"/></svg>
                  Выбранный номер не&nbsp;подходит под новый состав гостей или&nbsp;даты — выберите другой ниже.
                </span>
              </div>

              <!-- Free included services — pulse-кликабельный пункт с попапом -->
              <button
                type="button"
                class="free-incl"
                :class="{ 'free-incl--seen': freeInclSeen }"
                @click="openFreeIncluded"
                aria-haspopup="dialog"
              >
                <span class="free-incl__bullet" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span class="free-incl__text">
                  <span class="free-incl__title">Бесплатные услуги — уже&nbsp;в&nbsp;цене</span>
                  <span class="free-incl__list">Завтрак · Wi-Fi · Парковка · Бельё и&nbsp;ещё&nbsp;3</span>
                </span>
                <span class="free-incl__chev" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2.5L7.5 6L4 9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </button>

              <!-- Extras — свёрнутая строка «Услуги (N) · X ₽» с раскрытием -->
              <div v-if="summaryExtras.length > 0" class="summary-block summary-block--bordered">
                <button
                  type="button"
                  class="summary-extras-toggle"
                  :class="{ 'summary-extras-toggle--open': summaryExtrasOpen }"
                  :aria-expanded="summaryExtrasOpen"
                  aria-controls="summary-extras-list"
                  @click="summaryExtrasOpen = !summaryExtrasOpen"
                >
                  <span class="summary-extras-toggle__main">
                    <span class="summary-extras-toggle__chev" aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3.5 5L7 8.5L10.5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                    <span class="summary-extras-toggle__text">
                      <span class="summary-extras-toggle__title">Услуги</span>
                      <span class="summary-extras-toggle__count">{{ summaryExtras.length }} {{ extrasCountWord(summaryExtras.length) }} · оплата отдельно</span>
                    </span>
                  </span>
                  <span class="summary-amount summary-amount--muted">от {{ fmtPrice(summaryExtrasTotal) }} ₽</span>
                </button>
                <Transition name="extras-expand">
                  <ul v-if="summaryExtrasOpen" id="summary-extras-list" class="summary-extras-list">
                    <li v-for="line in summaryExtras" :key="line.id" class="summary-extras-list__item">
                      <div class="flex-1 min-w-0">
                        <div class="font-body text-3.75 text-sand-900 truncate">{{ line.title }}</div>
                      </div>
                      <span class="summary-amount">от {{ fmtPrice(line.amount) }} ₽</span>
                    </li>
                    <li class="summary-extras-note">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007"/></svg>
                      <span>Услуги оплачиваются отдельно при&nbsp;заселении и&nbsp;не&nbsp;входят в&nbsp;сумму брони</span>
                    </li>
                  </ul>
                </Transition>
              </div>

              <!-- Total -->
              <div class="summary-total">
                <span class="font-body text-4 text-sand-700">Итого</span>
                <span class="font-display font-500 text-sand-900 text-7">{{ fmtPrice(totals.total) }} ₽</span>
              </div>

              <button
                type="button"
                class="btn-primary w-full py-3.5 text-4"
                :disabled="submitting"
                @click="submit"
              >
                {{ submitting ? 'Бронируем…' : 'Забронировать' }}
              </button>

              <!-- Чекбокс согласия на обработку ПДн — ст. 9 152-ФЗ.
                   Расположен ПОСЛЕ кнопки submit (по требованию Mark).
                   Расширенный текст: ПДн + оферта + предоплата через эквайринг.
                   mt-4 — такой же отступ, как у текста про подтверждение перед кнопкой. -->
              <UiConsentCheckbox
                ref="consentInputRef"
                v-model="consentGiven"
                :error="errorField === 'consent'"
                class="mt-4"
              >
                Нажимая «Забронировать», я&nbsp;принимаю <a :href="`${base}offer`" target="_blank" rel="noopener">условия оферты</a>
                и&nbsp;даю согласие на&nbsp;<a :href="`${base}privacy`" target="_blank" rel="noopener">обработку персональных данных</a>.
              </UiConsentCheckbox>

              <button
                v-if="hasAnySelection"
                type="button"
                class="reset-link"
                @click="confirmReset = true"
              >
                Очистить и&nbsp;начать заново
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Mobile sticky «Далее» — появляется на мобиле когда номер выбран
         И блок итогов ещё НЕ виден на экране. Когда гость доскроллил до
         summary — кнопка пропадает (через IntersectionObserver).
         Клик ведёт к summary-card в потоке (на мобиле summary рендерится
         внизу как обычный блок, на ПК — sticky sidebar справа). -->
    <div v-if="showMobileNext" class="mobile-next-spacer" aria-hidden="true"></div>
    <Transition name="mobile-next">
      <div v-if="showMobileNext" class="mobile-next-bar md:hidden">
        <button
          type="button"
          class="mobile-next-bar__btn"
          @click="goToNextStep"
        >
          <span class="mobile-next-bar__label">Далее</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </Transition>

<!-- Room details modal -->
    <UiRoomDetailsModal
      :room="detailRoom"
      action="select"
      select-label="Выбрать этот номер"
      :availability="detailRoomAvailability"
      @close="detailRoom = null"
      @select="r => { selectRoom(r.id); detailRoom = null }"
    />

    <!-- Extra details modal -->
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
                <span class="font-display font-500 text-sand-900" style="font-size: clamp(1.2rem, 2vw, 1.5rem)">от {{ detailExtra.price }}</span>
                <span class="text-small text-sand-600 ml-1">· оплачивается отдельно</span>
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

    <!-- Free included services modal — что уже в стоимости -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="freeInclModal.open" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/60 backdrop-blur-sm" @click.self="freeInclModal.open = false">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-130 max-h-[90vh] overflow-hidden shadow-2xl modal-body" data-lenis-prevent>
            <button @click="freeInclModal.open = false" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-sand-200/90 hover:bg-sand-300 flex items-center justify-center transition-colors z-30 border-none cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
            <div class="px-7 md:px-9 pt-7 pb-4">
              <div class="flex items-center gap-3 mb-1">
                <div class="free-incl-modal__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                </div>
                <h3 class="font-display font-500 text-sand-900" style="font-size: clamp(1.3rem, 2.5vw, 1.6rem)">Что уже в&nbsp;стоимости</h3>
              </div>
              <p class="text-3.5 text-sand-600 leading-snug">Эти услуги входят в&nbsp;цену номера. Кликните на&nbsp;любую — подробности.</p>
            </div>
            <div class="px-7 md:px-9 pb-7 overflow-y-auto" style="max-height: calc(90vh - 130px)">
              <ul class="free-incl-list">
                <li v-for="item in freeIncludedItems" :key="item.id">
                  <button type="button" class="free-incl-list__btn" @click="freeInclModal.detail = item">
                    <span class="free-incl-list__icon" v-html="item.icon"></span>
                    <span class="free-incl-list__body">
                      <span class="free-incl-list__title">{{ item.title }}</span>
                      <span class="free-incl-list__desc">{{ item.short }}</span>
                    </span>
                    <span class="free-incl-list__chev" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2.5L9.5 7L5 11.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Free included — детальная карточка одной услуги -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="freeInclModal.detail" class="fixed inset-0 z-110 flex items-center justify-center p-4 bg-sand-900/70 backdrop-blur-sm" @click.self="freeInclModal.detail = null">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-110 shadow-2xl modal-body" data-lenis-prevent>
            <button @click="freeInclModal.detail = null" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-sand-200/90 hover:bg-sand-300 flex items-center justify-center transition-colors z-30 border-none cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
            <div class="px-7 md:px-9 pt-7 pb-4 border-b border-sand-200">
              <div class="flex items-center gap-3">
                <div class="free-incl-modal__icon free-incl-modal__icon--lg" v-html="freeInclModal.detail.icon"></div>
                <h3 class="font-display font-500 text-sand-900" style="font-size: clamp(1.2rem, 2.4vw, 1.45rem)">{{ freeInclModal.detail.title }}</h3>
              </div>
            </div>
            <div class="px-7 md:px-9 py-6">
              <p class="font-body text-4 text-sand-800 leading-relaxed mb-3">{{ freeInclModal.detail.full }}</p>
              <div class="inline-flex items-center gap-2 text-3.5 text-emerald-700 font-600 bg-emerald-50 border border-emerald-200 rounded-2 px-3 py-1.5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Без&nbsp;доплаты
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Confirm reset dialog -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="confirmReset" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/70 backdrop-blur-sm" @click.self="confirmReset = false">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-110 shadow-2xl modal-body" data-lenis-prevent>
            <div class="px-7 md:px-9 pt-7 pb-3">
              <h3 class="font-display font-500 text-sand-900 mb-3" style="font-size: clamp(1.3rem, 2.5vw, 1.6rem)">Очистить заявку?</h3>
              <p class="font-body text-4 text-sand-700 leading-relaxed">
                Все выбранные даты, номер, услуги и&nbsp;контактные данные будут удалены. Это действие нельзя отменить.
              </p>
            </div>
            <div class="px-7 md:px-9 py-5 flex items-center justify-end gap-3">
              <button type="button" class="btn-secondary" @click="confirmReset = false">Нет, отмена</button>
              <button type="button" class="btn-danger" @click="confirmResetYes">Да, очистить</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Unavailable modal — выбранный номер занят на эти даты -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="unavailableModal.open" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/70 backdrop-blur-sm" @click.self="unavailableModal.open = false">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-130 shadow-2xl modal-body" data-lenis-prevent>
            <div class="px-7 md:px-9 pt-7 pb-3">
              <div class="flex items-start gap-3 mb-4">
                <div class="conflict-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <path d="M3 10h18M8 2v4M16 2v4"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-display font-500 text-sand-900 mb-1" style="font-size: clamp(1.3rem, 2.5vw, 1.55rem)">Этот номер только что заняли</h3>
                  <p class="text-3.75 text-sand-600">Пока вы заполняли заявку, кто-то забронировал «{{ unavailableModal.roomName }}» на&nbsp;выбранные даты.</p>
                </div>
              </div>

              <div v-if="unavailableModal.nextFrom" class="alt-date-card">
                <span class="text-3.5 text-sand-600">Ближайшая свободная дата заезда</span>
                <span class="font-display font-500 text-sand-900 mt-1" style="font-size: clamp(1.3rem, 2.5vw, 1.6rem)">
                  {{ formatDateLong(unavailableModal.nextFrom) }}<span v-if="unavailableModal.nextNights">&nbsp;<span class="text-4 text-sand-600">— на&nbsp;{{ unavailableModal.nextNights }}&nbsp;{{ nightsLabel(unavailableModal.nextNights) }}</span></span>
                </span>
              </div>
              <p v-else class="text-3.75 text-sand-700 leading-relaxed mt-3">
                Нет данных по&nbsp;ближайшим свободным датам. Менеджер свяжется с&nbsp;вами и&nbsp;предложит варианты.
              </p>

              <p class="text-3.25 text-sand-500 mt-4">
                Заявка №&nbsp;{{ unavailableModal.bookingId }} сохранена — можете попробовать другие даты прямо сейчас или дождаться звонка менеджера.
              </p>
            </div>
            <div class="px-7 md:px-9 py-5 flex flex-wrap items-center justify-end gap-3 border-t border-sand-200">
              <button type="button" class="btn-secondary" @click="pickAnotherRoom">
                Выбрать другой номер
              </button>
              <button v-if="unavailableModal.nextFrom" type="button" class="btn-primary" @click="applyUnavailableDates">
                Перенести на&nbsp;{{ formatDateLong(unavailableModal.nextFrom) }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Bnovo-error modal — заявка принята, но автозабронировать не удалось -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="bnovoErrorModal.open" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/70 backdrop-blur-sm" @click.self="bnovoErrorModal.open = false">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-120 shadow-2xl modal-body" data-lenis-prevent>
            <div class="px-7 md:px-9 pt-7 pb-3">
              <div class="flex items-start gap-3 mb-4">
                <div class="conflict-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-display font-500 text-sand-900 mb-1" style="font-size: clamp(1.3rem, 2.5vw, 1.55rem)">Заявка принята</h3>
                  <p class="text-3.75 text-sand-600">Автоматически забронировать не&nbsp;удалось — менеджер свяжется с&nbsp;вами в&nbsp;течение 15&nbsp;минут и&nbsp;подтвердит бронь.</p>
                </div>
              </div>
              <p class="text-3.25 text-sand-500 mt-4">
                Заявка №&nbsp;{{ bnovoErrorModal.bookingId }} сохранена. Если хотите ускорить — позвоните нам напрямую.
              </p>
            </div>
            <div class="px-7 md:px-9 py-5 flex flex-wrap items-center justify-end gap-3 border-t border-sand-200">
              <button type="button" class="btn-secondary" @click="bnovoErrorModal.open = false">Понятно</button>
              <a href="tel:+79882777755" class="btn-primary">Позвонить</a>
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
import { generateRoomCombinations, type RoomCombo } from '~/composables/useRoomCombinations'

const base = useRuntimeConfig().app.baseURL || '/'
const route = useRoute()

useSiteMeta({
  title: 'Бронирование — Радде',
  description: 'Соберите свой отдых в пансионате Радде: даты, номер, дополнительные услуги. Менеджер подтвердит бронь в течение 15 минут.',
  path: '/booking',
})

const extras = useBookingExtras()
const { state, nights, setRoom, setMultiRoom, setExtraCount, getExtraCount, reset } = useBookingStore()
const { onInput: phoneMaskInput, onKeydown: phoneMaskKeydown } = usePhoneMask()
const toast = useToast()

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
// PMS у клиента настроен с отдельными подкатегориями под состав («Lux», «Lux для трёх»,
// «Lux для двоих и ребёнка» и т.д.) — каждая со своей ценой. Не считаем сами, доверяем
// подбору подкатегории парсером (см. server/api/availability.get.ts).
//
// Ребёнок 15+ лет тарифицируется как взрослый (правило ресепшна, подтверждено в
// callout под выбором возраста). Поэтому в запросах к PMS и в payload к
// Bnovo «свечем» детей 15+ в графе adults, чтобы PMS подобрал variant для нужного
// числа взрослых и вернул правильную цену. UI остаётся в терминах
// «2 взрослых + 1 ребёнок 15 лет» — это видит гость и ресепшн.
const adultLikeChildrenCount = computed(() =>
  (state.value.childrenAges ?? []).filter(a => typeof a === 'number' && a >= 15).length,
)
const effectiveAdults = computed(() => state.value.adults + adultLikeChildrenCount.value)
const effectiveChildren = computed(() => Math.max(0, state.value.children - adultLikeChildrenCount.value))
const effectiveChildrenAges = computed(() =>
  (state.value.childrenAges ?? []).filter(a => typeof a === 'number' && a >= 0 && a < 15),
)

const arrivalRef = computed(() => state.value.arrival)
const departureRef = computed(() => state.value.departure)

const canShowRooms = computed(() => !!state.value.arrival && !!state.value.departure && nights.value > 0)

const { rooms: availableRooms, loading: availLoading } = useAvailableRooms({
  arrival: arrivalRef,
  departure: departureRef,
  adults: effectiveAdults,
  children: effectiveChildren,
})

// Второй запрос availability для мульти-номер distribution: с adults=2.
// PMS у Радде возвращает variants (подкатегории по составу) только для категорий,
// которые умещают запрошенный состав. Когда основной запрос с 4+ гостями приходит
// для одиночных категорий с cap≤3 — variants пустые, и мы не можем правильно
// посчитать цену combo «2× Standard на 4 чел = 4500 × 2 × ночи». Фетч с
// adults=2 (= типичный max для Radde категорий) гарантирует variants для всех
// доступных категорий. Кэш TTL 5 мин на стороне server/utils/bnovo-rates.ts.
const twoAdults = ref(2)
const zeroChildren = ref(0)
const { rooms: comboReferenceRooms } = useAvailableRooms({
  arrival: arrivalRef,
  departure: departureRef,
  adults: twoAdults,
  children: zeroChildren,
})

const selectedAvailable = computed(() => availableRooms.value.find(r => r.id === state.value.roomId))

// Все категории заняты на запрошенный период целиком (PMS не предложил даже
// альтернативных дат). Для UX — показываем общую плашку с предложением
// сократить период.
const allRoomsFullyBooked = computed(() => {
  if (!availableRooms.value || availableRooms.value.length === 0) return false
  return availableRooms.value.every(r => !r.available && !r.nextAvailableFrom && r.availableCount === 0)
})

// Ни один одиночный номер не вмещает состав гостей (cap-fail, например 5 чел
// на категории с max=3). Гриду карточек смысла нет — гость идёт сразу в
// multi-room ниже. Условие отдельное от allRoomsFullyBooked: тут номера
// физически свободны, проблема только в составе.
const allRoomsExceedCapacity = computed(() => {
  if (!availableRooms.value || availableRooms.value.length === 0) return false
  return availableRooms.value.every(r => !r.fitsGuests)
})


// Реакция на изменение состава/дат:
// 1) Если выбранный ранее номер больше не вмещает гостей или закрыт на новые даты —
//    сбрасываем выбор и предупреждаем гостя toast'ом.
// 2) Если после фильтра остался ровно один подходящий номер — авто-выбираем его,
//    чтобы гость не делал лишний клик.
// `loading` сторожим, чтобы не реагировать на промежуточные пустые состояния.
watch(availableRooms, (rooms) => {
  if (!rooms || rooms.length === 0) return
  if (availLoading.value) return

  if (state.value.roomId) {
    const sel = rooms.find(r => r.id === state.value.roomId)
    if (sel && (!sel.fitsGuests || !sel.available)) {
      setRoom(null)
      const reason = !sel.fitsGuests
        ? `${sel.name} не вмещает ${state.value.adults + state.value.children} ${guestsWord(state.value.adults + state.value.children)}`
        : `${sel.name} закрыт на выбранные даты`
      toast.info(`Сбросили выбор номера: ${reason}. Выберите другой ниже.`)
      return
    }
  }

  if (!state.value.roomId) {
    const eligible = rooms.filter(r => r.fitsGuests && r.available)
    if (eligible.length === 1) {
      setRoom(eligible[0].id)
    }
  }
}, { deep: true })

function selectRoom(id: string) {
  setRoom(state.value.roomId === id ? null : id)
}

// ----- Multi-room (большая компания, набор из 2-9 номеров) -----
// Юзер мог нажать «забронировать несколько номеров» в карточке номера, у которой
// не хватает cap'а. Если состав вмещается в самый большой номер (Lux=3 на 3 чел),
// combinator по умолчанию combo не возвращает — поэтому форсим показ при клике.
const userWantsMulti = ref(false)
const roomCombinations = computed(() => {
  if (!availableRooms.value || availableRooms.value.length === 0) return []
  return generateRoomCombinations(
    availableRooms.value,
    state.value.adults + state.value.children,
    { variantsSource: comboReferenceRooms.value, forceMulti: userWantsMulti.value },
  )
})
// Сбрасываем форс-флаг когда меняются даты или состав — следующее открытие
// страницы должно работать в дефолтном режиме (combo только если нужно).
watch([() => state.value.arrival, () => state.value.departure, () => state.value.adults, () => state.value.children], () => {
  userWantsMulti.value = false
})

// Нужен ли вообще мульти-номер режим: либо одиночного номера под состав не хватает,
// либо гость явно нажал «забронировать несколько номеров». Используется для D.5 —
// показать плашку «нет свободных наборов», когда комбинаций на период не нашлось.
const needsMultiRoom = computed(() => allRoomsExceedCapacity.value || userWantsMulti.value)

function roomNameById(id: string): string {
  return availableRooms.value.find(r => r.id === id)?.name ?? id
}

// Первое фото категории для thumbnail'ов в multi-combo карточке.
// На случай если PMS не вернул роом — fallback на placeholder.
function roomFirstPhoto(id: string): string {
  const r = availableRooms.value.find(x => x.id === id)
  return r?.images?.[0] ?? `${base}images/usp/nature/1.jpg`
}

// Клик по превью номера в multi-combo — открывает ту же модалку «Подробнее»
// что и на одиночных карточках. detailRoom watcher лочит body, всё работает.
function openComboRoomDetails(id: string) {
  const r = availableRooms.value.find(x => x.id === id)
  if (r) detailRoom.value = r
}

function peopleSlotsWord(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'место'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'места'
  return 'мест'
}

function isMultiComboActive(combo: RoomCombo): boolean {
  if (!state.value.multiRoom) return false
  if (state.value.multiRoom.length !== combo.items.length) return false
  // Сравнение по signature: items комбо отсортированы стабильно (см. composable),
  // state.multiRoom мы тоже сохраняем в том же порядке через selectMultiCombo.
  const sig = state.value.multiRoom.map(m => `${m.id}:${m.count}`).join('|')
  return sig === combo.signature
}

function selectMultiCombo(combo: RoomCombo) {
  // Toggle: повторный клик по выбранному наборy — снимает выбор.
  if (isMultiComboActive(combo)) {
    setMultiRoom(null)
    return
  }
  setMultiRoom(combo.items.map(i => ({ id: i.id, count: i.count })))
}

// Если состав гостей или даты изменились так, что сохранённый мульти-набор
// больше не подходит (категория закрылась, availableCount упал, гостей мало) —
// сбрасываем выбор и сообщаем гостю.
watch([roomCombinations, () => state.value.multiRoom], ([combos, current]) => {
  if (!current || current.length === 0) return
  if (availLoading.value) return
  const sig = current.map(m => `${m.id}:${m.count}`).join('|')
  const stillValid = combos.some(c => c.signature === sig)
  if (!stillValid) {
    setMultiRoom(null)
    toast.info('Сбросили выбор набора номеров — состав гостей или даты изменились. Выберите новый набор ниже.')
  }
}, { deep: true })

// Клик по карточке номера всегда выбирает (без toggle).
// На кнопке «Выбрать» оставляем toggle, чтобы её можно было нажать повторно
// для отмены выбора. При клике по самой карточке — toggle сбивал бы UX.
function pickRoom(r: { id: string; fitsGuests: boolean; available: boolean }) {
  if (!r.fitsGuests || !r.available) return
  setRoom(r.id)
}

// Когда категория закрыта на выбранные даты, Bnovo подсказывает альтернативный
// период (той же длины что у гостя запрошен). Подставляем оба конца:
//   arrival = next_available_from, departure = next_available_to.
// Если API не вернул `to` (старый клиент-кэш или fallback fc-окна короткие) —
// считаем сами от requestedNights.
function applyAlternativeDates(r: {
  id: string
  nextAvailableFrom: string | null
  nextAvailableTo: string | null
  nextAvailableNights: number | null
}) {
  if (!r.nextAvailableFrom) return
  state.value.arrival = r.nextAvailableFrom
  if (r.nextAvailableTo) {
    state.value.departure = r.nextAvailableTo
  } else {
    const nights = r.nextAvailableNights && r.nextAvailableNights > 0 ? r.nextAvailableNights : 1
    const d = new Date(r.nextAvailableFrom)
    d.setDate(d.getDate() + nights)
    state.value.departure = d.toISOString().slice(0, 10)
  }
  setRoom(r.id)
}

function nightsLabel(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'ночь'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'ночи'
  return 'ночей'
}

// Поиск ближайшего свободного окна нужной длительности под состав гостя.
// Сервер сканирует даты вперёд (см. /api/next-available). Применяем найденные
// даты в форму; если задан slug — заодно выбираем эту категорию.
const searchingDates = ref(false)
async function applyNearestWindow(reqNights: number, slug?: string) {
  if (searchingDates.value) return
  searchingDates.value = true
  try {
    const res = await $fetch<{ ok: boolean; window: { from: string; to: string; nights: number } | null }>(
      '/api/next-available',
      { query: { nights: Math.max(1, reqNights), adults: state.value.adults, children: state.value.children, ...(slug ? { slug } : {}) } },
    )
    if (res.window) {
      state.value.arrival = res.window.from
      state.value.departure = res.window.to
      if (slug) setRoom(slug)
      toast.success(`Подобрали свободные даты: ${formatDate(res.window.from)} — ${formatDate(res.window.to)}`)
      scrollToEl(roomSectionRef.value)
    } else {
      toast.info('Не нашли свободное окно в ближайшие недели — позвоните, ресепшн подберёт даты.')
    }
  } catch {
    toast.error('Не удалось подобрать даты. Попробуйте ещё раз или позвоните нам.')
  } finally {
    searchingDates.value = false
  }
}

function guestsWord(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'гость'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'гостя'
  return 'гостей'
}

// Самый вместительный доступный номер — для подсказки «выберите вместо неподходящего».
// Берём по effectiveCapacity (для Радде это Люкс с до 5 чел).
const biggestRoom = computed(() => {
  return [...availableRooms.value]
    .filter(r => r.available)
    .sort((a, b) => (b.effectiveCapacity ?? 0) - (a.effectiveCapacity ?? 0))[0]
})
const biggestRoomName = computed(() => biggestRoom.value?.name ?? '')
const biggestRoomCap = computed(() => biggestRoom.value?.effectiveCapacity ?? 0)

function scrollToBiggestRoom() {
  const big = biggestRoom.value
  if (!big) return
  if (big.effectiveCapacity >= state.value.adults + state.value.children) setRoom(big.id)
  // Скроллим к самой карточке, а не к началу раздела — так гость сразу видит
  // подсветку выбранного номера и спецификацию.
  const card = import.meta.client
    ? document.querySelector<HTMLElement>(`[data-room-id="${big.id}"]`)
    : null
  scrollToEl(card ?? roomSectionRef.value)
}

// Скролл к секции «Несколько номеров для компании» — её показываем под room-pick
// когда есть валидные комбинации. Юзер мог попасть сюда из карточки номера,
// у которой не хватает cap'а — нужно форсить показ combo даже если есть Lux,
// вмещающий всех (combinator иначе возвращает [] из-за fitsSingle short-circuit).
const multiRoomSectionRef = ref<HTMLElement>()
async function suggestSplitRooms() {
  // Сначала включаем форс — combinator пересчитается через computed.
  userWantsMulti.value = true
  await nextTick()
  if (multiRoomSectionRef.value) {
    scrollToEl(multiRoomSectionRef.value)
  } else if (roomCombinations.value.length === 0) {
    // Реально нет вариантов (все номера заняты или candidate'ов <2) — показываем toast.
    toast.info('Под ваши даты не получилось собрать набор номеров автоматически. Позвоните — ресепшн подберёт варианты.')
  } else {
    // Combos есть, но secReef ещё не прокрашен — подождём ещё тик и скроллим.
    await nextTick()
    if (multiRoomSectionRef.value) scrollToEl(multiRoomSectionRef.value)
  }
}

// ----- Pre-select from URL -----
onMounted(() => {
  const roomId = route.query.room
  if (typeof roomId === 'string') setRoom(roomId)
  const extraId = route.query.extra
  if (typeof extraId === 'string') {
    const extra = extras.find(e => e.id === extraId)
    if (extra && getExtraCount(extra.id) === 0) addExtra(extra)
  }
})

// ----- Extras -----
const extraCategories = [
  { id: 'all', label: 'Все' },
  { id: 'food', label: 'Питание' },
  { id: 'active', label: 'Активный отдых' },
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

// Extras и Room модалки на /booking — блокируем body для iOS,
// иначе на iPhone страница продолжает скроллиться за модалкой.
const bodyLock = useBodyLock()
const detailExtra = ref<ExtraDef | null>(null)
function addExtra(extra: ExtraDef) {
  // Услуга — простой переключатель: выбрана (count=1) или нет. Без множителей
  // «На скольких / Раз в день» — все услуги оплачиваются отдельно при заселении.
  setExtraCount(extra.id, 1)
}

function extrasCountWord(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'услуга'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'услуги'
  return 'услуг'
}
function addExtraFromModal() {
  if (!detailExtra.value) return
  if (getExtraCount(detailExtra.value.id) === 0) addExtra(detailExtra.value)
  detailExtra.value = null
}
watch(detailExtra, (val, prev) => {
  if (!import.meta.client) return
  if (val && !prev) {
    bodyLock.lock()
    useLenis().instance()?.stop()
  } else if (!val && prev) {
    bodyLock.unlock()
    useLenis().instance()?.start()
  }
})

// ----- Free included modal -----
// «Бесплатные услуги — уже в цене» — кликабельная карточка в summary aside.
// При первом клике снимается pulse-анимация (freeInclSeen=true).
type FreeIncludedItem = {
  id: string
  title: string
  short: string
  full: string
  icon: string
}
const freeIncludedItems: FreeIncludedItem[] = [
  {
    id: 'breakfast',
    title: 'Завтрак',
    short: 'Каши, выпечка, сыры, чай из горных трав',
    full: 'Каждое утро в столовой — домашний завтрак из свежих местных продуктов. Горячие каши, дагестанская выпечка из тандыра, варёные яйца, домашние сыры, мёд, масло, чай из горных трав. Время: 08:30–10:30. Детское меню — по запросу.',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13h16a8 8 0 0 1 -8 8a8 8 0 0 1 -8 -8" /><path d="M5 13a7 7 0 0 1 14 0" /><path d="M19 13h2" /><path d="M3 13h2" /><path d="M12 4v-1" /><path d="M9 6c-1 -1 -1 -2 0 -3" /><path d="M15 6c-1 -1 -1 -2 0 -3" /></svg>',
  },
  {
    id: 'wifi',
    title: 'Wi-Fi',
    short: 'Стабильно, хватает на видеозвонки',
    full: 'Wi-Fi покрывает всю территорию пансионата и работает в каждом номере. Скорости достаточно для видеозвонков, стримов и работы. Сотовая связь тоже стабильная — все российские операторы ловят. Не отключаемся от мира, если не хотим.',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18l.01 0" /><path d="M9.172 15.172a4 4 0 0 1 5.656 0" /><path d="M6.343 12.343a8 8 0 0 1 11.314 0" /><path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0" /></svg>',
  },
  {
    id: 'parking',
    title: 'Парковка',
    short: 'Закрытая, видеонаблюдение круглосуточно',
    full: 'Закрытая парковка на территории пансионата. Места хватает всем гостям, даже в высокий сезон. Видеонаблюдение работает круглосуточно. Одно место на номер по умолчанию, дополнительные — по запросу.',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 16v-8h4a2 2 0 0 1 0 4h-4" /></svg>',
  },
  {
    id: 'heating',
    title: 'Отопление и тёплая вода',
    short: 'Зимой в номере тепло, можно регулировать',
    full: 'В каждом номере регулируемое отопление — выставляете температуру, которая нравится. Горячая вода круглосуточно. На улице может быть -10, у вас в номере — комфортные +24, если захотите.',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l0 1.5" /><path d="M12 19.5l0 1.5" /><path d="M3 12l1.5 0" /><path d="M19.5 12l1.5 0" /><path d="M5.6 5.6l1.1 1.1" /><path d="M17.3 17.3l1.1 1.1" /><path d="M5.6 18.4l1.1 -1.1" /><path d="M17.3 6.7l1.1 -1.1" /><circle cx="12" cy="12" r="3" /></svg>',
  },
  {
    id: 'linen',
    title: 'Бельё и полотенца',
    short: 'Свежий комплект и каждые 3 дня замена',
    full: 'Свежее постельное бельё и комплект полотенец (банное + лицевое + ножное) — при заселении. Замена каждые 3 дня или по запросу — скажите ресепшну, заменим в день обращения. Дополнительные подушки, одеяла, детские принадлежности — бесплатно.',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l3 -1l4 1l4 -1l4 1l3 -1v13l-3 1l-4 -1l-4 1l-4 -1l-3 1z" /><path d="M6 6v14" /><path d="M10 7v13" /><path d="M14 7v13" /><path d="M18 6v14" /></svg>',
  },
  {
    id: 'air',
    title: 'Горный воздух',
    short: '1 800 м над морем, реликтовый лес',
    full: 'Пансионат стоит на высоте 1 800 м над уровнем моря, прямо в реликтовом лесу. Воздух — лечебный: хвоя, травы, минеральные источники. Горные тропы и маршруты на любой уровень подготовки начинаются прямо от ворот.',
    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19l4 -6l3 4l4 -7l7 9z" /><circle cx="7" cy="6" r="2" /></svg>',
  },
]

// Округляем дробные цены при отображении. PMS Bnovo отдаёт total за период,
// мы конвертим в per-night = total/nights — может выйти float (28000/3 = 9333.33).
// Храним float (точное значение), на UI округляем display, итог = per-night × nights
// без потери копеек (28000.00 → 28 000 ₽, не 27 999).
function fmtPrice(n: number): string {
  return Math.round(n).toLocaleString('ru-RU')
}

const freeInclModal = reactive<{ open: boolean; detail: FreeIncludedItem | null }>({ open: false, detail: null })
// Pulse-анимация на бейдже отыгрывается, пока гость ни разу не нажал.
// Сохраняем флаг в localStorage, чтобы не дёргать при возвратах.
const freeInclSeen = ref(false)
if (import.meta.client) {
  try { freeInclSeen.value = localStorage.getItem('radde:free-incl-seen') === '1' } catch { /* private mode */ }
}
function openFreeIncluded() {
  freeInclModal.open = true
  if (!freeInclSeen.value) {
    freeInclSeen.value = true
    try { localStorage.setItem('radde:free-incl-seen', '1') } catch { /* ignore */ }
  }
}
watch(() => freeInclModal.open, (val, prev) => {
  if (!import.meta.client) return
  if (val && !prev) {
    bodyLock.lock()
    useLenis().instance()?.stop()
  } else if (!val && prev) {
    if (!freeInclModal.detail) {
      bodyLock.unlock()
      useLenis().instance()?.start()
    }
  }
})
watch(() => freeInclModal.detail, (val, prev) => {
  if (!import.meta.client) return
  if (val && !prev) {
    bodyLock.lock()
  } else if (!val && prev) {
    bodyLock.unlock()
    if (!freeInclModal.open) useLenis().instance()?.start()
  }
})

// ----- Room modal -----
// RoomDetailsModal сама лочит body через useBodyLock — здесь только ref
const detailRoom = ref<typeof availableRooms.value[0] | null>(null)

// Снапшот цен/доступности для модалки на текущие даты+состав. PMS-цены
// и слоты по составу из useAvailableRooms — модалка покажет «прайс по составам»,
// подсветит активный слот и в футере отрисует «итог × N ночей».
const detailRoomAvailability = computed(() => {
  if (!detailRoom.value) return null
  // Передаём effective — это то, под что PMS выдал variants. Иначе подсветка
  // активного варианта в модалке не находит match (искала {2,1}, PMS вернул {3,0}).
  return {
    pricePerNight: detailRoom.value.pricePerNight,
    priceVariants: detailRoom.value.priceVariants,
    nights: nights.value,
    adults: effectiveAdults.value,
    children: effectiveChildren.value,
  }
})

// ----- Phone -----
function handlePhone(e: Event) {
  state.value.guest.phone = phoneMaskInput(e)
}

// ----- Format helpers -----
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

// Линия в summary под названием номера — состав гостей.
const roomCompositionLine = computed(() => guestSummary.value)

// ----- Totals -----
const totalGuests = computed(() => state.value.adults + state.value.children)

// Цена за ночь для мульти-номер выбора. Если выбранный набор есть среди
// сгенерированных combinations — берём его точную цену (там уже посчитан
// distribution гостей по номерам через variants PMS). Иначе — fallback на
// сумму priceValue (базовая статичная цена).
function multiRoomNightlyPrice(items: { id: string; count: number }[]): number {
  if (items.length === 0) return 0
  const sig = items.map(m => `${m.id}:${m.count}`).join('|')
  const matched = roomCombinations.value.find(c => c.signature === sig)
  if (matched) return matched.pricePerNight
  // Fallback: combo больше нет в списке (даты/гости поменялись).
  let sum = 0
  for (const item of items) {
    const room = availableRooms.value.find(r => r.id === item.id)
    if (!room) continue
    sum += room.priceValue * item.count
  }
  return sum
}

const totals = computed(() => {
  const n = Math.max(1, nights.value)
  let roomTotal = 0
  if (state.value.multiRoom && state.value.multiRoom.length > 0) {
    roomTotal = multiRoomNightlyPrice(state.value.multiRoom) * n
  } else {
    const room = selectedAvailable.value
    roomTotal = room ? room.pricePerNight * n : 0
  }
  // Доп. услуги оплачиваются ОТДЕЛЬНО при заселении — в «Итого» (сумму брони
  // и аванс) они НЕ входят. Их сумма показывается отдельной строкой в саммари
  // и уходит в комментарий к брони (фидбек Mark 06.2026).
  return { roomTotal, total: roomTotal }
})

// ----- Multi-room summary helpers -----
const multiRoomTotalRooms = computed(() => {
  if (!state.value.multiRoom) return 0
  return state.value.multiRoom.reduce((s, item) => s + item.count, 0)
})

const multiRoomComposition = computed(() => {
  if (!state.value.multiRoom) return ''
  let cap = 0
  for (const item of state.value.multiRoom) {
    const room = availableRooms.value.find(r => r.id === item.id)
    if (!room) continue
    cap += room.guests * item.count
  }
  return `${totalGuests.value} ${guestsWord(totalGuests.value)} в ${multiRoomTotalRooms.value} ${peopleSlotsRoomsWord(multiRoomTotalRooms.value)} (до ${cap} мест)`
})

function peopleSlotsRoomsWord(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'номере'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'номерах'
  return 'номерах'
}

function multiRoomLinePrice(item: { id: string; count: number }): number {
  // Точная цена per slug = сумма slotPrices физических номеров этого slug'а
  // (распределение гостей через combinator) × число ночей. Это даёт реальную
  // разбивку: «Люкс 12 000 ₽ + Стандарт 9 000 ₽» вместо pro-rated усреднения.
  if (!state.value.multiRoom) return 0
  const sig = state.value.multiRoom.map(m => `${m.id}:${m.count}`).join('|')
  const matched = roomCombinations.value.find(c => c.signature === sig)
  const n = Math.max(1, nights.value)
  if (!matched || matched.totalRooms === 0) {
    const room = availableRooms.value.find(r => r.id === item.id)
    if (!room) return 0
    return room.priceValue * item.count * n
  }
  let nightly = 0
  for (let i = 0; i < matched.distribution.length; i++) {
    if (matched.distribution[i]!.roomId === item.id) {
      nightly += matched.slotPrices[i] ?? 0
    }
  }
  // Фолбэк, если combinator не записал slotPrices (старый кэш) — pro-rated.
  if (nightly === 0) {
    nightly = matched.pricePerNight * (item.count / matched.totalRooms)
  }
  return nightly * n
}

// Услуги в саммари — плоский список «название + цена за единицу». Без формул
// и множителей: услуга либо выбрана, либо нет. Оплата отдельно при заселении.
const summaryExtras = computed(() => {
  return state.value.extras
    .map(sel => {
      const meta = extras.find(e => e.id === sel.id)
      if (!meta) return null
      return { id: meta.id, title: meta.title, amount: meta.priceValue }
    })
    .filter((x): x is { id: string; title: string; amount: number } => x !== null)
})

const summaryExtrasTotal = computed(() =>
  summaryExtras.value.reduce((s, line) => s + line.amount, 0),
)

const summaryExtrasOpen = ref(false)

// Блок «Условия бронирования» — гармошка (по умолчанию свёрнут), как FAQ на главной.
const rulesOpen = ref(false)

const hasAnySelection = computed(() =>
  !!state.value.roomId
  || (!!state.value.multiRoom && state.value.multiRoom.length > 0)
  || state.value.extras.length > 0
  || state.value.guest.firstName
  || state.value.guest.phone
  || state.value.comment,
)

// ----- Mobile horizontal scroll hint для услуг -----
const extrasGridRef = ref<HTMLElement>()
const extrasIsMobile = ref(false)
const extrasHasOverflow = ref(false)
const extrasShowHint = computed(() => extrasIsMobile.value && extrasHasOverflow.value)

function checkExtrasOverflow() {
  if (!extrasGridRef.value) return
  extrasHasOverflow.value = extrasGridRef.value.scrollWidth > extrasGridRef.value.clientWidth + 1
}

watch([extraTab, () => visibleExtras.value.length, extrasIsMobile], () => {
  nextTick(checkExtrasOverflow)
})

onMounted(() => {
  if (!import.meta.client) return
  const mq = window.matchMedia('(max-width: 767px)')
  extrasIsMobile.value = mq.matches
  const onMqChange = (e: MediaQueryListEvent) => { extrasIsMobile.value = e.matches }
  mq.addEventListener('change', onMqChange)
  onUnmounted(() => mq.removeEventListener('change', onMqChange))
  nextTick(checkExtrasOverflow)
  const ro = new ResizeObserver(() => checkExtrasOverflow())
  if (extrasGridRef.value) ro.observe(extrasGridRef.value)
  onUnmounted(() => ro.disconnect())
})

// ----- Refs для скролла к ошибочным полям -----
const datesSectionRef = ref<HTMLElement>()
const roomSectionRef = ref<HTMLElement>()
const contactsSectionRef = ref<HTMLElement>()
const nameInputRef = ref<HTMLInputElement>()
const phoneInputRef = ref<HTMLInputElement>()
// ----- Children/adults counters -----
// Единый лимит на общее число гостей. Физическая ёмкость пансионата:
// 9 номеров VIP/Pano/Lux/Standard суммарно вмещают до 18 человек.
// Группы крупнее одного номера (>3 чел) обслуживаются мульти-номером (см. секцию
// «Несколько номеров для компании» в шаге 2).
const MAX_GUESTS = 18
const totalGuestsCount = computed(() => state.value.adults + state.value.children)

// При +1 ребёнок дополняем массив значением -1 («не выбран») — гость обязан кликнуть таб.
// При -1 — удаляем последний.
function incrementAdults() {
  if (totalGuestsCount.value >= MAX_GUESTS) return
  state.value.adults = Math.min(MAX_GUESTS, state.value.adults + 1)
}
function incrementChildren() {
  if (totalGuestsCount.value >= MAX_GUESTS) return
  state.value.children += 1
  state.value.childrenAges = [...state.value.childrenAges, -1].slice(0, state.value.children)
}
function decrementChildren() {
  if (state.value.children <= 0) return
  state.value.children -= 1
  state.value.childrenAges = state.value.childrenAges.slice(0, state.value.children)
}
function ageWord(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'год'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'года'
  return 'лет'
}

// Порядковый номер ребёнка в форме (UI). Max children в форме = 6.
function childOrdinal(n: number): string {
  const map: Record<number, string> = { 1: 'Первый', 2: 'Второй', 3: 'Третий', 4: 'Четвёртый', 5: 'Пятый', 6: 'Шестой' }
  return map[n] ?? `${n}-й`
}
// На случай если в localStorage остались несогласованные значения — выравниваем длину массива.
// Прошлая версия писала default=10, новая default=-1 («не выбран»). При расхождении длины добавляем
// именно -1, чтобы гость точно выбрал возраст вручную.
watch(() => state.value.children, (n) => {
  if (!Array.isArray(state.value.childrenAges)) state.value.childrenAges = []
  if (state.value.childrenAges.length < n) {
    state.value.childrenAges = [
      ...state.value.childrenAges,
      ...Array.from({ length: n - state.value.childrenAges.length }, () => -1),
    ]
  } else if (state.value.childrenAges.length > n) {
    state.value.childrenAges = state.value.childrenAges.slice(0, n)
  }
}, { immediate: true })

const errorField = ref<'name' | 'lastName' | 'email' | 'phone' | 'consent' | null>(null)
const confirmReset = ref(false)
const consentInputRef = ref<{ focus: () => void } | null>(null)
// Согласие — храним в localStorage, чтобы при возврате на /booking после успешной
// отправки гостю не пришлось ставить галочку заново.
const consentGiven = ref(false)
const CONSENT_KEY = 'radde_booking_consent'
if (import.meta.client) {
  try {
    consentGiven.value = localStorage.getItem(CONSENT_KEY) === 'true'
  } catch { /* private mode / quota — игнор */ }
  watch(consentGiven, (v) => {
    try { localStorage.setItem(CONSENT_KEY, String(v)) } catch { /* ignore */ }
  }, { flush: 'sync' })
}
const lastNameInputRef = ref<HTMLInputElement>()
const emailInputRef = ref<HTMLInputElement>()

// ----- Модалки для конфликтов после submit -----
const unavailableModal = ref<{
  open: boolean
  bookingId: number | null
  nextFrom: string | null
  nextNights: number | null
  roomName: string
}>({
  open: false, bookingId: null, nextFrom: null, nextNights: null, roomName: '',
})
const bnovoErrorModal = ref<{
  open: boolean
  bookingId: number | null
  reason: string
}>({
  open: false, bookingId: null, reason: '',
})

function formatDateLong(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getDate()} ${months[d.getMonth()]}`
}

// Переносим выбранные даты на ту, что предложила Bnovo, и оставляем гостя
// на странице — он может проверить итог и нажать «Отправить» снова.
function applyUnavailableDates() {
  const m = unavailableModal.value
  if (!m.nextFrom) return
  state.value.arrival = m.nextFrom
  const nights = m.nextNights && m.nextNights > 0 ? m.nextNights : 1
  const d = new Date(m.nextFrom)
  d.setDate(d.getDate() + nights)
  state.value.departure = d.toISOString().slice(0, 10)
  unavailableModal.value.open = false
  scrollToEl(datesSectionRef.value)
}

function pickAnotherRoom() {
  state.value.roomId = null
  unavailableModal.value.open = false
  scrollToEl(roomSectionRef.value)
}

// ----- Mobile sticky «Далее» -----
// Кнопка появляется на мобиле когда выбран номер и блок итогов ещё НЕ виден
// в viewport. Label всегда «Далее».
// Логика клика:
//  1) обязательные контакты не заполнены → скролл к секции контактов (без
//     forced focus — иначе если гость уже на этой секции, выглядит как
//     «ничего не происходит»; пусть гость сам ткнёт в нужное поле)
//  2) обязательные контакты заполнены → скролл к summary-card
// Скрытие через IntersectionObserver на summary-card. Как только итоги хотя
// бы частично попали в viewport (~5%) — кнопку прячем, гость уже долистал.
// На ПК скрыта через md:hidden — там sticky sidebar.
const summaryCardRef = ref<HTMLElement>()
const summaryVisible = ref(false)

const showMobileNext = computed(() => {
  const hasRoom = !!state.value.roomId || (!!state.value.multiRoom && state.value.multiRoom.length > 0)
  return hasRoom && !summaryVisible.value
})

function goToNextStep() {
  const g = state.value.guest

  // Идём по обязательным полям в DOM-порядке (firstName → lastName → phone → email)
  // и на первом невалидном останавливаемся: подсвечиваем поле через errorField,
  // скроллим к секции контактов И ставим фокус — клавиатура на мобиле сразу
  // откроется, гость продолжает заполнять без лишних кликов. После исправления
  // конкретного поля errorField для него снимается через watcher ниже.
  if (!g.firstName || !g.firstName.trim()) {
    errorField.value = 'name'
    scrollToEl(contactsSectionRef.value, nameInputRef.value)
    return
  }
  if (!g.lastName || !g.lastName.trim()) {
    errorField.value = 'lastName'
    scrollToEl(contactsSectionRef.value, lastNameInputRef.value)
    return
  }
  if ((g.phone || '').replace(/\D/g, '').length < 11) {
    errorField.value = 'phone'
    scrollToEl(contactsSectionRef.value, phoneInputRef.value)
    return
  }
  const emailTrim = (g.email || '').trim()
  const atIdx = emailTrim.indexOf('@')
  const dotAfterAt = atIdx > 0 ? emailTrim.indexOf('.', atIdx) : -1
  const emailValid = atIdx > 0 && dotAfterAt > atIdx + 1 && dotAfterAt < emailTrim.length - 1
  if (!emailValid) {
    errorField.value = 'email'
    scrollToEl(contactsSectionRef.value, emailInputRef.value)
    return
  }

  // Все обязательные заполнены — снимаем подсветку и скроллим к итогам.
  errorField.value = null
  if (summaryCardRef.value) {
    scrollToEl(summaryCardRef.value)
    return
  }
  scrollToEl(contactsSectionRef.value)
}

// Снимаем подсветку с поля как только гость начал в нём что-то править —
// иначе амбер-обводка остаётся пока гость не нажмёт submit. Не сбрасываем
// errorField других полей: они подсветятся при следующем клике «Далее».
watch(() => state.value.guest.firstName, () => { if (errorField.value === 'name') errorField.value = null })
watch(() => state.value.guest.lastName,  () => { if (errorField.value === 'lastName') errorField.value = null })
watch(() => state.value.guest.phone,     () => { if (errorField.value === 'phone') errorField.value = null })
watch(() => state.value.guest.email,     () => { if (errorField.value === 'email') errorField.value = null })

// IntersectionObserver: следим за summary-card. Когда хотя бы ~5% его попало
// в viewport — гость уже долистал до итогов, кнопку скрываем.
onMounted(() => {
  if (!import.meta.client || !summaryCardRef.value) return
  const io = new IntersectionObserver(
    (entries) => { summaryVisible.value = entries[0]?.isIntersecting ?? false },
    { threshold: 0.05 },
  )
  io.observe(summaryCardRef.value)
  onUnmounted(() => io.disconnect())
})

function scrollToEl(el: HTMLElement | undefined, focusEl?: HTMLElement) {
  if (!import.meta.client || !el) return
  const lenis = useLenis().instance()
  if (lenis) lenis.scrollTo(el, { offset: -90, duration: 0.6 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  if (focusEl) setTimeout(() => focusEl.focus({ preventScroll: true }), 600)
}

// ----- Submit -----
const submitting = ref(false)
// Сброс «зависшего» submitting при возврате на /booking через history-back.
// Vue keep-alive/persistent state может сохранить ref между переходами,
// и кнопка остаётся в состоянии «Бронируем…».
onMounted(() => { submitting.value = false })

async function submit() {
  try {
    await submitInner()
  } catch (err: any) {
    // Любая необработанная JS-ошибка в submit'е (например combo.distribution undefined,
    // payload assembly bug) — снимаем «Бронируем…» и показываем гостю что не так.
    submitting.value = false
    console.error('[booking-submit-error]', err)
    toast.error(`Не удалось отправить заявку: ${err?.message ?? 'внутренняя ошибка'}. Попробуйте ещё раз или позвоните нам.`)
  }
}

async function submitInner() {
  errorField.value = null

  if (!state.value.arrival || !state.value.departure || nights.value <= 0) {
    toast.error('Укажите даты заезда и выезда')
    scrollToEl(datesSectionRef.value)
    return
  }
  // Валидируем что выбран либо одиночный номер, либо набор (мульти-номер).
  const hasMultiRoom = !!state.value.multiRoom && state.value.multiRoom.length > 0
  if (!state.value.roomId && !hasMultiRoom) {
    toast.error('Выберите номер или набор номеров для компании')
    // Скроллим к мульти-секции если она есть (большая компания) — иначе к обычным карточкам.
    scrollToEl(multiRoomSectionRef.value ?? roomSectionRef.value)
    return
  }
  const trimmedFirst = state.value.guest.firstName.trim()
  const trimmedLast = state.value.guest.lastName.trim()
  if (!trimmedFirst) {
    toast.error('Укажите имя')
    errorField.value = 'name'
    scrollToEl(contactsSectionRef.value, nameInputRef.value)
    return
  }
  if (!trimmedLast) {
    toast.error('Укажите фамилию')
    errorField.value = 'lastName'
    scrollToEl(contactsSectionRef.value, lastNameInputRef.value)
    return
  }
  if (state.value.guest.phone.replace(/\D/g, '').length < 11) {
    toast.error('Укажите корректный телефон')
    errorField.value = 'phone'
    scrollToEl(contactsSectionRef.value, phoneInputRef.value)
    return
  }
  // Возрасты детей: все должны быть выбраны (а не остаться в default -1).
  if (state.value.children > 0) {
    const ages = state.value.childrenAges ?? []
    const missing = ages.findIndex(a => typeof a !== 'number' || a < 0 || a > 17)
    if (missing >= 0 || ages.length < state.value.children) {
      toast.error('Выберите возраст для каждого ребёнка')
      scrollToEl(datesSectionRef.value)
      return
    }
  }
  // Email обязательный — Bnovo не примет броню без него.
  const emailTrimmed = state.value.guest.email.trim()
  if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    toast.error('Укажите корректный email — на него придёт подтверждение')
    errorField.value = 'email'
    scrollToEl(contactsSectionRef.value, emailInputRef.value)
    return
  }
  if (!consentGiven.value) {
    toast.error('Подтвердите согласие на обработку персональных данных')
    errorField.value = 'consent'
    if (consentInputRef.value) consentInputRef.value.focus()
    return
  }

  submitting.value = true

  const room = selectedAvailable.value
  const isMultiRoom = !!state.value.multiRoom && state.value.multiRoom.length > 0
  // Город не у Bnovo, но менеджеру важно знать откуда гость — добавляем
  // в начало комментария.
  const city = state.value.guest.city.trim()
  // Доп. услуги оплачиваются отдельно — в Bnovo как платные позиции их НЕ шлём,
  // а добавляем читаемым блоком в комментарий к брони (он уходит в notes Bnovo,
  // в Telegram ресепшну и в нашу БД). Mark 06.2026.
  const servicesLines = summaryExtras.value.map(l => `• ${l.title} — ${fmtPrice(l.amount)} ₽`)
  const servicesBlock = servicesLines.length
    ? `Доп. услуги (оплата отдельно при заселении):\n${servicesLines.join('\n')}\nИтого услуг: ${fmtPrice(summaryExtrasTotal.value)} ₽`
    : ''
  const fullComment = [
    city ? `Город: ${city}` : '',
    state.value.comment,
    servicesBlock,
  ].filter(Boolean).join('\n').trim()

  // В мульти-режиме шлём payload.rooms с distribution per номер (adults/children
  // на каждый физический номер). Backend через bnovo-booking превратит это в
  // ОДИН POST в Bnovo (с roomTypes={...} и services={...} per room) — атомарно,
  // один bookingNumber, одна предоплата на всю группу.
  // Bnovo использует services.count как сигнал «N гостей в этом номере»
  // → берёт правильный variant цены (подтверждено HAR в radde/bnovo_tests/nr_3).
  let payloadRooms: Array<{
    room_type_id: string | null
    rate_id: string | null
    guests: Array<{ adults: number; children: number; childrenAges: number[] }>
  }>

  if (isMultiRoom) {
    const sig = state.value.multiRoom!.map(m => `${m.id}:${m.count}`).join('|')
    const combo = roomCombinations.value.find(c => c.signature === sig)
    if (!combo) {
      submitting.value = false
      toast.error('Выбранный набор номеров больше не доступен — выберите заново.')
      scrollToEl(multiRoomSectionRef.value)
      return
    }
    // Делим детей по номерам: первые children идут в первые номера. Возрасты
    // прикрепляем последовательно. Распределение приближённое — менеджер
    // уточняет при подтверждении.
    // Берём ТОЛЬКО детей <15 — те, что 15+, уже учтены как adults в effective*.
    const allAges = effectiveChildrenAges.value.slice(0, effectiveChildren.value)
    let agesIdx = 0
    payloadRooms = combo.distribution.map((slot, slotIdx) => {
      const totalForRoom = slot.guests
      const remainingRooms = combo.distribution.length - slotIdx
      const remainingAges = allAges.length - agesIdx
      // Кладём в номер столько детей, сколько влезает, но не больше пропорции
      const childrenInRoom = Math.min(
        totalForRoom,
        Math.ceil(remainingAges / remainingRooms),
      )
      const ages = allAges.slice(agesIdx, agesIdx + childrenInRoom)
      agesIdx += childrenInRoom
      return {
        room_type_id: slot.roomId,
        rate_id: null,
        guests: [{
          adults: Math.max(1, totalForRoom - childrenInRoom),
          children: childrenInRoom,
          childrenAges: ages,
        }],
      }
    })
  } else {
    payloadRooms = [{
      // На сервере используется как ключ маппинга на Bnovo room_type_id.
      room_type_id: room?.id ?? null,
      rate_id: null,
      guests: [{
        // effective* перебрасывает детей 15+ в adults — PMS подбирает тариф
        // для нужного числа взрослых, считает корректную цену (Mark кейс
        // 22-25.05: 2взр + 1реб 15л → 3взр в PMS → 28 000 ₽ вместо 26 500).
        adults: effectiveAdults.value,
        children: effectiveChildren.value,
        childrenAges: effectiveChildrenAges.value,
      }],
    }]
  }

  const payload = {
    arrival: state.value.arrival,
    departure: state.value.departure,
    rooms: payloadRooms,
    guest: {
      first_name: trimmedFirst,
      last_name: trimmedLast,
      email: state.value.guest.email,
      phone: state.value.guest.phone,
      city,
    },
    extras: state.value.extras.map(sel => {
      const meta = extras.find(e => e.id === sel.id)
      return {
        id: meta?.bnovoServiceId ?? null,
        slug: sel.id,
        count: 1,
      }
    }),
    comment: fullComment,
    total_estimate: totals.value.total,
    consent: true as const,
  }

  let bookingResult: {
    ok: boolean
    id: number
    bnovoBookingNumber: string | null
    paymentUrl: string | null
    paymentDeadline?: string | null
    conflict?: 'unavailable' | 'bnovo_error' | null
    bnovoError?: string | null
    nextAvailableFrom?: string | null
    nextAvailableNights?: number | null
  }
  try {
    bookingResult = await $fetch('/api/booking', { method: 'POST', body: payload })
  } catch (err: any) {
    submitting.value = false
    const msg = err?.data?.message || err?.statusMessage || err?.message || 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.'
    toast.error(msg)
    return
  }

  // Если выбранный номер только что заняли (повторная проверка на сервере) —
  // показываем модалку с альтернативной датой и кнопкой «перенести даты».
  if (bookingResult?.conflict === 'unavailable') {
    submitting.value = false
    unavailableModal.value = {
      open: true,
      bookingId: bookingResult.id,
      nextFrom: bookingResult.nextAvailableFrom ?? null,
      nextNights: bookingResult.nextAvailableNights ?? null,
      roomName: room?.name ?? '',
    }
    return
  }
  // Если Bnovo не смог принять заявку по другой причине — показываем
  // «менеджер свяжется», без редиректа на success (чтобы гость не думал
  // что бронь автоматически подтверждена).
  if (bookingResult?.conflict === 'bnovo_error') {
    submitting.value = false
    bnovoErrorModal.value = {
      open: true,
      bookingId: bookingResult.id,
      reason: bookingResult.bnovoError ?? '',
    }
    return
  }

  // Записываем «последнюю отправленную» в localStorage — success.vue её читает
  // и показывает имя гостя, наш ID, номер брони Bnovo и (если есть) paymentUrl.
  if (import.meta.client) {
    try {
      localStorage.setItem('radde_booking_last', JSON.stringify({
        firstName: state.value.guest.firstName,
        phone: state.value.guest.phone,
        ourId: bookingResult?.id ?? null,
        bnovoNumber: bookingResult?.bnovoBookingNumber ?? null,
        paymentUrl: bookingResult?.paymentUrl ?? null,
        paymentDeadline: bookingResult?.paymentDeadline ?? null,
        totalEstimate: totals.value.total,
      }))
    } catch { /* ignore */ }
  }

  // Сбрасываем разделы 2 (номер) и 3 (услуги, комментарий) — гость начнёт новую
  // бронь чистым. Разделы 1 (даты/гости) и 4 (контакты) сохраняем, плюс consent
  // (он сохранён в localStorage). submitting сбрасываем чтобы при возврате
  // через history.back кнопка снова была активной.
  state.value.roomId = null
  state.value.multiRoom = null
  state.value.extras = []
  state.value.comment = ''
  submitting.value = false

  // В query — id и номер брони, чтобы ссылку можно было переслать ресепшну
  // (например, в WhatsApp) и сразу видеть какую именно бронь обсуждаем.
  // Сама ссылка на оплату не передаётся через query (она длинная и одноразовая),
  // а ложится в localStorage. На success-странице — кнопка «Оплатить аванс»
  // открывает её в новой вкладке.
  const q = new URLSearchParams()
  if (bookingResult?.id) q.set('id', String(bookingResult.id))
  if (bookingResult?.bnovoBookingNumber) q.set('bnovo', bookingResult.bnovoBookingNumber)
  if (bookingResult?.paymentUrl) q.set('pay', '1')
  const qs = q.toString()
  window.location.href = `${base}booking/success${qs ? `?${qs}` : ''}`
}

function resetAll() {
  reset()
  scrollToTop()
}

function confirmResetYes() {
  confirmReset.value = false
  resetAll()
}

function scrollToTop() {
  if (!import.meta.client) return
  const lenis = useLenis().instance()
  if (lenis) lenis.scrollTo(0, { duration: 0.6 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

</script>

<style scoped>
/* ======== CHECKOUT CARD ======== */
.checkout-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(44, 36, 22, 0.03);
}
@media (min-width: 768px) { .checkout-card { padding: 24px; } }

.checkout-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
@media (min-width: 768px) { .checkout-head { margin-bottom: 18px; } }
.checkout-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C17F3E, #A0653A);
  color: white;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(193, 127, 62, 0.25);
}
.checkout-title {
  flex: 1;
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: #2C2416;
  line-height: 1.2;
  margin: 0;
}
@media (min-width: 768px) { .checkout-title { font-size: 22px; } }
.checkout-optional {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #9A8B73;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
/* Mobile/desktop variants для лейбла «необязательно».
   На мобильной показываем под заголовком, на md+ — справа от него. */
.checkout-optional--mobile { display: inline-block; margin-top: 4px; }
.checkout-optional--desktop { display: none; }
@media (min-width: 768px) {
  .checkout-optional--mobile { display: none; }
  .checkout-optional--desktop { display: inline-block; flex-shrink: 0; }
}
.checkout-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #F0E6D6;
  color: #5C6B3A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
}
.checkout-empty,
.checkout-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 36px 16px;
  text-align: center;
  color: #6B5B4A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14.5px;
}
.checkout-empty svg { color: #B5A88E; }
.quiz-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #F0E6D6;
  border-top-color: #C17F3E;
  border-radius: 50%;
  animation: quiz-spin 0.8s linear infinite;
}
@keyframes quiz-spin { to { transform: rotate(360deg); } }

/* ======== PERIOD-EMPTY (все категории заняты на длинный период) ======== */
.period-empty {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 18px;
  background: #FFF1EE;
  border: 1px solid rgba(181, 72, 58, 0.28);
  border-radius: 12px;
}
.period-empty__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  color: #B5483A;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(181, 72, 58, 0.3);
}
.period-empty__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 16.5px;
  color: #2C2416;
  margin: 0 0 4px;
}
.period-empty__sub {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  color: #6B5B4A;
  line-height: 1.45;
  margin: 0 0 12px;
}
.period-empty__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.period-empty__btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  background: #C17F3E;
  border: 1.5px solid #C17F3E;
  border-radius: 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;
}
.period-empty__btn:hover {
  background: #A86A2D;
  border-color: #A86A2D;
}
.period-empty__btn--ghost {
  background: white;
  color: #C17F3E;
}
.period-empty__btn--ghost:hover {
  background: #FFF6E8;
  color: #A86A2D;
}

/* ======== Mobile sticky «Далее» ========
   Тонкая полоска внизу экрана на мобиле, появляется когда выбран номер.
   Цвет: тёмный sand-900 фон (контрастирует с бежевым контентом, не сливается),
   кнопка — мягкий амбер outline на белом (не кричит как submit, но видна).
   Высота прижата к safe-area-bottom (iPhone bottom-notch). */
.mobile-next-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 60;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  background: rgba(44, 36, 22, 0.96);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(232, 200, 135, 0.35);
  box-shadow: 0 -6px 20px rgba(44, 36, 22, 0.18);
}
.mobile-next-bar__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 18px;
  background: white;
  border: 1.5px solid #E8C887;
  border-radius: 10px;
  font-family: 'Manrope', sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: #2C2416;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.12s ease;
}
.mobile-next-bar__btn:hover { background: #FFF8EE; border-color: #C17F3E; }
.mobile-next-bar__btn:active { transform: scale(0.99); }
.mobile-next-bar__btn svg { color: #C17F3E; flex-shrink: 0; }
.mobile-next-bar__label { font-weight: 600; }

.mobile-next-enter-active, .mobile-next-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.mobile-next-enter-from, .mobile-next-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Spacer-div ниже sticky bar, чтобы submit-кнопка и подвал не перекрывались. */
.mobile-next-spacer { display: none; }
@media (max-width: 767px) {
  .mobile-next-spacer { display: block; height: 96px; }
}

/* ======== CAPACITY-EMPTY (ни один одиночный номер не вмещает состав) ========
   Мягкая плашка над multi-room секцией. Цвет тёплый-нейтральный, чтобы НЕ
   читалось как ошибка — это нормальный сценарий, гость просто идёт в combo ниже. */
.capacity-empty {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  background: #FAF6F0;
  border: 1px solid #E8DCC8;
  border-radius: 12px;
  margin-bottom: 8px;
}
.capacity-empty__icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: white;
  color: #C17F3E;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E8DCC8;
}
.capacity-empty__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #2C2416;
  margin: 0 0 3px;
  line-height: 1.3;
}
.capacity-empty__sub {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  color: #6B5B4A;
  line-height: 1.45;
  margin: 0;
}

/* room-pick__suggest, muted variant — для занятых полностью на период */
.room-pick__suggest--muted {
  background: #F5F1EA !important;
  color: #6B5B4A !important;
  border-color: #E0D5C8 !important;
}
.room-pick__suggest--muted:hover {
  background: #EFE9DD !important;
  color: #2C2416 !important;
}

/* ======== MULTI-ROOM (набор из 2-9 номеров для большой компании) ======== */
.multi-room {
  margin-top: 20px;
  padding: 18px 16px;
  background: linear-gradient(180deg, #FFF6E8 0%, #FAF6F0 100%);
  border: 1px solid #E8C887;
  border-radius: 14px;
}
@media (min-width: 768px) { .multi-room { padding: 22px 22px; } }
.multi-room__head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}
.multi-room__head-icon {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: white;
  color: #C17F3E;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E8C887;
}
.multi-room__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 17px;
  color: #2C2416;
  margin: 0 0 3px;
}
.multi-room__sub {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  color: #6B5B4A;
  line-height: 1.45;
  margin: 0;
}
.multi-room__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
@media (min-width: 640px) { .multi-room__grid { grid-template-columns: 1fr 1fr; } }
.multi-room__note {
  margin: 14px 0 0;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  color: #8B7E6A;
  line-height: 1.45;
}

.multi-combo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  background: white;
  border: 1.5px solid #EFE5D2;
  border-radius: 12px;
  transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
}
.multi-combo:hover {
  border-color: #C17F3E;
  transform: translateY(-1px);
}
.multi-combo--active {
  border-color: #C17F3E;
  background: #FFF6E8;
  box-shadow: 0 0 0 3px rgba(193, 127, 62, 0.15);
}
/* === Превью номеров в combo: фото + название + «Подробнее» ===
   Это «карточки внутри карточки», по клику открывают модалку RoomDetailsModal
   с полной инфой по номеру (фото, описание, цены по составам). Гость сразу
   видит из чего состоит набор. */
.multi-combo__rooms-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.multi-combo__room {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #FAF6F0;
  border: 1px solid #EFE5D2;
  border-radius: 10px;
  padding: 8px 12px 8px 8px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.18s, background 0.18s, transform 0.12s;
}
.multi-combo__room:hover {
  border-color: #C17F3E;
  background: #FFF8EE;
}
.multi-combo__room:active { transform: scale(0.99); }
.multi-combo--active .multi-combo__room {
  background: white;
  border-color: #E8C887;
}
.multi-combo__room-photo {
  position: relative;
  flex-shrink: 0;
  width: 64px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  background: #EFE5D2;
}
.multi-combo__room-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.multi-combo__room-count {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(44, 36, 22, 0.85);
  color: white;
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 999px;
  line-height: 1.3;
}
.multi-combo__room-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.multi-combo__room-name {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #2C2416;
  line-height: 1.25;
}
.multi-combo__room-more {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #C17F3E;
  line-height: 1.2;
}
.multi-combo__room:hover .multi-combo__room-more { color: #A0653A; }

/* Cap + цена в одну строку под превью номеров.
   `margin-top: auto` прижимает блок к низу карточки — благодаря этому
   meta-row и кнопка «Выбрать набор» всегда на одном уровне у соседних
   combo-карточек, даже если в одном combo номеров больше (карточка выше). */
.multi-combo__meta-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding-top: 4px;
  margin-top: auto;
  border-top: 1px dashed #EFE5D2;
}
.multi-combo__cap {
  flex-shrink: 0;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11.5px;
  color: #8B7E6A;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding-top: 2px;
}
.multi-combo__price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.multi-combo__price-night {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #2C2416;
}
.multi-combo__price-total {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  color: #6B5B4A;
}
.multi-combo__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  padding: 8px 14px;
  background: white;
  border: 1.5px solid #C17F3E;
  border-radius: 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #C17F3E;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.multi-combo__btn:hover {
  background: #C17F3E;
  color: white;
}
.multi-combo__btn--active,
.multi-combo__btn--active:hover {
  background: #C17F3E;
  color: white;
}

/* ======== GUEST EXTRA PICKERS (для unit=guest) ======== */
.extra-card__pickers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 14px;
  margin-top: 10px;
  padding: 10px 12px;
  background: #FAF6F0;
  border: 1px dashed #D6CDBE;
  border-radius: 10px;
}
.extra-picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.extra-picker__label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8B7E6A;
  font-weight: 600;
}
.extra-picker__hint {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11.5px;
  color: #8B7E6A;
}
.extra-card__total {
  grid-column: 1 / -1;
  padding-top: 8px;
  border-top: 1px dashed #D6CDBE;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.extra-card__total-formula {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: #6B5B4A;
}
.extra-card__total-sum {
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #2C2416;
  white-space: nowrap;
}

/* Compact «Убрать» внутри extra-card__actions для unit=guest */
.extra-card__remove {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: white;
  border: 1px solid #E0D5C8;
  border-radius: 7px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #B5483A;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;
}
.extra-card__remove:hover {
  background: #FFF1EE;
  border-color: #B5483A;
}

/* ======== LIGHT COUNTER ======== */
.counter-light {
  display: flex;
  align-items: center;
  background: white;
  border: 1.5px solid #E0D5C8;
  border-radius: 8px;
  overflow: hidden;
  height: 46px;
  transition: border-color 0.2s;
}
.counter-light:hover { border-color: #C17F3E; }
.counter-light--sm { border-width: 1px; border-radius: 7px; height: 32px; }
.counter-light__btn {
  width: 44px;
  height: 100%;
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
.counter-light--sm .counter-light__btn { width: 30px; font-size: 14px; }
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
  min-width: 28px;
  padding: 0 4px;
}

/* ======== TEXTAREA ======== */
.textarea-light {
  height: auto !important;
  min-height: 84px;
  padding: 12px 16px !important;
  resize: vertical;
  line-height: 1.5;
}

/* ======== ROOM PICK CARDS ======== */
.room-pick {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.room-pick--unfit {
  cursor: default;
}
/* Недоступный номер — фото в Ч/Б + полосатая штриховка поверх, чтобы гость
   сразу понимал «этот вариант не подходит». Полоски + grayscale без блюра —
   фото остаётся читаемым, но «выключенным». */
.room-pick--unfit .room-pick__photo img {
  filter: grayscale(0.95) brightness(0.85) contrast(0.92);
}
.room-pick--unfit .room-pick__photo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    -45deg,
    rgba(44, 36, 22, 0.18) 0,
    rgba(44, 36, 22, 0.18) 8px,
    transparent 8px,
    transparent 20px
  );
  pointer-events: none;
  z-index: 1;
}
.room-pick--unfit:hover .room-pick__photo img { transform: none; }
.room-pick:hover {
  border-color: #D4BC96;
  box-shadow: 0 6px 16px rgba(44, 36, 22, 0.06);
}
.room-pick--active {
  border-color: #C17F3E;
  box-shadow: 0 8px 18px rgba(193, 127, 62, 0.18);
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
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #C17F3E;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(193, 127, 62, 0.4);
}
.room-pick__avail {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(44, 36, 22, 0.85);
  backdrop-filter: blur(4px);
  color: white;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
}
.room-pick__avail--low {
  background: rgba(193, 127, 62, 0.92);
}
.room-pick__body {
  padding: 14px 16px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.room-pick__last-badge {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  background: #FCE4E4;
  color: #B53F3F;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
  margin-bottom: 8px;
  letter-spacing: 0.01em;
}
.room-pick__limit {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #FAF0DE;
  border: 1px solid #E6CFA8;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 12px;
}
.room-pick__limit-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  color: #8C5D2A;
  font-weight: 600;
  line-height: 1.4;
}
.room-pick__limit-msg svg { color: #B5783A; flex-shrink: 0; }
.room-pick__limit-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 7px;
}
.room-pick__limit-btn {
  flex: 1 1 auto;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #E0CBA4;
  background: #fff;
  color: #8C5D2A;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, color 0.18s;
  white-space: nowrap;
}
.room-pick__limit-btn:hover { background: #FFF8EC; border-color: #C9A87A; }
.room-pick__limit-btn--primary {
  background: #C17F3E;
  border-color: #C17F3E;
  color: #fff;
}
.room-pick__limit-btn--primary:hover { background: #A86A30; border-color: #A86A30; color: #fff; }
.room-pick__more {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B5B4A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 6px 0;
  transition: color 0.2s;
}
.room-pick__more:hover { color: #C17F3E; }
.room-pick__select {
  display: inline-flex;
  align-items: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #2C2416;
  background: white;
  border: 1.5px solid #C17F3E;
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.room-pick__select:hover {
  background: #C17F3E;
  color: white;
}
.room-pick__select--active,
.room-pick__select--active:hover {
  background: #5C6B3A;
  border-color: #5C6B3A;
  color: white;
}
.room-pick__select:disabled {
  border-color: #D6CDBE;
  color: #B5A88E;
  cursor: not-allowed;
  background: white;
}
.room-pick__select:disabled:hover {
  background: white;
  color: #B5A88E;
}

/* Бейдж-кнопка «свободно с DD месяц — подставить эти даты». Кликается. */
.room-pick__suggest {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
  text-align: left;
  background: #FAF0DE;
  border: 1px dashed #D6B07A;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 12px;
  color: #8C5D2A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.35;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.room-pick__suggest:hover {
  background: #F5E4C4;
  border-color: #C17F3E;
}
.room-pick__suggest svg {
  flex-shrink: 0;
  margin-top: 2px;
}

/* ======== EXTRA CATEGORY TABS ======== */
.extra-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #6B5B4A;
  background: transparent;
  border: 1.5px solid #E0D5C8;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
}
@media (min-width: 640px) { .extra-tab { font-size: 14px; padding: 7px 14px; } }
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
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #C17F3E;
  color: white;
  font-size: 11px;
  font-weight: 700;
}

/* ======== EXTRAS GRID: desktop сетка / mobile горизонтальный скролл ======== */
.extras-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
@media (min-width: 768px) {
  .extras-grid {
    grid-template-columns: 1fr 1fr;
  }
}
/* Mobile: edge-to-edge горизонтальный скролл (как на главной в Services).
   Padding ВЛЕВО точно совпадает с padding .checkout-card (18px) — первая
   карточка визуально выровнена с заголовком и другими элементами секции,
   а не «прижата к левому краю». Margin компенсирует, чтобы скролл-зона
   выходила за внутренние границы карточки. */
@media (max-width: 767px) {
  .extras-grid {
    display: flex;
    grid-template-columns: unset;
    gap: 12px;
    overflow-x: auto;
    overflow-y: visible;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    margin-left: -18px;
    margin-right: -18px;
    padding: 4px 18px 12px;
  }
  .extras-grid::-webkit-scrollbar { display: none; }
  .extras-grid > .extra-card {
    flex: 0 0 78%;
    max-width: 320px;
    scroll-snap-align: start;
  }
}

/* ======== EXTRA CARDS (compact) ======== */
.extra-card {
  display: flex;
  gap: 12px;
  background: white;
  border: 1.5px solid #F0E6D6;
  border-radius: 12px;
  padding: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.extra-card--active {
  border-color: #C17F3E;
  box-shadow: 0 4px 12px rgba(193, 127, 62, 0.1);
}
.extra-card__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #F4F6EE, #E8ECDC);
  color: #5B7A3A;
  display: flex;
  align-items: center;
  justify-content: center;
}
.extra-card__icon :deep(svg) { width: 20px; height: 20px; }
.extra-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
/* Цена в отдельной строке, под описанием */
.extra-card__price-row {
  margin-bottom: 10px;
}
/* Подробнее — слева, Добавить — справа (Mark: «прижать к правому углу»). */
.extra-card__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
}
.extra-card__more {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6B5B4A;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 0;
  transition: color 0.2s;
}
.extra-card__more:hover { color: #C17F3E; }
.extra-card__add {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #C17F3E;
  background: transparent;
  border: 1.5px solid #E0D5C8;
  border-radius: 7px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.extra-card__add:hover {
  background: #C17F3E;
  border-color: #C17F3E;
  color: white;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ======== SUMMARY CARD ======== */
.summary-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(44, 36, 22, 0.06);
}
@media (min-width: 768px) { .summary-card { padding: 24px; } }
.summary-card__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 19px;
  color: #2C2416;
  margin: 0 0 14px;
}
.summary-block {
  padding-bottom: 12px;
}
.summary-block--bordered {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #E8DCC8;
}

/* ======== Multi-room summary block (когда выбран набор) ======== */
.multi-room-summary {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.multi-room-summary li {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: #4A3F2E;
}
.multi-room-summary__name { color: #2C2416; font-weight: 500; }
.multi-room-summary__price { color: #6B5B4A; font-variant-numeric: tabular-nums; }

/* ======== Свёрнутая строка «Услуги» в summary aside ======== */
.summary-extras-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 4px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Source Sans 3', sans-serif;
  text-align: left;
  color: inherit;
}
.summary-extras-toggle__main {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.summary-extras-toggle__chev {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #F4F6EE;
  color: #5B7A3A;
  transition: transform 0.22s ease, background 0.18s, color 0.18s;
}
.summary-extras-toggle--open .summary-extras-toggle__chev {
  transform: rotate(180deg);
  background: #5B7A3A;
  color: white;
}
.summary-extras-toggle__text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.summary-extras-toggle__title {
  font-size: 14px;
  font-weight: 600;
  color: #2C2416;
}
.summary-extras-toggle__count {
  font-size: 12px;
  color: #6B5B4A;
}
.summary-extras-toggle:hover .summary-extras-toggle__title { color: #5B7A3A; }
.summary-extras-list {
  list-style: none;
  padding: 8px 0 0;
  margin: 8px 0 0;
  border-top: 1px dashed #E8DCC8;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.summary-extras-list__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
/* Примечание «оплачиваются отдельно» под списком услуг в саммари */
.summary-extras-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 2px;
  padding-top: 8px;
  border-top: 1px dashed #E8DCC8;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: #9A6B3A;
}
.summary-extras-note svg { flex-shrink: 0; margin-top: 1px; }
.extras-expand-enter-active,
.extras-expand-leave-active {
  transition: opacity 0.18s ease, transform 0.22s ease, max-height 0.28s ease;
  overflow: hidden;
}
.extras-expand-enter-from,
.extras-expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
  max-height: 0;
}
.extras-expand-enter-to,
.extras-expand-leave-from {
  opacity: 1;
  max-height: 600px;
}

/* ======== «Бесплатные услуги — уже в цене» в summary aside ======== */
.free-incl {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 12px 0 4px;
  padding: 11px 14px;
  background: linear-gradient(135deg, #F4F6EE 0%, #EAF0DA 100%);
  border: 1px solid rgba(91, 122, 58, 0.28);
  border-radius: 12px;
  font-family: 'Source Sans 3', sans-serif;
  text-align: left;
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
  position: relative;
}
.free-incl::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 13px;
  border: 2px solid rgba(91, 122, 58, 0.55);
  pointer-events: none;
  opacity: 0;
  animation: free-incl-pulse 2.6s ease-in-out infinite;
}
.free-incl--seen::before { animation: none; opacity: 0; }
.free-incl:hover {
  transform: translateY(-1px);
  border-color: rgba(91, 122, 58, 0.55);
  box-shadow: 0 6px 16px rgba(91, 122, 58, 0.18);
}
.free-incl__bullet {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #5B7A3A;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.free-incl__text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}
.free-incl__title {
  font-size: 13.5px;
  font-weight: 600;
  color: #2C2416;
  line-height: 1.3;
}
.free-incl__list {
  font-size: 12px;
  color: #5B6B49;
  line-height: 1.35;
}
.free-incl__chev {
  flex-shrink: 0;
  color: #5B7A3A;
  display: inline-flex;
}
@keyframes free-incl-pulse {
  0% { opacity: 0; transform: scale(1); }
  20% { opacity: 0.9; transform: scale(1); }
  60% { opacity: 0; transform: scale(1.04); }
  100% { opacity: 0; transform: scale(1.06); }
}

/* ======== Free included modal ======== */
.free-incl-modal__icon {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #5B7A3A;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.free-incl-modal__icon--lg {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #5B7A3A, #6F9447);
  box-shadow: 0 6px 14px rgba(91, 122, 58, 0.32);
}
.free-incl-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.free-incl-list__btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  background: white;
  border: 1px solid #EFE5D2;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  font-family: 'Source Sans 3', sans-serif;
  transition: border-color 0.18s, transform 0.18s;
}
.free-incl-list__btn:hover {
  border-color: #5B7A3A;
  transform: translateX(2px);
}
.free-incl-list__icon {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #F4F6EE;
  color: #5B7A3A;
  border: 1px solid rgba(91, 122, 58, 0.22);
}
.free-incl-list__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.free-incl-list__title {
  font-size: 14.5px;
  font-weight: 600;
  color: #2C2416;
}
.free-incl-list__desc {
  font-size: 12.5px;
  color: #6B5B4A;
  line-height: 1.4;
}
.free-incl-list__chev {
  flex-shrink: 0;
  color: #9A8B73;
  transition: transform 0.18s;
}
.free-incl-list__btn:hover .free-incl-list__chev {
  color: #5B7A3A;
  transform: translateX(2px);
}

@media (prefers-reduced-motion: reduce) {
  .free-incl::before { animation: none; opacity: 0; }
}
.summary-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  padding: 3px 0;
}
.summary-roomwarn {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  line-height: 1.45;
  color: #B5783A;
}
.summary-roomwarn svg {
  flex-shrink: 0;
  margin-top: 2px;
}
.summary-label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: #6B5B4A;
}
.summary-value {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #2C2416;
  text-align: right;
}
.summary-line {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 3px 0;
}
.summary-amount {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  color: #2C2416;
  white-space: nowrap;
  flex-shrink: 0;
}
/* Сумма услуг — приглушённая, т.к. оплачивается отдельно и не в «Итого» */
.summary-amount--muted {
  color: #9A6B3A;
  font-weight: 600;
}
.summary-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 2px solid #F0E6D6;
  margin-bottom: 4px;
}

.reset-link {
  display: block;
  margin: 14px auto 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9A8B73;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.reset-link:hover { color: #2C2416; }

/* Блок «Условия бронирования» — ПП № 1912 с 01.03.2026 */
.rules-card {
  background: #FAF6F0;
  border: 1px solid #E8DCC8;
  border-radius: 14px;
  padding: 18px 20px;
}
@media (min-width: 768px) {
  .rules-card { padding: 22px 26px; }
}
.rules-card__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
}
.rules-card__title {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: 17px;
  color: #2C2416;
  margin: 0;
}
.rules-card__chev {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: #F0E6D6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}
.rules-card__chev--open { transform: rotate(180deg); }
.rules-card__body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.rules-card__body--open {
  max-height: 420px;
}
.rules-card__body .rules-list { padding-top: 14px; }
.rules-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  line-height: 1.5;
  color: #4A3F2E;
}
.rules-list li {
  position: relative;
  padding-left: 18px;
}
.rules-list li::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0.55em;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #C17F3E;
}
.rules-list strong {
  font-weight: 600;
  color: #2C2416;
}
.rules-cancel {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 4px;
}
.rules-cancel b {
  font-weight: 600;
  color: #2C2416;
}

/* Чекбокс согласия на ПДн вынесен в UiConsentCheckbox.vue */

/* Подсветка ошибочных полей формы */
.input-light--error {
  border-color: #C17F3E !important;
  box-shadow: 0 0 0 3px rgba(193, 127, 62, 0.18);
}

/* Кнопка опасного действия (Да, очистить) */
.btn-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  color: white;
  background: #B5483A;
  border: 1.5px solid #B5483A;
  border-radius: 10px;
  padding: 9px 18px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-danger:hover {
  background: #9C3B2E;
  border-color: #9C3B2E;
}

/* ======== MODAL ======== */
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

/* Возраст детей — селекты */
.children-ages {
  margin-top: 16px;
  padding: 14px 16px;
  background: #FAF6F0;
  border: 1px dashed #D6CDBE;
  border-radius: 12px;
}
.children-ages__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #4A3F2E;
  margin-bottom: 10px;
}
.children-ages__title svg { color: #C17F3E; flex-shrink: 0; }
.children-ages__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.children-ages__row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.children-ages__rowhead {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.children-ages__label {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  color: #6B5B4A;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.children-ages__needage {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #B5783A;
  font-style: italic;
}
.children-ages__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.children-ages__tab {
  appearance: none;
  background: white;
  border: 1.4px solid #E0D5C8;
  border-radius: 8px;
  padding: 6px 10px;
  min-width: 38px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  color: #4A3F2E;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s, transform 0.05s;
  line-height: 1.1;
  text-align: center;
}
.children-ages__tab:hover { border-color: #C17F3E; background: #FFF8EE; }
.children-ages__tab:active { transform: translateY(1px); }
.children-ages__tab--active {
  background: #C17F3E;
  border-color: #C17F3E;
  color: white;
}
.children-ages__tab--active:hover {
  background: #B0703A;
  border-color: #B0703A;
  color: white;
}
/* Возраст 15+ — тарифицируется как взрослый. Подсвечиваем жёлто-амбер
   фоном + border, чтобы гость моментально видел границу 15 vs 14
   (для <15 — обычный nude фон). Активный 15+ — насыщенный амбер
   (более тёплый чем обычный --active C17F3E) и тень для глубины. */
.children-ages__tab--adultlike {
  background: #FFF1D6;
  border-color: #E8B968;
  color: #8A5A1F;
}
.children-ages__tab--adultlike:hover {
  background: #FFE9BD;
  border-color: #D9A24A;
  color: #6E4715;
}
.children-ages__tab--adultlike.children-ages__tab--active,
.children-ages__tab--adultlike.children-ages__tab--active:hover {
  background: #C17F3E;
  border-color: #A0653A;
  color: white;
  box-shadow: 0 2px 8px rgba(193, 127, 62, 0.35);
}
.children-ages__callout {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  margin: 4px 0 0;
}
.children-ages__callout--adult { color: #B5783A; }
.children-ages__hint {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: #8C7A60;
  margin: 12px 0 0;
  line-height: 1.45;
}

/* Иконка для conflict-модалок (occupied / bnovo error) */
.conflict-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FAF0DE, #F5E4C4);
  color: #B5783A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
/* Карточка с ближайшей альтернативной датой в модалке «номер занят» */
.alt-date-card {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1.5px dashed #D6B07A;
  border-radius: 12px;
  padding: 14px 16px;
  margin-top: 8px;
}
</style>
