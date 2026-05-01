<template>
  <div class="room-card bg-white rounded-3 overflow-hidden border border-sand-200 shadow-sm">
    <div class="flex flex-col lg:flex-row" :class="reverse ? 'lg:flex-row-reverse' : ''">
      <!-- Photo carousel (60%) -->
      <div class="relative lg:w-[60%] flex-shrink-0">
        <div class="aspect-4/3 lg:aspect-auto lg:h-full relative overflow-hidden bg-sand-200 cursor-pointer"
             @click="$emit('lightbox', room, room.activePhoto)">
          <img
            v-for="(src, pi) in room.images"
            :key="src"
            :src="src"
            :alt="`${room.name} — фото ${pi + 1}`"
            class="absolute inset-0 w-full h-full object-cover room-photo-transition"
            :class="room.activePhoto === pi ? 'opacity-100 z-2' : 'opacity-0 z-1'"
          />
          <div class="absolute top-4 right-4 z-10" @click.stop>
            <button @click="$emit('lightbox', room, room.activePhoto)"
                    class="media-arrow"
                    title="Открыть на весь экран">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M7 4.5v5M4.5 7h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3" @click.stop>
            <div v-if="room.images.length > 1" class="flex items-center gap-1.5">
              <button @click="prevPhoto" class="media-arrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 1.5L3 6l5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button @click="nextPhoto" class="media-arrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4 1.5L9 6l-5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div v-if="room.images.length > 1" class="flex items-center gap-1.5 ml-auto">
              <button v-for="(_, pi) in room.images" :key="pi"
                      @click="room.activePhoto = pi"
                      class="media-dot"
                      :class="room.activePhoto === pi ? 'bg-white w-5' : 'bg-white/50 w-2'"></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Info (40%) -->
      <div class="flex-1 p-6 lg:p-7 flex flex-col">
        <h3 class="font-display font-500 text-sand-900 mb-4" style="font-size: clamp(1.4rem, 2.5vw, 1.8rem)">{{ room.name }}</h3>

        <p class="font-body text-4 text-sand-700 leading-relaxed mb-4 room-desc">
          {{ room.description }}
        </p>

        <div v-if="room.note" class="flex items-start gap-2.5 bg-amber-400/8 border border-amber-400/20 rounded-2 px-4 py-3 mb-4">
          <svg class="flex-shrink-0 mt-0.5 text-amber-500" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5h.007" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          <span class="text-small text-amber-700 font-500 leading-snug">{{ room.note }}</span>
        </div>

        <div class="flex flex-wrap gap-2 mb-auto pb-5">
          <span class="spec-chip">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.3"/>
              <path d="M2 7h14M7 2v14" stroke="currentColor" stroke-width="1.3"/>
            </svg>
            {{ room.area }} м²
          </span>
          <span class="spec-chip">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <rect x="1.5" y="8" width="15" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
              <path d="M3 8V6a3 3 0 016 0v2M9 8V6a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.3"/>
              <path d="M1.5 11.5h15" stroke="currentColor" stroke-width="1.3"/>
            </svg>
            {{ room.bed }}
          </span>
          <span class="spec-chip">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="5.5" r="3" stroke="currentColor" stroke-width="1.3"/>
              <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            до {{ room.guests }} гостей
          </span>
          <span class="spec-chip">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <path d="M2 13c2-4 4.5-7 7-7s5 2 7 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              <path d="M1 15h16" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              <circle cx="13" cy="4" r="2" stroke="currentColor" stroke-width="1.3"/>
            </svg>
            {{ room.view }}
          </span>
          <span v-for="(tag, ti) in room.tags.slice(0, 4)" :key="ti" class="amenity-chip">
            {{ tag }}
          </span>
          <button v-if="room.tags.length > 4"
                  @click="$emit('details', room)"
                  class="amenity-chip amenity-chip--more">
            ещё {{ room.tags.length - 4 }}
          </button>
        </div>

        <div class="pt-4 border-t border-sand-100">
          <div class="text-left mb-4">
            <span class="font-display font-500 text-sand-900" style="font-size: clamp(1.3rem, 2vw, 1.6rem)">от {{ room.price }} ₽</span>
            <span class="text-small text-sand-600 ml-1">/ ночь</span>
            <span class="block text-small text-sand-600 mt-0.5">за 2 взрослых</span>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-x-4 gap-y-3">
            <button v-if="room.fullDescription"
                    @click="$emit('details', room)"
                    class="text-small font-600 text-amber-600 hover:text-amber-700 transition-colors bg-transparent border-none cursor-pointer p-0">
              Подробнее
            </button>
            <button class="btn-primary opacity-50 cursor-default" disabled>Забронировать</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Room {
  name: string
  area: number
  bed: string
  guests: number
  view: string
  price: string
  description: string
  fullDescription?: string
  note?: string
  tags: string[]
  images: string[]
  activePhoto: number
}

const props = defineProps<{
  room: Room
  reverse?: boolean
}>()

defineEmits<{
  details: [room: Room]
  lightbox: [room: Room, startIndex: number]
}>()

function nextPhoto() {
  props.room.activePhoto = (props.room.activePhoto + 1) % props.room.images.length
}
function prevPhoto() {
  props.room.activePhoto = (props.room.activePhoto - 1 + props.room.images.length) % props.room.images.length
}
</script>

<style scoped>
.room-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.room-photo-transition {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
