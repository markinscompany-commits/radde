<template>
  <div
    class="fixed top-0 left-0 right-0 z-50"
    :class="scrolled ? 'bg-sand-900/95 backdrop-blur-md shadow-lg shadow-sand-900/10' : 'bg-transparent'"
    :style="{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease, background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease',
    }"
  >
  <header class="relative flex items-center justify-between px-5 md:px-8 max-w-1400px mx-auto w-full" :class="scrolled ? 'py-2.5' : 'py-8'" style="transition: padding 0.3s ease">
    <!-- Left: Nav -->
    <nav class="hidden lg:flex items-center gap-5">
      <a v-for="link in mainNav" :key="link.href"
         :href="link.href"
         @click.prevent="smoothScroll(link.href)"
         class="nav-link">
        {{ link.label }}
      </a>
      <!-- Ещё -->
      <div class="relative">
        <button @click="moreOpen = !moreOpen"
                class="nav-link flex items-center gap-1 bg-transparent border-none cursor-pointer">
          Ещё
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" class="transition-transform duration-200" :class="moreOpen ? 'rotate-180' : ''">
            <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <Transition name="dropdown">
          <div v-if="moreOpen" class="absolute top-full left-0 mt-3 bg-sand-900/95 backdrop-blur-md border border-white/10 rounded-2 py-2 min-w-44 shadow-xl z-60">
            <a v-for="link in moreNav" :key="link.href"
               :href="link.href"
               @click.prevent="smoothScroll(link.href); moreOpen = false"
               class="dropdown-link">
              {{ link.label }}
            </a>
          </div>
        </Transition>
      </div>
    </nav>

    <!-- Center: Logo -->
    <a href="/" class="absolute left-1/2 -translate-x-1/2 flex-shrink-0">
      <img :src="`${base}images/logo-white.png`" alt="Радде — Пансионат" :class="scrolled ? 'h-10' : 'h-12 md:h-14'" class="w-auto" style="transition: height 0.3s ease" />
    </a>

    <!-- Right side: phone + messengers + CTA -->
    <div class="hidden md:flex items-center gap-4">
      <!-- Мессенджеры -->
      <div class="flex items-center gap-1.5">
        <a href="#" target="_blank" title="WhatsApp" class="messenger-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
        <a href="#" target="_blank" title="Telegram" class="messenger-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        </a>
        <a href="#" target="_blank" title="Max" class="messenger-icon">
          <img :src="`${base}images/icon-max.svg`" width="16" height="16" alt="Max" style="filter: brightness(0) invert(1); opacity: 0.5;" />
        </a>
      </div>
      <a href="tel:+79001234567" class="font-body text-4 font-500 text-white/80 hover:text-white transition-colors">
        +7 (900) 123-45-67
      </a>
      <div class="w-px h-5 bg-white/20"></div>
      <button @click="$emit('book')" class="font-body text-4 font-600 text-white/80 hover:text-white transition-colors cursor-pointer bg-transparent border-none">
        Оставить заявку
      </button>
      <span class="bg-amber-500/50 text-white/60 font-body font-600 text-4 px-5 py-2 rounded-2 cursor-default no-underline">
        Забронировать
      </span>
    </div>

    <!-- Mobile menu button -->
    <button @click="toggleMobile" class="lg:hidden text-white p-2 bg-transparent border-none cursor-pointer" aria-label="Меню">
      <div class="w-6 flex flex-col gap-1.5">
        <span class="block h-0.5 bg-white rounded transition-all duration-300" :class="mobileOpen ? 'w-6 translate-y-2 rotate-45' : 'w-6'"></span>
        <span class="block h-0.5 bg-white rounded transition-all duration-300" :class="mobileOpen ? 'opacity-0' : 'w-4 ml-auto'"></span>
        <span class="block h-0.5 bg-white rounded transition-all duration-300" :class="mobileOpen ? 'w-6 -translate-y-2 -rotate-45' : 'w-5 ml-auto'"></span>
      </div>
    </button>
  </header>

  </div>

  <!-- Mobile menu -->
  <Transition name="slide">
    <div v-if="mobileOpen" class="fixed top-16 left-0 right-0 bottom-0 z-60 lg:hidden bg-sand-900/95 backdrop-blur-md border-t border-white/10 px-5 pb-6 overflow-y-auto" data-lenis-prevent>
      <nav class="flex flex-col gap-1 mb-5">
        <a v-for="link in [...mainNav, ...moreNav]" :key="link.href"
           :href="link.href"
           @click.prevent="smoothScroll(link.href); closeMobile()"
           class="mobile-link">
          {{ link.label }}
        </a>
        <a href="/blog" @click="closeMobile()" class="mobile-link">Блог</a>
      </nav>

      <a href="tel:+79001234567" class="block font-body text-4 font-600 text-white mb-4">
        +7 (900) 123-45-67
      </a>

      <div class="flex gap-3">
        <button @click="$emit('book'); closeMobile()" class="flex-1 bg-white/10 border border-white/20 text-white font-body font-600 text-3.5 py-3 rounded-2 cursor-pointer transition-colors hover:bg-white/20">
          Оставить заявку
        </button>
        <span class="flex-1 bg-amber-500/50 text-white/60 font-body font-600 text-3.5 py-3 rounded-2 text-center cursor-default">
          Забронировать
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'

