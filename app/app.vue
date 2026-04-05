<template>
  <div ref="appRef">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <UiCookieBanner />
  </div>
</template>

<script setup lang="ts">
const appRef = ref<HTMLElement>()
const { init, destroy } = useLenis()
const { applyToElement } = useTypograf()

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
