<template>
  <div>
    <UiAppHeader @book="showForm = true" />
    <SectionsHero />
    <SectionsIntro />
    <UiEthnicDivider variant="light" />
    <SectionsRooms />
    <UiEthnicDivider variant="medium" />
    <SectionsServices />
    <UiEthnicDivider variant="light" />
    <SectionsUsp />
    <UiEthnicDivider variant="medium" />
    <SectionsReviews />
    <UiEthnicDivider variant="light" />
    <SectionsGallery />
    <UiEthnicDivider variant="medium" />
    <SectionsLocation />
    <UiEthnicDivider variant="light" />
    <SectionsFaq />
    <UiEthnicDivider variant="light" />
    <SectionsBlog />
    <SectionsContactFooter />

    <UiBookingModal v-model="showForm" />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Радде — Пансионат в горах Дагестана',
})

const showForm = ref(false)

// Если открыли главную с хешем (например, /radde/#rooms из /contacts через клик
// «Номера» в шапке) — после загрузки и инициализации Lenis скроллим к секции.
// Без этого Lenis перехватывает scroll-behavior и нативный прыжок по якорю не срабатывает.
onMounted(() => {
  if (!import.meta.client) return
  const hash = window.location.hash
  if (!hash) return
  const id = hash.replace('#', '')
  if (!id) return

  // Дать секциям отрендериться + Lenis инициализироваться (он стартует в app.vue onMounted).
  // Препрелоадер скрывается ~700ms — ждём чуть дольше, чтобы прокрутка попала по уже
  // отрисованной странице.
  const tryScroll = (attempt = 0) => {
    const el = document.getElementById(id)
    const lenis = useLenis().instance()
    if (el && lenis) {
      lenis.scrollTo(el, { offset: -80, duration: 1.2 })
      return
    }
    if (attempt < 20) setTimeout(() => tryScroll(attempt + 1), 100)
  }
  setTimeout(() => tryScroll(), 600)
})
</script>
