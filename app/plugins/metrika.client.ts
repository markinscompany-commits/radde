// Яндекс.Метрика — подключается ТОЛЬКО на клиенте и ТОЛЬКО после согласия
// гостя на аналитические cookie (152-ФЗ + ПП о cookie). Без согласия счётчик
// не грузится вовсе.
//
// Включение: задать NUXT_PUBLIC_METRIKA_ID=<номер счётчика> в .env на проде.
// Пустой id (по умолчанию) => плагин ничего не делает.
//
// Согласие хранит UiCookieBanner в localStorage 'radde-cookie-consent-v2'
// и при изменении шлёт window-событие 'cookie-consent-changed'.
export default defineNuxtPlugin(() => {
  const id = useRuntimeConfig().public.metrikaId
  if (!id) return // счётчик не настроен — выходим

  const COUNTER = Number(id)
  if (!Number.isFinite(COUNTER) || COUNTER <= 0) return

  let initialized = false

  function analyticsAllowed(): boolean {
    try {
      const raw = localStorage.getItem('radde-cookie-consent-v2')
      if (!raw) return false
      const saved = JSON.parse(raw) as { analytics?: boolean }
      return !!saved.analytics
    } catch {
      return false
    }
  }

  function initMetrika() {
    if (initialized) return
    initialized = true

    // Стандартный инициализатор Яндекс.Метрики (ym).
    ;(function (m: any, e: Document, t: string, r: string, i: string) {
      m[i] = m[i] || function (...args: unknown[]) { (m[i].a = m[i].a || []).push(args) }
      m[i].l = 1 * (new Date() as any)
      const k = e.createElement(t) as HTMLScriptElement
      const a = e.getElementsByTagName(t)[0]
      k.async = true
      k.src = r
      a?.parentNode?.insertBefore(k, a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

    ;(window as any).ym(COUNTER, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    })
  }

  // Если согласие уже дано в прошлый визит — поднимаем сразу.
  if (analyticsAllowed()) {
    initMetrika()
  }

  // Реакция на изменение согласия (клик в cookie-баннере).
  window.addEventListener('cookie-consent-changed', (e: Event) => {
    const detail = (e as CustomEvent).detail as { analytics?: boolean } | undefined
    if (detail?.analytics) initMetrika()
  })
})
