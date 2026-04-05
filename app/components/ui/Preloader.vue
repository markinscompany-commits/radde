<template>
  <Transition name="preloader" @after-leave="$emit('done')">
    <div v-if="visible" class="preloader">
      <div class="preloader-content">
        <!-- Mountain ornament SVG — draws itself -->
        <svg
          class="preloader-ornament"
          width="320" height="44"
          viewBox="0 0 240 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Left line -->
          <path ref="line1" d="M0 16h40" stroke="#8B6F47" stroke-width="1" class="draw-path"/>
          <!-- Right line -->
          <path ref="line2" d="M200 16h40" stroke="#8B6F47" stroke-width="1" class="draw-path"/>
          <!-- Left diamond (outer) -->
          <path ref="dia1" d="M52 16l8-8 8 8-8 8z" stroke="#8B6F47" stroke-width="1.5" fill="none" class="draw-path"/>
          <!-- Left diamond (inner fill) -->
          <path d="M56 16l4-4 4 4-4 4z" fill="#8B6F47" class="fill-path" opacity="0"/>
          <!-- Mountain peaks -->
          <path ref="mountain" d="M88 20l12-14 8 10 12-16 12 16 8-10 12 14" stroke="#8B6F47" stroke-width="1.5" fill="none" stroke-linejoin="round" class="draw-path"/>
          <!-- Peak circle -->
          <circle cx="120" cy="6" r="2" fill="#8B6F47" class="fill-path" opacity="0"/>
          <!-- Right diamond (outer) -->
          <path ref="dia2" d="M172 16l8-8 8 8-8 8z" stroke="#8B6F47" stroke-width="1.5" fill="none" class="draw-path"/>
          <!-- Right diamond (inner fill) -->
          <path d="M176 16l4-4 4 4-4 4z" fill="#8B6F47" class="fill-path" opacity="0"/>
        </svg>

        <!-- Logo + text -->
        <div class="preloader-brand" :class="brandVisible ? 'preloader-brand--visible' : ''">
          <img :src="`${base}images/logo-white.png`" alt="Радде" class="preloader-logo" />
          <span class="preloader-text">Пансионат в горах Дагестана</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineEmits<{ done: [] }>()

const base = useRuntimeConfig().app.baseURL || '/'
const visible = ref(true)
const brandVisible = ref(false)

// Expose hide method for parent
function hide() {
  visible.value = false
}

defineExpose({ hide })

onMounted(async () => {
  if (!import.meta.client) return

  // Phase 1: Animate SVG drawing
  await nextTick()
  animateDrawing()

  // Phase 2: Show brand after SVG starts
  setTimeout(() => {
    brandVisible.value = true
  }, 600)

  // Phase 3: Wait for real readiness
  await waitForReady()

  // Phase 4: Brief pause to let user see the complete state
  await new Promise(r => setTimeout(r, 400))

  // Phase 5: Hide preloader
  hide()
})

function animateDrawing() {
  const drawPaths = document.querySelectorAll('.draw-path')
  const fillPaths = document.querySelectorAll('.fill-path')

  drawPaths.forEach((path) => {
    const el = path as SVGPathElement | SVGLineElement
    let length: number
    try {
      length = (el as SVGGeometryElement).getTotalLength()
    } catch {
      length = 100
    }
    el.style.strokeDasharray = `${length}`
    el.style.strokeDashoffset = `${length}`
    el.style.animation = `drawStroke 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`
  })

  // Fill elements appear after strokes
  setTimeout(() => {
    fillPaths.forEach((el) => {
      ;(el as SVGElement).style.animation = 'fadeIn 0.6s ease forwards'
    })
  }, 1000)
}

async function waitForReady(): Promise<void> {
  const promises: Promise<unknown>[] = []

  // 1. Fonts loaded
  if (document.fonts) {
    promises.push(document.fonts.ready)
  }

  // 2. Hero image loaded
  const heroSrc = `${base}images/hero/hero-1.jpg`
  promises.push(new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve() // don't block on error
    img.src = heroSrc
  }))

  // 3. Logo loaded
  const logoSrc = `${base}images/logo-white.png`
  promises.push(new Promise<void>((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = logoSrc
  }))

  // Timeout safety — max 6 seconds
  const timeout = new Promise<void>(r => setTimeout(r, 6000))

  await Promise.race([
    Promise.all(promises),
    timeout,
  ])
}
</script>

<style>
/* Preloader base */
.preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #2C2416;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preloader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

/* Ornament */
.preloader-ornament {
  opacity: 0.8;
}

/* Brand — fade in + slide up */
.preloader-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.preloader-brand--visible {
  opacity: 1;
  transform: translateY(0);
}

.preloader-logo {
  height: 56px;
  width: auto;
  filter: brightness(1.2);
}

.preloader-text {
  font-family: 'Source Sans 3', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
}

/* SVG stroke drawing animation */
@keyframes drawStroke {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  to {
    opacity: 0.4;
  }
}

/* Exit transition — soft dissolve */
.preloader-leave-active {
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.preloader-leave-to {
  opacity: 0;
}
</style>
