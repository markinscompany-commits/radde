<template>
  <section id="rooms" class="py-20 md:py-26 bg-sand-100">
    <div class="container">
      <div class="text-center mb-16">
        <span class="text-label text-olive-600 mb-4 block">Размещение</span>
        <h2 ref="titleRef" class="text-h2 font-500 text-sand-900">
          Выберите <span class="section-title-accent">номер</span>
        </h2>
      </div>

      <!-- Room cards — one per row, alternating -->
      <div ref="roomsGrid" class="space-y-6">
        <div v-for="(room, i) in rooms" :key="i"
             class="room-card bg-white rounded-3 overflow-hidden border border-sand-200 shadow-sm">
          <div class="flex flex-col lg:flex-row" :class="i % 2 === 1 ? 'lg:flex-row-reverse' : ''">
            <!-- Photo carousel (60%) -->
            <div class="relative lg:w-[60%] flex-shrink-0">
              <div class="aspect-4/3 lg:aspect-auto lg:h-full relative overflow-hidden bg-sand-200 cursor-pointer"
                   @click="openLightbox(room, room.activePhoto)">
                <!-- Preloaded images with crossfade -->
                <img
                  v-for="(src, pi) in room.images"
                  :key="src"
                  :src="src"
                  :alt="`${room.name} — фото ${pi + 1}`"
                  class="absolute inset-0 w-full h-full object-cover room-photo-transition"
                  :class="room.activePhoto === pi ? 'opacity-100 z-2' : 'opacity-0 z-1'"
                />
                <!-- Top-right: zoom hint -->
                <div class="absolute top-4 right-4 z-10" @click.stop>
                  <button @click="openLightbox(room, room.activePhoto)"
                          class="room-arrow"
                          title="Открыть на весь экран">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M7 4.5v5M4.5 7h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
                <!-- Bottom bar: arrows left, dots right -->
                <div class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3"
                     @click.stop>
                  <!-- Arrows (bottom-left) -->
                  <div v-if="room.images.length > 1" class="flex items-center gap-1.5">
                    <button @click="prevPhoto(room)"
                            class="room-arrow">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button @click="nextPhoto(room)"
                            class="room-arrow">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                  </div>
                  <!-- Dots (bottom-right) -->
                  <div v-if="room.images.length > 1" class="flex items-center gap-1.5 ml-auto">
                    <button v-for="(_, pi) in room.images" :key="pi"
                            @click="room.activePhoto = pi"
                            class="room-dot"
                            :class="room.activePhoto === pi ? 'bg-white w-5' : 'bg-white/50 w-2'">
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info (40%) -->
            <div class="flex-1 p-6 lg:p-7 flex flex-col">
              <!-- Name -->
              <h3 class="font-display font-500 text-sand-900 mb-4" style="font-size: clamp(1.4rem, 2.5vw, 1.8rem)">{{ room.name }}</h3>

              <!-- Specs row with icons — distinct background -->
              <div class="flex flex-wrap items-center gap-3 mb-5 bg-olive-50 border border-olive-100 rounded-2.5 px-4 py-3">
                <div class="flex items-center gap-2">
                  <svg class="flex-shrink-0 text-olive-500" width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/>
                    <path d="M2 7h14M7 2v14" stroke="currentColor" stroke-width="1.3"/>
                  </svg>
                  <span class="font-body text-4 font-600 text-olive-700">{{ room.area }} м²</span>
                </div>
                <div class="w-px h-3.5 bg-olive-200"></div>
                <div class="flex items-center gap-2">
                  <svg class="flex-shrink-0 text-olive-500" width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <rect x="1.5" y="8" width="15" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
                    <path d="M3 8V6a3 3 0 016 0v2M9 8V6a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.3"/>
                    <path d="M1.5 11.5h15" stroke="currentColor" stroke-width="1.3"/>
                  </svg>
                  <span class="font-body text-4 font-600 text-olive-700">{{ room.bed }}</span>
                </div>
                <div class="w-px h-3.5 bg-olive-200"></div>
                <div class="flex items-center gap-2">
                  <svg class="flex-shrink-0 text-olive-500" width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="5.5" r="3" stroke="currentColor" stroke-width="1.3"/>
                    <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                  </svg>
                  <span class="font-body text-4 font-600 text-olive-700">до {{ room.guests }} гостей</span>
                </div>
                <div class="w-px h-3.5 bg-olive-200"></div>
                <div class="flex items-center gap-2">
                  <svg class="flex-shrink-0 text-olive-500" width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M2 13c2-4 4.5-7 7-7s5 2 7 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                    <path d="M1 15h16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                    <circle cx="13" cy="4" r="2" stroke="currentColor" stroke-width="1.3"/>
                  </svg>
                  <span class="font-body text-4 font-600 text-olive-700">{{ room.view }}</span>
                </div>
              </div>

              <!-- Description (max 3 lines, truncated) -->
              <p class="font-body text-4 text-sand-700 leading-relaxed mb-4 room-desc">
                {{ room.description }}
              </p>

              <!-- Note (special, attention-grabbing) -->
              <div v-if="room.note" class="flex items-start gap-2.5 bg-amber-400/8 border border-amber-400/20 rounded-2 px-4 py-3 mb-4">
                <svg class="flex-shrink-0 mt-0.5 text-amber-500" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                <span class="text-small text-amber-700 font-500 leading-snug">{{ room.note }}</span>
              </div>

              <!-- Unique amenities -->
              <div class="flex flex-wrap gap-2 mb-auto pb-5">
                <span v-for="(tag, ti) in room.tags.slice(0, 4)" :key="ti"
                      class="font-body text-4 font-500 text-sand-700 bg-sand-100 px-3.5 py-1.5 rounded-full">
                  {{ tag }}
                </span>
                <button v-if="room.tags.length > 4"
                        @click="openDetails(room)"
                        class="font-body text-4 font-500 text-amber-700 bg-amber-400/12 px-3.5 py-1.5 rounded-full border-none cursor-pointer hover:bg-amber-400/20 transition-colors">
                  ещё {{ room.tags.length - 4 }}
                </button>
              </div>

              <!-- Bottom: Price (left) above Buttons (right) -->
              <div class="pt-4 border-t border-sand-100">
                <div class="text-left mb-4">
                  <span class="font-display font-500 text-sand-900" style="font-size: clamp(1.3rem, 2vw, 1.6rem)">от {{ room.price }} ₽</span>
                  <span class="text-small text-sand-600 ml-1">/ ночь</span>
                  <span class="block text-small text-sand-600 mt-0.5">за 2 взрослых</span>
                </div>
                <div class="flex items-center justify-end gap-3">
                  <button v-if="room.fullDescription"
                          @click="openDetails(room)"
                          class="text-small font-600 text-amber-600 hover:text-amber-700 transition-colors bg-transparent border-none cursor-pointer p-0">
                    Подробнее
                  </button>
                  <button class="btn-primary opacity-50 cursor-default" disabled>Забронировать</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Detail modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="detailRoom" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/60 backdrop-blur-sm" @click.self="closeDetails">
          <div class="relative bg-sand-50 rounded-3 w-full max-w-160 max-h-[90vh] overflow-y-auto shadow-2xl z-10 modal-body" data-lenis-prevent>
            <button @click="closeDetails" class="sticky top-4 float-right mr-4 mt-4 w-9 h-9 rounded-full bg-sand-200/90 backdrop-blur-sm hover:bg-sand-300 flex items-center justify-center transition-colors z-30 border-none cursor-pointer" style="margin-bottom: -52px;">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>

            <!-- Modal gallery -->
            <div class="relative aspect-16/9 overflow-hidden bg-sand-200 cursor-pointer"
                 @click="openLightbox(detailRoom, detailPhotoIndex)">
              <img
                v-for="(src, pi) in detailRoom.images"
                :key="src"
                :src="src"
                :alt="`${detailRoom.name} — фото ${pi + 1}`"
                class="absolute inset-0 w-full h-full object-cover room-photo-transition"
                :class="detailPhotoIndex === pi ? 'opacity-100 z-2' : 'opacity-0 z-1'"
              />
              <div class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3"
                   @click.stop>
                <div v-if="detailRoom.images.length > 1" class="flex items-center gap-1.5">
                  <button @click="detailPhotoIndex = (detailPhotoIndex - 1 + detailRoom.images.length) % detailRoom.images.length"
                          class="room-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button @click="detailPhotoIndex = (detailPhotoIndex + 1) % detailRoom.images.length"
                          class="room-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
                <div v-if="detailRoom.images.length > 1" class="flex items-center gap-1.5 ml-auto">
                  <button v-for="(_, pi) in detailRoom.images" :key="pi"
                          @click="detailPhotoIndex = pi"
                          class="room-dot"
                          :class="detailPhotoIndex === pi ? 'bg-white w-5' : 'bg-white/50 w-2'">
                  </button>
                </div>
              </div>
            </div>

            <div class="p-6 md:p-8">
              <h3 class="font-display font-500 text-7 text-sand-900 mb-3">{{ detailRoom.name }}</h3>

              <!-- Specs with icons — distinct block -->
              <div class="flex flex-wrap items-center gap-3 mb-6 bg-olive-50 border border-olive-100 rounded-2.5 px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <svg class="text-olive-500" width="16" height="16" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M2 7h14M7 2v14" stroke="currentColor" stroke-width="1.3"/></svg>
                  <span class="font-body text-4 font-600 text-olive-700">{{ detailRoom.area }} м²</span>
                </div>
                <div class="w-px h-3.5 bg-olive-200"></div>
                <div class="flex items-center gap-2">
                  <svg class="text-olive-500" width="16" height="16" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="8" width="15" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3 8V6a3 3 0 016 0v2M9 8V6a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 11.5h15" stroke="currentColor" stroke-width="1.3"/></svg>
                  <span class="font-body text-4 font-600 text-olive-700">{{ detailRoom.bed }}</span>
                </div>
                <div class="w-px h-3.5 bg-olive-200"></div>
                <div class="flex items-center gap-2">
                  <svg class="text-olive-500" width="16" height="16" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5.5" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                  <span class="font-body text-4 font-600 text-olive-700">до {{ detailRoom.guests }} гостей</span>
                </div>
                <div class="w-px h-3.5 bg-olive-200"></div>
                <div class="flex items-center gap-2">
                  <svg class="text-olive-500" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M2 13c2-4 4.5-7 7-7s5 2 7 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M1 15h16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="13" cy="4" r="2" stroke="currentColor" stroke-width="1.3"/></svg>
                  <span class="font-body text-4 font-600 text-olive-700">{{ detailRoom.view }}</span>
                </div>
              </div>

              <p class="font-body text-4 text-sand-800 leading-relaxed mb-6">{{ detailRoom.fullDescription }}</p>

              <div v-if="detailRoom.note" class="flex items-start gap-2.5 bg-amber-400/8 border border-amber-400/20 rounded-2 px-4 py-3 mb-6">
                <svg class="flex-shrink-0 mt-0.5 text-amber-500" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                <span class="font-body text-4 text-amber-700 font-500">{{ detailRoom.note }}</span>
              </div>

              <h4 class="text-label text-sand-700 mb-3">Удобства в номере</h4>
              <div class="flex flex-wrap gap-2 mb-8">
                <span v-for="tag in detailRoom.tags" :key="tag"
                      class="font-body text-4 font-500 text-sand-700 bg-sand-200 px-3.5 py-1.5 rounded-full">
                  {{ tag }}
                </span>
              </div>

              <div class="flex items-center justify-between pt-5 border-t border-sand-200">
                <div>
                  <span class="font-display font-500 text-6 text-sand-900">от {{ detailRoom.price }} ₽</span>
                  <span class="text-small text-sand-600 ml-1">/ ночь</span>
                  <span class="block text-small text-sand-600 mt-0.5">за 2 взрослых</span>
                </div>
                <button class="btn-primary opacity-50 cursor-default" disabled>Забронировать</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Fullscreen lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightbox.open" class="fixed inset-0 z-200 bg-black/95 flex items-center justify-center" @click.self="closeLightbox">
          <!-- Close -->
          <button @click="closeLightbox" class="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>

          <!-- Photo -->
          <img
            :src="lightbox.images[lightbox.index]"
            :alt="`Фото ${lightbox.index + 1}`"
            class="max-w-[90vw] max-h-[90vh] object-contain select-none lightbox-img"
            @wheel.prevent="handleLightboxZoom"
            :style="{ transform: `scale(${lightbox.zoom})` }"
          />

          <!-- Prev -->
          <button v-if="lightbox.images.length > 1"
                  @click="lightbox.index = (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length; lightbox.zoom = 1"
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors z-20">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12 3L6 9l6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>

          <!-- Next -->
          <button v-if="lightbox.images.length > 1"
                  @click="lightbox.index = (lightbox.index + 1) % lightbox.images.length; lightbox.zoom = 1"
                  class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors z-20">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 3l6 6-6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>

          <!-- Dots -->
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            <button v-for="(_, pi) in lightbox.images" :key="pi"
                    @click="lightbox.index = pi; lightbox.zoom = 1"
                    class="room-dot"
                    :class="lightbox.index === pi ? 'bg-white w-5' : 'bg-white/40 w-2'">
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'

