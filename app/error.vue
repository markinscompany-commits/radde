<template>
  <div>
    <UiAppHeader @book="showBooking = true" />

    <!-- Hero-style 404 -->
    <section class="relative overflow-hidden bg-sand-900 min-h-100vh flex items-center">
      <img
        :src="`${base}images/hero/hero-2.jpg`"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-sand-900/75"></div>

      <div class="container relative z-10 py-24 md:py-32">
        <div class="max-w-180 mx-auto text-center">
          <span class="text-label text-amber-400 mb-5 block">{{ statusLabel }}</span>

          <h1 class="text-h1 text-white mb-6">
            {{ title }} <span class="section-title-accent text-sand-300">{{ titleAccent }}</span>
          </h1>

          <p class="text-body-lg text-white/75 mb-10 max-w-130 mx-auto">
            {{ message }}
          </p>

          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-14">
            <a :href="base" @click.prevent="goHome" class="btn-primary px-8 py-4">
              Вернуться на главную
            </a>
            <a :href="`${base}contacts`" class="btn-secondary !text-white !border-white/30 hover:!bg-white/10 hover:!border-white/50 px-8 py-4">
              Написать нам
            </a>
          </div>

          <!-- Популярные разделы -->
          <div class="border-t border-white/10 pt-10">
            <span class="text-small text-white/55 block mb-5">Популярные разделы</span>
            <div class="flex flex-wrap justify-center gap-x-6 gap-y-3">
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
const message = computed(() =>
  is404.value
    ? 'Возможно, ссылка устарела или вы перешли по неполному адресу. Вернитесь на главную или загляните в один из популярных разделов сайта.'
    : 'Мы уже знаем о проблеме и скоро её устраним. Попробуйте обновить страницу или вернитесь на главную.',
)

const popular = computed(() => [
  { href: `${base}#rooms`, label: 'Номера' },
  { href: `${base}#services`, label: 'Услуги' },
  { href: `${base}#gallery`, label: 'Галерея' },
  { href: `${base}#location`, label: 'Как добраться' },
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

.min-h-100vh {
  min-height: var(--app-height, 100vh);
}
</style>
