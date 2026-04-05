<template>
  <Transition name="preloader" @after-leave="$emit('done')">
    <div v-if="visible" class="preloader">
      <!-- Mountain ornament SVG — draws itself -->
      <svg
        class="preloader-ornament"
        width="320" height="44"
        viewBox="0 0 240 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 16h40" stroke="#8B6F47" stroke-width="1" class="draw-path"/>
        <path d="M200 16h40" stroke="#8B6F47" stroke-width="1" class="draw-path"/>
        <path d="M52 16l8-8 8 8-8 8z" stroke="#8B6F47" stroke-width="1.5" fill="none" class="draw-path"/>
        <path d="M56 16l4-4 4 4-4 4z" fill="#8B6F47" class="fill-path" opacity="0"/>
        <path d="M88 20l12-14 8 10 12-16 12 16 8-10 12 14" stroke="#8B6F47" stroke-width="1.5" fill="none" stroke-linejoin="round" class="draw-path"/>
        <circle cx="120" cy="6" r="2" fill="#8B6F47" class="fill-path" opacity="0"/>
        <path d="M172 16l8-8 8 8-8 8z" stroke="#8B6F47" stroke-width="1.5" fill="none" class="draw-path"/>
        <path d="M176 16l4-4 4 4-4 4z" fill="#8B6F47" class="fill-path" opacity="0"/>
      </svg>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineEmits<{ done: [] }>()

const base = useRuntimeConfig().app.baseURL || '/'
const visible = ref(true)

function hide() {
  visible.value = false
}

defineExpose({ hide })

onMounted(async () => {
  if (!import.meta.client) return

  await nextTick()
  animateDrawing()

  await waitForReady()
  await new Promise(r => setTimeout(r, 300))
  hide()
})

function animateDrawing() {
  const drawPaths = document.querySelectorAll('.draw-path')
  const fillPaths = document.querySelectorAll('.fill-path')

  drawPaths.forEach((path) => {
    const el = path as SVGGeometryElement
    let length: number
    try { length = el.getTotalLength() } catch { length = 100 }
    el.style.strokeDasharray = `${length}`
    el.style.strokeDashoffset = `${length}`
    el.style.animation = `drawStroke 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`
  })

  setTimeout(() => {
    fillPaths.forEach((el) => {
      ;(el as SVGElement).style.animation = 'fadeIn 0.6s ease forwards'
    })
  }, 1000)
}

async function waitForReady(): Promise<void> {
  const promises: Promise<unknown>[] = []

  if (document.fonts) {
    promises.push(document.fonts.ready)
  }

  const heroSrc = `${base}images/hero/hero-1.jpg`
  promises.push(new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = heroSrc
  }))

  const logoSrc = `${base}images/logo-white.png`
  promises.push(new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = logoSrc
  }))

  const timeout = new Promise<void>(r => setTimeout(r, 6000))

  await Promise.race([
    Promise.all(promises),
    timeout,
  ])
}
</script>

<style>
.preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #2C2416;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preloader-ornament {
  opacity: 0.8;
}

@keyframes drawStroke {
  to { stroke-dashoffset: 0; }
}

@keyframes fadeIn {
  to { opacity: 0.4; }
}

.preloader-leave-active {
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.preloader-leave-to {
  opacity: 0;
}
</style>
