import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function useGsap() {
  if (!registered && import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }

  /** Плавное появление элемента снизу при скролле */
  function revealUp(el: HTMLElement | string, options?: gsap.TweenVars) {
    return gsap.fromTo(el, {
      y: 60,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      ...options,
    })
  }

  /** Параллакс-эффект для изображения */
  function parallax(el: HTMLElement | string, speed: number = 0.3) {
    return gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  /** Анимация появления с задержкой для списка элементов */
  function staggerReveal(els: HTMLElement[] | string, options?: gsap.TweenVars) {
    return gsap.fromTo(els, {
      y: 40,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: els,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      ...options,
    })
  }

  return { gsap, ScrollTrigger, revealUp, parallax, staggerReveal }
}
