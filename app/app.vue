<template>
  <div ref="appRef">
    <UiPreloader @done="onPreloaderDone" />
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <UiCookieBanner />
    <UiToastContainer />
  </div>
</template>

<script setup lang="ts">
const appRef = ref<HTMLElement>()
const { init, destroy } = useLenis()
const { applyToElement } = useTypograf()

// Preloader controls GSAP hero animations
const preloaderDone = useState('preloaderDone', () => false)

function onPreloaderDone() {
  preloaderDone.value = true
}

// Provide to child components
provide('preloaderDone', preloaderDone)

// iOS Safari: 100vh "прыгает" из-за того, что адресная строка
// сжимается при скролле и meняет viewport. svh — современное
// решение, но не работает на iOS 15.0-15.3. Фиксируем высоту через
// CSS-переменную, обновляем ТОЛЬКО при первой загрузке и смене
// ориентации — НЕ при скролле/resize. Это и убирает прыжок.
function updateAppHeight() {
  if (!import.meta.client) return
  const h = window.innerHeight
  document.documentElement.style.setProperty('--app-height', `${h}px`)
}

onMounted(() => {
  init()

  // Зафиксировали высоту viewport один раз
  updateAppHeight()
  // iOS Safari иногда возвращает финальный innerHeight после первого
  // кадра — повторим через небольшой тайм-аут
  setTimeout(updateAppHeight, 200)
  // Поворот экрана — обновляем (после стабилизации innerHeight)
  window.addEventListener('orientationchange', () => {
    setTimeout(updateAppHeight, 250)
  })

  // Типограф — убираем висячие предлоги
  nextTick(() => {
    if (appRef.value) applyToElement(appRef.value)
  })

  // Наблюдатель — применяем типограф при появлении новых элементов (модалки, динамический контент)
  const observer = new MutationObserver(() => {
    applyToElement(document.body)
  })
  observer.observe(document.body, { childList: true, subtree: true })

  onUnmounted(() => {
    observer.disconnect()
    destroy()
  })
})
</script>
