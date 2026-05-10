// iOS-friendly блокировка скролла страницы при открытой модалке.
// `document.body.style.overflow = 'hidden'` на iOS Safari не работает: страница
// продолжает скроллиться за модалкой, и появляются артефакты — модалка
// «уходит вверх», под ней видно контент страницы. Решение — зафиксировать body
// position:fixed с сохранением текущего scrollY, и восстановить при разблокировке.

let lockCount = 0
let savedScrollY = 0

export function useBodyLock() {
  function lock() {
    if (!import.meta.client) return
    lockCount++
    if (lockCount > 1) return
    savedScrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${savedScrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'
  }

  function unlock() {
    if (!import.meta.client) return
    lockCount = Math.max(0, lockCount - 1)
    if (lockCount > 0) return
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    document.body.style.overflow = ''
    window.scrollTo(0, savedScrollY)
  }

  return { lock, unlock }
}
