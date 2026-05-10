// Плавная блокировка скролла страницы при открытой модалке.
// Раньше использовали position:fixed для iOS — но из-за этого на десктопе
// появлялось дёргание при открытии (резкая смена layout body). Теперь:
// overflow:hidden + компенсация scrollbar через padding-right, без position:fixed.
// На iOS data-lenis-prevent + overscroll-behavior: contain на модалке работают
// достаточно, чтобы страница не скроллилась.

let lockCount = 0

export function useBodyLock() {
  function lock() {
    if (!import.meta.client) return
    lockCount++
    if (lockCount > 1) return
    // Компенсируем исчезающий scrollbar — иначе sticky sidebar дёргается
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'
  }

  function unlock() {
    if (!import.meta.client) return
    lockCount = Math.max(0, lockCount - 1)
    if (lockCount > 0) return
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }

  return { lock, unlock }
}
