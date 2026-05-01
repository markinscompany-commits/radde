import Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function useLenis() {
  function init() {
    if (lenisInstance) return lenisInstance

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenisInstance?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return lenisInstance
  }

  function destroy() {
    lenisInstance?.destroy()
    lenisInstance = null
  }

  function scrollTo(target: string | number | HTMLElement, options?: any) {
    lenisInstance?.scrollTo(target, options)
  }

  return { init, destroy, scrollTo, instance: () => lenisInstance }
}
