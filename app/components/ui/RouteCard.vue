<template>
  <div class="route-card" @click="$emit('open', route)">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 rounded-2.5 flex items-center justify-center flex-shrink-0" :class="route.iconBg" v-html="route.icon"></div>
      <div class="flex-1 min-w-0">
        <h4 class="font-body text-4.5 font-600 text-sand-900 mb-1.5">{{ route.label }}</h4>
        <p class="text-small text-sand-700 leading-relaxed mb-3">{{ route.summary }}</p>
        <div v-if="route.time" class="flex flex-wrap items-center gap-3">
          <span class="flex items-center gap-1.5 text-small font-600 text-sand-700">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/>
            </svg>
            {{ route.time }}
          </span>
        </div>
      </div>
      <svg class="text-sand-300 flex-shrink-0 mt-1" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface RouteCardData {
  id: string
  label: string
  icon: string
  iconBg: string
  summary: string
  time: string
  title: string
  detailsHtml: string
}

defineProps<{
  route: RouteCardData
}>()

defineEmits<{
  open: [route: RouteCardData]
}>()
</script>

<style scoped>
.route-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 14px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}
@media (min-width: 640px) {
  .route-card {
    padding: 20px;
  }
}
.route-card:hover {
  border-color: #E8D5B7;
  box-shadow: 0 4px 16px rgba(44, 36, 22, 0.06);
}
</style>
