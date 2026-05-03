<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="room" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-sand-900/60 backdrop-blur-sm" @click.self="close">
        <div class="relative bg-sand-50 rounded-3 w-full max-w-160 max-h-[90vh] overflow-y-auto shadow-2xl z-10 modal-body" data-lenis-prevent>
          <button @click="close" class="sticky top-4 float-right mr-4 mt-4 w-9 h-9 rounded-full bg-sand-200/90 backdrop-blur-sm hover:bg-sand-300 flex items-center justify-center transition-colors z-30 border-none cursor-pointer" style="margin-bottom: -52px;">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>

          <!-- Modal gallery -->
          <div class="relative aspect-16/9 overflow-hidden bg-sand-200 cursor-pointer"
               @click="openLightbox(photoIndex)">
            <img
              v-for="(src, pi) in room.images"
              :key="src"
              :src="src"
              :alt="`${room.name} — фото ${pi + 1}`"
              class="absolute inset-0 w-full h-full object-cover room-photo-transition"
              :class="photoIndex === pi ? 'opacity-100 z-2' : 'opacity-0 z-1'"
            />
            <div class="absolute top-4 right-4 z-10" @click.stop>
              <button @click="openLightbox(photoIndex)"
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
              <div v-if="room.images.length > 1" class="flex items-center gap-1.5">
                <button @click="prevPhoto" class="media-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button @click="nextPhoto" class="media-arrow">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
              <div v-if="room.images.length > 1" class="flex items-center gap-1.5 ml-auto">
                <button v-for="(_, pi) in room.images" :key="pi"
                        @click="photoIndex = pi"
                        class="media-dot"
                        :class="photoIndex === pi ? 'bg-white w-5' : 'bg-white/50 w-2'">
                </button>
              </div>
            </div>
          </div>

          <div class="p-6 md:p-8">
            <h3 class="font-display font-500 text-7 text-sand-900 mb-4">{{ room.name }}</h3>

            <div class="flex flex-wrap gap-2 mb-6">
              <span class="spec-chip">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M2 7h14M7 2v14" stroke="currentColor" stroke-width="1.3"/></svg>
                {{ room.area }} м²
              </span>
              <span class="spec-chip">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="8" width="15" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3 8V6a3 3 0 016 0v2M9 8V6a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 11.5h15" stroke="currentColor" stroke-width="1.3"/></svg>
                {{ room.bed }}
              </span>
              <span class="spec-chip">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5.5" r="3" stroke="currentColor" stroke-width="1.3"/><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
                до {{ room.guests }} гостей
              </span>
              <span class="spec-chip">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none"><path d="M2 13c2-4 4.5-7 7-7s5 2 7 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M1 15h16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="13" cy="4" r="2" stroke="currentColor" stroke-width="1.3"/></svg>
                {{ room.view }}
              </span>
            </div>

            <p class="font-body text-4 text-sand-800 leading-relaxed mb-6">{{ room.fullDescription }}</p>

            <div v-if="room.note" class="flex items-start gap-2.5 bg-amber-400/8 border border-amber-400/20 rounded-2 px-4 py-3 mb-6">
              <svg class="flex-shrink-0 mt-0.5 text-amber-500" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
              <span class="font-body text-4 text-amber-700 font-500">{{ room.note }}</span>
            </div>

            <h4 class="text-label text-sand-700 mb-3">Удобства в номере</h4>
            <div class="flex flex-wrap gap-2 mb-8">
              <span v-for="tag in room.tags" :key="tag" class="amenity-chip">
                {{ tag }}
              </span>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-sand-200">
              <div>
                <span class="font-display font-500 text-6 text-sand-900">от {{ room.price }} ₽</span>
                <span class="text-small text-sand-600 ml-1">/ ночь</span>
                <span class="block text-small text-sand-600 mt-0.5">за 2 взрослых</span>
              </div>
              <button v-if="action === 'select'" type="button" class="btn-primary" @click="onSelect">
                {{ selectLabel || 'Выбрать номер' }}
              </button>
              <a v-else :href="bookHref" class="btn-primary">Забронировать</a>
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
        <button @click="closeLightbox" class="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>

        <img
          :src="lightbox.images[lightbox.index]"
          :alt="`Фото ${lightbox.index + 1}`"
          class="max-w-[90vw] max-h-[90vh] object-contain select-none lightbox-img"
          @wheel.prevent="handleLightboxZoom"
          :style="{ transform: `scale(${lightbox.zoom})` }"
        />

        <button v-if="lightbox.images.length > 1"
                @click="lightboxPrev"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors z-20">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12 3L6 9l6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

        <button v-if="lightbox.images.length > 1"
                @click="lightboxNext"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors z-20">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 3l6 6-6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>

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
</template>

