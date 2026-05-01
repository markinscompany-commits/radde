<template>
  <div class="service-card">
    <div class="flex items-start justify-between mb-4">
      <div class="service-icon-wrap" v-html="service.icon"></div>
      <span v-if="service.included" class="badge badge--included">Включено</span>
      <span v-else-if="service.price" class="badge badge--price">{{ service.price }}</span>
    </div>

    <h3 class="font-display font-500 text-sand-900 mb-2" style="font-size: clamp(1.15rem, 2vw, 1.35rem)">{{ service.title }}</h3>
    <p class="font-body text-4 text-sand-700 leading-relaxed mb-4 service-desc">{{ service.description }}</p>

    <div v-if="service.duration || service.format" class="flex flex-wrap items-center gap-3 mb-5 text-sand-600">
      <span v-if="service.duration" class="flex items-center gap-1.5 font-body text-4 font-500">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 7v5l3 3" />
        </svg>
        {{ service.duration }}
      </span>
      <span v-if="service.format" class="flex items-center gap-1.5 font-body text-4 font-500">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="5.5" r="3" /><path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        </svg>
        {{ service.format }}
      </span>
    </div>

    <div class="mt-auto pt-4 border-t border-sand-100 flex items-center justify-between">
      <button @click="$emit('open', service)"
              class="font-body text-4 font-600 text-amber-600 hover:text-amber-700 transition-colors bg-transparent border-none cursor-pointer p-0">
        Подробнее
      </button>
      <button v-if="!service.included"
              class="font-body text-4 font-600 text-sand-700 bg-sand-100 hover:bg-sand-200 px-3.5 py-1.5 rounded-full border-none cursor-pointer transition-colors"
              disabled>
        Добавить к брони
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Service {
  id: string
  category: string
  icon: string
  title: string
  description: string
  fullDescription?: string
  sections?: { title: string; content: string }[]
  included: boolean
  price: string
  duration: string
  format: string
}

defineProps<{
  service: Service
}>()

defineEmits<{
  open: [service: Service]
}>()
</script>

<style scoped>
.service-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #F0E6D6;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(44, 36, 22, 0.04);
}
@media (max-width: 767px) {
  .service-card {
    flex: 0 0 78%;
    max-width: 320px;
    scroll-snap-align: start;
    padding: 20px;
  }
}
.service-card:hover {
  box-shadow: 0 8px 30px rgba(44, 36, 22, 0.08);
  border-color: #E8D5B7;
  transform: translateY(-2px);
}

.service-desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #F4F6EE, #E8ECDC);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5B7A3A;
  flex-shrink: 0;
}

/* badge — намеренное исключение из правила min 16px:
   мини-бейдж в углу карточки, иначе ломает layout */
.badge {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}
.badge--included {
  background: #E8F0E0;
  color: #4A6330;
}
.badge--price {
  background: #FAF0E4;
  color: #A66B32;
}
</style>
