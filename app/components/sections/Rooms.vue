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

    <!-- Detail modal (общий компонент, переиспользуется на /booking) -->
    <UiRoomDetailsModal
      :room="detailRoom"
      action="book"
      @close="closeDetails"
    />

    <!-- Fullscreen lightbox для прямых кликов по фото в карточках списка -->
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
                  @click="lightbox.index = (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length; lightbox.zoom = 1"
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors z-20">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12 3L6 9l6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>

          <button v-if="lightbox.images.length > 1"
                  @click="lightbox.index = (lightbox.index + 1) % lightbox.images.length; lightbox.zoom = 1"
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
  </section>
</template>

<script setup lang="ts">
import type { RoomDef } from '~/composables/useRooms'

const roomsGrid = ref<HTMLElement>()
const detailRoom = ref<RoomDef | null>(null)

const lightbox = reactive({
  open: false,
  images: [] as string[],
  index: 0,
  zoom: 1,
})

function openDetails(room: RoomDef) {
  detailRoom.value = room
  history.replaceState(null, '', `#room-${room.id}`)
}

function closeDetails() {
  detailRoom.value = null
  history.replaceState(null, '', window.location.pathname)
}

function openLightbox(room: RoomDef, startIndex: number) {
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

if (import.meta.client) {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!lightbox.open) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') { lightbox.index = (lightbox.index - 1 + lightbox.images.length) % lightbox.images.length; lightbox.zoom = 1 }
    if (e.key === 'ArrowRight') { lightbox.index = (lightbox.index + 1) % lightbox.images.length; lightbox.zoom = 1 }
  })
}

// Берём номера из общего источника (composables/useRooms.ts), добавляем
// локальное UI-поле activePhoto для индекса слайда галереи в карточках.
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
.lightbox-img { transition: transform 0.2s ease; }
.lightbox-enter-active { transition: opacity 0.3s ease; }
.lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }
</style>