const titleRef = ref<HTMLElement>()
const roomsGrid = ref<HTMLElement>()
const detailRoom = ref<typeof rooms[0] | null>(null)
const detailPhotoIndex = ref(0)


const lightbox = reactive({
  open: false,
  images: [] as string[],
  index: 0,
  zoom: 1,
})

function getRoomSlug(room: typeof rooms[0]) {
  return room.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-яё0-9-]/gi, '')
}

function openDetails(room: typeof rooms[0]) {
  detailRoom.value = room
  detailPhotoIndex.value = 0
  document.body.style.overflow = 'hidden'
  useLenis().instance()?.stop()
  history.replaceState(null, '', `#room-${getRoomSlug(room)}`)
}

function closeDetails() {
  detailRoom.value = null
  document.body.style.overflow = ''
  useLenis().instance()?.start()
  history.replaceState(null, '', window.location.pathname)
}

function openLightbox(room: typeof rooms[0], startIndex: number) {
  lightbox.images = room.images
  lightbox.index = startIndex
  lightbox.zoom = 1
  lightbox.open = true
  document.body.style.overflow = 'hidden'
  useLenis().instance()?.stop()
}

function closeLightbox() {
  lightbox.open = false
  if (!detailRoom.value) {
    document.body.style.overflow = ''
    useLenis().instance()?.start()
  }
}

