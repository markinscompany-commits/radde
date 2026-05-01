/**
 * Маска телефона: +7 (___) ___-__-__
 * Обрабатывает ввод с +7, 7, 8 — всё приводит к +7 (9xx) xxx-xx-xx
 * Корректно обрабатывает удаление (Backspace)
 */
export function usePhoneMask() {
  function extractDigits(raw: string): string {
    let digits = raw.replace(/\D/g, '')

    // Первая цифра 8 или 7 — это код страны, убираем
    if (digits.length > 0 && (digits[0] === '8' || digits[0] === '7')) {
      digits = digits.slice(1)
    }

    // Максимум 10 цифр (без кода страны)
    return digits.slice(0, 10)
  }

  function format(digits: string): string {
    if (digits.length === 0) return ''

    let result = '+7'
    if (digits.length > 0) result += ' (' + digits.slice(0, 3)
    if (digits.length >= 3) result += ') '
    else return result
    if (digits.length > 3) result += digits.slice(3, 6)
    if (digits.length > 6) result += '-' + digits.slice(6, 8)
    if (digits.length > 8) result += '-' + digits.slice(8, 10)

    return result
  }

  function onInput(e: Event) {
    const input = e.target as HTMLInputElement
    const raw = input.value

    // Если пользователь всё стёр
    if (raw.length === 0 || raw === '+' || raw === '+7') {
      input.value = ''
      return ''
    }

    const digits = extractDigits(raw)
    const formatted = format(digits)
    input.value = formatted

    // Курсор в конец
    const pos = formatted.length
    requestAnimationFrame(() => {
      input.setSelectionRange(pos, pos)
    })

    return formatted
  }

  function onKeydown(e: KeyboardEvent) {
    const input = e.target as HTMLInputElement

    if (e.key === 'Backspace') {
      const digits = extractDigits(input.value)

      if (digits.length <= 1) {
        // Если осталась 1 цифра или меньше — очищаем полностью
        e.preventDefault()
        input.value = ''
        input.dispatchEvent(new Event('input', { bubbles: true }))
        return
      }

      // Убираем последнюю цифру
      e.preventDefault()
      const newDigits = digits.slice(0, -1)
      const formatted = format(newDigits)
      input.value = formatted

      const pos = formatted.length
      requestAnimationFrame(() => {
        input.setSelectionRange(pos, pos)
      })

      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  return { format, extractDigits, onInput, onKeydown }
}