<script setup lang="ts">
import type { RoomDef } from '~/composables/useRooms'

const props = withDefaults(defineProps<{
  /** Если null — модалка закрыта */
  room: RoomDef | null
  /** 'select' — кнопка «Выбрать номер» эмитит select; 'book' — ссылка на /booking */
  action?: 'select' | 'book'
  /** Подпись на кнопке для action='select' */
  selectLabel?: string
}>(), {
  action: 'book',
})

const emit = defineEmits<{
  close: []
  select: [room: RoomDef]
}>()

const base = useRuntimeConfig().app.baseURL || '/'
const bookHref = computed(() => props.room?.id ? `${base}booking?room=${props.room.id}` : `${base}booking`)

const photoIndex = ref(0)
const lightbox = reactive({
  open: false,
  images: [] as string[],
  index: 0,
  zoom: 1,
})

watch(() => props.room, (val, prev) => {
  if (val && val !== prev) {
    photoIndex.value = 0
    if (import.meta.client) {
      document.body.style.overflow = 'hidden'
      useLenis().instance()?.stop()
    }
  } else if (!val && prev) {
    if (import.meta.client) {
      document.body.style.overflow = ''
      useLenis().instance()?.start()
    }
  }
})

function close() { emit('close') }

function onSelect() {
  if (props.room) emit('select', props.room)
}

function nextPhoto() {
  if (!props.room) return
  photoIndex.value = (photoIndex.value + 1) % props.room.images.length
}
function prevPhoto() {
  if (!props.room) return
  photoIndex.value = (photoIndex.value - 1 + props.room.images.length) % props.room.images.length
}

function openLightbox(startIndex: number) {
  if (!props.room) return
  lightbox.images = props.room.images
  lightbox.index = startIndex
  lightbox.zoom = 1
  lightbox.open = true
  if (import.meta.client) {
    document.body.style.overflow = 'hidden'
    useLenis().instance()?.stop()
  }
}

function closeLightbox() {
  lightbox.open = false
  if (!props.room && import.meta.client) {
    document.body.style.overflow = ''
    useLenis().instance()?.start()
  }
}

function lightboxNext() {
  lightbox.index = (lightbox.index + 1) % lightbox.images.length
  lightbox.zoom = 1
}
function lightboxPrev() {
  lightbox.index = (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length
  lightbox.zoom = 1
}

function handleLightboxZoom(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -0.15 : 0.15
  lightbox.zoom = Math.min(3, Math.max(0.5, lightbox.zoom + delta))
}

if (import.meta.client) {
  const onKey = (e: KeyboardEvent) => {
    if (lightbox.open) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') lightboxPrev()
      if (e.key === 'ArrowRight') lightboxNext()
    } else if (props.room && e.key === 'Escape') {
      close()
    }
  }
  onMounted(() => document.addEventListener('keydown', onKey))
  onUnmounted(() => document.removeEventListener('keydown', onKey))
}
</script>

<style scoped>
.room-photo-transition { transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
.lightbox-img { transition: transform 0.2s ease; }

.lightbox-enter-active { transition: opacity 0.3s ease; }
.lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }

.modal-enter-active { transition: opacity 0.3s ease; }
.modal-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-leave-active > div:last-child { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from { opacity: 0; }
.modal-enter-from > div:last-child { opacity: 0; transform: scale(0.95) translateY(10px); }
.modal-leave-to { opacity: 0; }
.modal-leave-to > div:last-child { opacity: 0; transform: scale(0.97); }
</style>
