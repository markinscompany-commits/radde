<template>
  <div>
    <UiAppHeader @book="showBooking = true" />

    <!-- 404 — фит в один экран -->
    <section class="error-screen relative overflow-hidden bg-sand-900 flex items-center">
      <img
        :src="`${base}images/hero/hero-2.jpg`"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- overlay темнее обычного, чтобы текст уверенно читался -->
      <div class="absolute inset-0 bg-sand-900/88"></div>

      <div class="container relative z-10 w-full">
        <div class="max-w-150 mx-auto text-center">
          <span class="text-label text-amber-400 mb-3 block">{{ statusLabel }}</span>

          <h1 class="text-white mb-6 font-display font-500" style="font-size: clamp(2rem, 6vw, 3.6rem); line-height: 1.05">
            {{ title }} <span class="font-accent italic font-500 text-sand-300">{{ titleAccent }}</span>
          </h1>

          <a :href="base" @click.prevent="goHome" class="btn-primary px-8 py-3.5 mb-8 inline-block">
            Вернуться на главную
          </a>

          <!-- Популярные разделы — компактно -->
          <div class="border-t border-white/10 pt-5">
            <span class="text-small text-white/55 block mb-3">Популярные разделы</span>
            <div class="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <a v-for="link in popular" :key="link.href" :href="link.href" class="quick-link">
                {{ link.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <UiBookingModal v-model="showBooking" />
  </div>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'

const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

const showBooking = ref(false)

const is404 = computed(() => props.error?.statusCode === 404 || !props.error?.statusCode)

const statusLabel = computed(() => is404.value ? 'Ошибка 404' : `Ошибка ${props.error?.statusCode || ''}`)
const title = computed(() => is404.value ? 'Страница' : 'Что-то')
const titleAccent = computed(() => is404.value ? 'не найдена' : 'пошло не так')

const popular = computed(() => [
  { href: `${base}#rooms`, label: 'Номера' },
  { href: `${base}#services`, label: 'Услуги' },
  { href: `${base}blog`, label: 'Блог' },
  { href: `${base}contacts`, label: 'Контакты' },
])

function goHome() {
  // clearError возвращает на главную и снимает error state
  clearError({ redirect: base })
}

useHead({
  title: is404.value ? 'Страница не найдена — Радде' : 'Ошибка — Радде',
  meta: [
    { name: 'robots', content: 'noindex' },
  ],
})

// Блокируем скролл на странице 404, чтобы экран был ровно один.
// На iOS Safari высоту берём из --app-height (см. app.vue) — она стабильна
// при адресной строке и НЕ прыгает на скролле.
onMounted(() => {
  if (!import.meta.client) return
  const html = document.documentElement
  const body = document.body
  const prevHtmlOverflow = html.style.overflow
  const prevBodyOverflow = body.style.overflow
  html.style.overflow = 'hidden'
  body.style.overflow = 'hidden'
  // Lenis тоже останавливаем, чтобы он не продолжал плавный скролл
  useLenis().instance()?.stop()
  onUnmounted(() => {
    html.style.overflow = prevHtmlOverflow
    body.style.overflow = prevBodyOverflow
    useLenis().instance()?.start()
  })
})
</script>

<style scoped>
.quick-link {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  transition: color 0.2s;
}
.quick-link:hover {
  color: #D4944A;
}

/* Фиксируем высоту секции ровно в один экран — без скролла.
   --app-height проставляется в app.vue (onMounted + orientationchange,
   БЕЗ resize) и стабильна на iOS Safari. svh — современный fallback.
   100vh — последний fallback для старых движков. */
.error-screen {
  height: 100vh;
  height: 100svh;
  height: var(--app-height, 100svh);
  min-height: 100vh;
  min-height: 100svh;
  min-height: var(--app-height, 100svh);
}
</style>
