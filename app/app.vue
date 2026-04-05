<template>
  <div ref="appRef">
    <UiPreloader @done="onPreloaderDone" />
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <UiCookieBanner />
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

onMounted(() => {
  init()

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