defineEmits<{
  book: []
}>()

interface NavLink {
  href: string
  label: string
  section: string
}

const mainNav: NavLink[] = [
  { href: '/', label: 'Главная', section: 'hero' },
  { href: '#rooms', label: 'Номера', section: 'rooms' },
  { href: '#services', label: 'Услуги', section: 'services' },
  { href: '#about', label: 'Локация', section: 'about' },
  { href: '#location', label: 'Как добраться', section: 'location' },
]

const moreNav: NavLink[] = [
  { href: '#gallery', label: 'Галерея', section: 'gallery' },
  { href: '#food', label: 'Питание', section: 'food' },
  { href: '#activities', label: 'Чем заняться', section: 'activities' },
  { href: '#about', label: 'О пансионате', section: 'about' },
  { href: '/contacts', label: 'Контакты', section: 'contacts' },
  { href: '/blog', label: 'Блог', section: 'blog' },
]

const mobileOpen = ref(false)
const moreOpen = ref(false)
const scrolled = ref(false)
const visible = ref(false)
const activeSection = ref('hero')

const moreSections = moreNav.map(l => l.section)
const moreDropdownActive = computed(() => moreSections.includes(activeSection.value))

function smoothScroll(href: string) {
  // External pages — navigate normally
  if (href.startsWith('/') && !href.startsWith('/#')) {
    if (href === '/') {
      useLenis().scrollTo(0, { duration: 1.2 })
      return
    }
    window.location.href = href
    return
  }
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    useLenis().scrollTo(el, { offset: -80, duration: 1.2 })
  }
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
  document.body.style.overflow = mobileOpen.value ? 'hidden' : ''
}

function closeMobile() {
  mobileOpen.value = false
  document.body.style.overflow = ''
}

// Закрыть dropdown при клике вне
if (import.meta.client) {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      moreOpen.value = false
    }
  })
}

onMounted(() => {
  setTimeout(() => { visible.value = true }, 100)

  // Track scroll + active section
  const sectionIds = ['rooms', 'services', 'about', 'location', 'gallery', 'activities', 'contacts']

  const onScroll = () => {
    scrolled.value = window.scrollY > 80

    // Determine active section
    const headerHeight = 120
    let current = 'hero'

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= headerHeight && rect.bottom > headerHeight) {
          current = id
          break
        }
      }
    }
    // If we're at the very top
    if (window.scrollY < 200) current = 'hero'
    // If we're at the very bottom, pick last section
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100) {
      current = 'contacts'
    }
    activeSection.value = current
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })
})
</script>

<style scoped>
.nav-link {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  transition: color 0.2s;
  text-decoration: none;
  white-space: nowrap;
}
.nav-link:hover {
  color: white;
}
.nav-link--active {
  color: #D4944A !important;
}

.messenger-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
}
.messenger-icon:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.mobile-link {
  display: block;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  text-decoration: none;
  transition: color 0.2s;
}
.mobile-link:hover {
  color: white;
}
.mobile-link--active {
  color: #D4944A !important;
}

.dropdown-link {
  display: block;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  padding: 8px 16px;
  text-decoration: none;
  transition: all 0.15s;
  white-space: nowrap;
}
.dropdown-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.08);
}
.dropdown-link--active {
  color: #D4944A !important;
}

.dropdown-enter-active { transition: all 0.2s ease; }
.dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.slide-enter-active { transition: all 0.3s ease; }
.slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
