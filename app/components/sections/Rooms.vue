<template>
  <section id="rooms" class="section-padding bg-sand-100">
    <div class="container">
      <UiSectionHeader label="Размещение" title="Выберите" accent="номер" class="mb-16" />

      <!-- Room cards — one per row, alternating -->
      <div ref="roomsGrid" class="space-y-6">
        <UiRoomCard
          v-for="(room, i) in rooms"
          :key="i"
          :room="room"
          :reverse="i % 2 === 1"
          @details="openDetails"
          @lightbox="openLightbox"
        />
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
              <!-- Top-right: zoom hint -->
              <div class="absolute top-4 right-4 z-10" @click.stop>
                <button @click="openLightbox(detailRoom, detailPhotoIndex)"
                        class="media-arrow"
                        title="Открыть на весь экран">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M7 4.5v5M4.5 7h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
              <div class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3"
                   @click.stop>
                <div v-if="detailRoom.images.length > 1" class="flex items-center gap-1.5">
                  <button @click="detailPhotoIndex = (detailPhotoIndex - 1 + detailRoom.images.length) % detailRoom.images.length"
                          class="media-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button @click="detailPhotoIndex = (detailPhotoIndex + 1) % detailRoom.images.length"
                          class="media-arrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                </div>
                <div v-if="detailRoom.images.length > 1" class="flex items-center gap-1.5 ml-auto">
                  <button v-for="(_, pi) in detailRoom.images" :key="pi"
                          @click="detailPhotoIndex = pi"
                          class="media-dot"
                          :class="detailPhotoIndex === pi ? 'bg-white w-5' : 'bg-white/50 w-2'">
                  </button>
                </div>
              </div>
            </div>

            <div class="p-6 md:p-8">
              <h3 class="font-display font-500 text-7 text-sand-900 mb-4">{{ detailRoom.name }}</h3>

              <!-- Specs as chips (highlighted) — single flow -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span class="spec-chip">
                  <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M2 7h14M7 2v14" stroke="currentColor" stroke-width="1.3"/></svg>
                  {{ detailRoom.area }} м²
                </span>
                <span class="spec-chip">
                  <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="8" width="15" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3 8V6a3 3 0 016 0v2M9 8V6a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 11.5h15" stroke="currentColor" stroke-width="1.3"/></svg>
                  {{ detailRoom.bed }}
                </span>
                <span class="spec-chip">
                  <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5.5" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                  до {{ detailRoom.guests }} гостей
                </span>
                <span class="spec-chip">
                  <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><path d="M2 13c2-4 4.5-7 7-7s5 2 7 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M1 15h16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="13" cy="4" r="2" stroke="currentColor" stroke-width="1.3"/></svg>
                  {{ detailRoom.view }}
                </span>
              </div>

              <p class="font-body text-4 text-sand-800 leading-relaxed mb-6">{{ detailRoom.fullDescription }}</p>

              <div v-if="detailRoom.note" class="flex items-start gap-2.5 bg-amber-400/8 border border-amber-400/20 rounded-2 px-4 py-3 mb-6">
                <svg class="flex-shrink-0 mt-0.5 text-amber-500" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                <span class="font-body text-4 text-amber-700 font-500">{{ detailRoom.note }}</span>
              </div>

              <h4 class="text-label text-sand-700 mb-3">Удобства в номере</h4>
              <div class="flex flex-wrap gap-2 mb-8">
                <span v-for="tag in detailRoom.tags" :key="tag" class="amenity-chip">
                  {{ tag }}
                </span>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-sand-200">
                <div>
                  <span class="font-display font-500 text-6 text-sand-900">от {{ detailRoom.price }} ₽</span>
                  <span class="text-small text-sand-600 ml-1">/ ночь</span>
                  <span class="block text-small text-sand-600 mt-0.5">за 2 взрослых</span>
                </div>
                <a :href="`${base}booking?room=${detailRoom.id}`" class="btn-primary">Забронировать</a>
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
                    class="media-dot"
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

const roomsGrid = ref<HTMLElement>()
const detailRoom = ref<typeof rooms[0] | null>(null)
const detailPhotoIndex = ref(0)


const lightbox = reactive({
  open: false,
  images: [] as string[],
  index: 0,
  zoom: 1,
})

function openDetails(room: typeof rooms[0]) {
  detailRoom.value = room
  detailPhotoIndex.value = 0
  document.body.style.overflow = 'hidden'
  useLenis().instance()?.stop()
  history.replaceState(null, '', `#room-${room.id}`)
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

// Берём номера из общего источника (composables/useRooms.ts), добавляем
// локальное UI-поле activePhoto для индекса слайда галереи.
const rooms = reactive(useRooms().map(r => ({ ...r, activePhoto: 0 })))

onMounted(() => {
  if (!import.meta.client) return

  // Open room modal from URL hash
  const hash = window.location.hash
  if (hash.startsWith('#room-')) {
    const id = hash.replace('#room-', '')
    const found = rooms.find(r => r.id === id)
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