function handleLightboxZoom(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -0.15 : 0.15
  lightbox.zoom = Math.min(3, Math.max(0.5, lightbox.zoom + delta))
}

// Keyboard nav for lightbox
if (import.meta.client) {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!lightbox.open) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') { lightbox.index = (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length; lightbox.zoom = 1 }
    if (e.key === 'ArrowRight') { lightbox.index = (lightbox.index + 1) % lightbox.images.length; lightbox.zoom = 1 }
  })
}

function nextPhoto(room: typeof rooms[0]) {
  room.activePhoto = (room.activePhoto + 1) % room.images.length
}

function prevPhoto(room: typeof rooms[0]) {
  room.activePhoto = (room.activePhoto - 1 + room.images.length) % room.images.length
}

const VIP_COUNT = 9
const PANORAMA_COUNT = 8
const LUX_COUNT = 17
const STANDARD_COUNT = 3
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

const rooms = reactive([
  {
    name: 'VIP',
    area: 50,
    bed: 'King-size',
    guests: 4,
    view: 'Панорама на горы и долину',
    price: '10 000',
    description: 'Максимальный комфорт. Отдельная гостиная с камином, спальня с панорамными окнами, собственная терраса с видом на горы и долину.',
    fullDescription: 'Максимальный комфорт для тех, кто ценит пространство и уединение. Отдельная гостиная с камином — идеальное место для вечерних посиделок. Спальня с панорамными окнами и кроватью King-size. Собственная терраса с видом на горы и долину. Санузел с дождевым душем и ванной. Халаты, тапочки, мини-бар, телевизор — всё продумано для безупречного отдыха.',
    note: '',
    tags: ['Гостиная', 'Камин', 'Терраса', 'Ванна', 'Дождевой душ', 'Халаты', 'Мини-бар'],
    images: range(VIP_COUNT).map(n => `${base}images/rooms/vip/${n}.jpg`),
    activePhoto: 0,
  },
  {
    name: 'Люкс с панорамной спальней',
    area: 35,
    bed: 'King-size',
    guests: 3,
    view: 'Панорама на горы',
    price: '7 000',
    description: 'Панорамные окна от пола до потолка. Просыпаетесь с видом на горные вершины и реликтовый лес — незабываемое начало каждого дня.',
    fullDescription: 'Панорамные окна от пола до потолка превращают спальню в смотровую площадку. Просыпаетесь с видом на горные вершины и реликтовый лес — незабываемое начало каждого дня. Номер оснащён кроватью King-size с ортопедическим матрасом, собственным санузлом с дождевым душем, террасой для отдыха на свежем воздухе. Мини-бар, телевизор, кресло у окна — всё для полного комфорта.',
    note: '',
    tags: ['Панорамные окна', 'Терраса', 'Дождевой душ', 'Собственный санузел', 'Мини-бар', 'Кресло у окна'],
    images: range(PANORAMA_COUNT).map(n => `${base}images/rooms/panorama/${n}.jpg`),
    activePhoto: 0,
  },
  {
    name: 'Люкс',
    area: 30,
    bed: 'Двуспальная кровать',
    guests: 3,
    view: 'Вид на горы',
    price: '5 500',
    description: 'Просторный номер с собственным санузлом и балконом. Большие окна наполняют пространство естественным светом и открывают вид на горные вершины.',
    fullDescription: 'Просторный номер с собственным санузлом и балконом. Большие окна наполняют пространство естественным светом и открывают вид на горные вершины. Интерьер в натуральных тонах создаёт атмосферу уюта — мягкая мебель, телевизор, мини-бар с прохладительными напитками. Балкон с видом на горы — идеальное место для утреннего кофе.',
    note: '',
    tags: ['Собственный санузел', 'Балкон', 'Телевизор', 'Мини-бар'],
    images: range(LUX_COUNT).map(n => `${base}images/rooms/lux/${n}.jpg`),
    activePhoto: 0,
  },
  {
    name: 'Стандарт',
    area: 18,
    bed: 'Двуспальная кровать',
    guests: 2,
    view: 'Вид на лес',
    price: '3 500',
    description: 'Уютный номер в тёплых природных тонах с видом на реликтовый лес. Всё необходимое для спокойного отдыха вдали от суеты.',
    fullDescription: 'Уютный номер в тёплых природных тонах с видом на реликтовый лес. Всё необходимое для спокойного отдыха вдали от суеты — удобная кровать с ортопедическим матрасом, шкаф для одежды, рабочее место у окна. Из окна открывается вид на вековые деревья реликтового леса. Идеальный вариант для пар и путешественников, ценящих простоту и природу.',
    note: 'Санузел в коридоре — один на два номера',
    tags: ['Рабочее место', 'Шкаф', 'Вид на лес'],
    images: range(STANDARD_COUNT).map(n => `${base}images/rooms/standard/${n}.jpg`),
    activePhoto: 0,
  },
])

onMounted(() => {
  if (!import.meta.client) return

  // Open room modal from URL hash
  const hash = window.location.hash
  if (hash.startsWith('#room-')) {
    const slug = hash.replace('#room-', '')
    const found = rooms.find(r => getRoomSlug(r) === slug)
    if (found) setTimeout(() => openDetails(found), 500)
  }
})
</script>

<style scoped>
.room-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Crossfade transition for photos */
.room-photo-transition {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Arrow buttons */
.room-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.room-arrow:hover {
  background: rgba(0, 0, 0, 0.6);
}

/* Dot indicators */
.room-dot {
  height: 8px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

/* Lightbox */
.lightbox-img {
  transition: transform 0.2s ease;
}

.lightbox-enter-active { transition: opacity 0.3s ease; }
.lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }

/* Modal transition */
.modal-enter-active { transition: opacity 0.3s ease; }
.modal-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-leave-active > div:last-child { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from { opacity: 0; }
.modal-enter-from > div:last-child { opacity: 0; transform: scale(0.95) translateY(10px); }
.modal-leave-to { opacity: 0; }
.modal-leave-to > div:last-child { opacity: 0; transform: scale(0.97); }
</style>
