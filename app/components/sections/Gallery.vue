<template>
  <section id="gallery" class="py-20 md:py-26 bg-sand-100">
    <div class="container">
      <div class="text-center mb-16">
        <span class="text-label text-olive-600 mb-4 block">Галерея</span>
        <h2 ref="titleRef" class="text-h2 font-500 text-sand-900">
          Фотографии <span class="section-title-accent">пансионата</span>
        </h2>
      </div>

      <div ref="gridRef" class="gallery-grid">
        <div v-for="(src, i) in photos" :key="i"
             class="gallery-item rounded-2 overflow-hidden cursor-pointer group"
             @click="openLightbox(i)">
          <img :src="src"
               :alt="`Пансионат Радде — фото ${i + 1}`"
               class="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
               loading="lazy"
               decoding="async" />
        </div>
      </div>
    </div>

    <!-- Fullscreen lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightboxOpen" class="fixed inset-0 z-200 bg-black/95 flex items-center justify-center" @click.self="closeLightbox">
          <!-- Close -->
          <button @click="closeLightbox" class="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>

          <!-- Photo -->
          <img
            :src="photos[lightboxIndex]"
            :alt="`Фото ${lightboxIndex + 1}`"
            class="max-w-[90vw] max-h-[90vh] object-contain select-none"
            :style="{ transform: `scale(${lightboxZoom})`, transition: 'transform 0.2s ease' }"
            @wheel.prevent="handleZoom"
          />

          <!-- Prev -->
          <button @click="lightboxPrev"
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors z-20">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M12 3L6 9l6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>

          <!-- Next -->
          <button @click="lightboxNext"
                  class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors z-20">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6 3l6 6-6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>

          <!-- Dots -->
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            <button v-for="(_, pi) in photos" :key="pi"
                    @click="lightboxIndex = pi; lightboxZoom = 1"
                    class="h-2 rounded-full border-none cursor-pointer transition-all duration-300 p-0"
                    :class="lightboxIndex === pi ? 'bg-white w-5' : 'bg-white/40 w-2'">
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
const gridRef = ref<HTMLElement>()

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const lightboxZoom = ref(1)

const photos = [
  `${base}images/hero/hero-1.jpg`,
  `${base}images/hero/hero-2.jpg`,
  `${base}images/usp/food/1.jpg`,
  `${base}images/rooms/panorama/1.jpg`,
  `${base}images/hero/hero-4.jpg`,
  `${base}images/rooms/vip/1.jpg`,
  `${base}images/usp/nature/1.jpg`,
]

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxZoom.value = 1
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
  useLenis().instance()?.stop()
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
  useLenis().instance()?.start()
}

function lightboxNext() {
  lightboxIndex.value = (lightboxIndex.value + 1) % photos.length
  lightboxZoom.value = 1
}

function lightboxPrev() {
  lightboxIndex.value = (lightboxIndex.value - 1 + photos.length) % photos.length
  lightboxZoom.value = 1
}

function handleZoom(e: WheelEvent) {
  const delta = e.deltaY > 0 ? -0.15 : 0.15
  lightboxZoom.value = Math.min(3, Math.max(0.5, lightboxZoom.value + delta))
}

// Keyboard navigation
if (import.meta.client) {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!lightboxOpen.value) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') lightboxPrev()
    if (e.key === 'ArrowRight') lightboxNext()
  })
}

</script>

<style scoped>
.gallery-grid {
  columns: 3;
  column-gap: 12px;
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .gallery-grid {
    columns: 2;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    columns: 1;
  }
}

.lightbox-enter-active { transition: opacity 0.3s ease; }
.lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }
</style>
