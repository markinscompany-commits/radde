<template>
  <div class="review-card flex-shrink-0" :style="widthStyle">
    <div class="flex items-center justify-between mb-4">
      <div class="review-source" :class="'review-source--' + review.source">
        <img v-if="review.source === 'yandex'" :src="`${base}images/icon-yandex-maps.svg`" width="14" height="14" alt="" />
        <img v-else-if="review.source === '2gis'" :src="`${base}images/icon-2gis.svg`" width="14" height="14" alt="" />
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612"/>
          <path d="M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2"/>
        </svg>
        <span>{{ sourceLabel }}</span>
      </div>
      <div class="flex gap-0.5">
        <span v-for="n in 5" :key="n" class="text-3.5" :class="n <= review.rating ? 'text-amber-500' : 'text-sand-200'">&#9733;</span>
      </div>
    </div>

    <p class="font-body text-4 text-sand-800 leading-relaxed mb-4 review-text">
      &laquo;{{ review.text }}&raquo;
    </p>

    <button v-if="review.fullText" @click="$emit('open', review)"
            class="text-small font-600 text-amber-600 hover:text-amber-700 transition-colors bg-transparent border-none cursor-pointer p-0 mb-4 self-start">
      Подробнее
    </button>

    <div class="mt-auto flex items-center justify-between pt-4 border-t border-sand-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
             :class="avatarClass">
          <span class="font-display font-500 text-4">{{ review.author[0] }}</span>
        </div>
        <span class="text-small font-600 text-sand-800">{{ review.author }}</span>
      </div>
      <span class="text-small text-sand-700">{{ review.date }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Review {
  id: string
  source: 'yandex' | '2gis' | 'site'
  author: string
  rating: number
  date: string
  text: string
  fullText?: string
}

const props = defineProps<{
  review: Review
  width?: number
}>()

defineEmits<{
  open: [review: Review]
}>()

const base = useRuntimeConfig().app.baseURL || '/'

const widthStyle = computed(() => props.width ? { width: `${props.width}px` } : {})

const sourceLabel = computed(() => {
  if (props.review.source === 'yandex') return 'Яндекс Карты'
  if (props.review.source === '2gis') return '2ГИС'
  return 'Сайт'
})

const avatarClass = computed(() => {
  if (props.review.source === 'yandex') return 'bg-red-50 text-red-500'
  if (props.review.source === '2gis') return 'bg-green-50 text-green-600'
  return 'bg-sand-200 text-sand-700'
})
</script>

<style scoped>
.review-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(44, 36, 22, 0.03);
}

.review-text {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* review-source — намеренное исключение из min 16px:
   мини-бейдж источника отзыва, иначе ломает layout карточки */
.review-source {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 999px;
  letter-spacing: 0.01em;
}
.review-source--yandex { background: #FFF0EE; color: #CC3326; }
.review-source--2gis { background: #EEFBEE; color: #2D8A30; }
.review-source--site { background: #F4F6EE; color: #5B7A3A; }
</style>
