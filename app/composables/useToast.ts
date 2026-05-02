/**
 * Toast-уведомления (push в правом нижнем углу).
 * `useToast().error(msg)` / `.success(msg)` / `.info(msg)` — показать.
 * Автоматически исчезают через 5 секунд (по умолчанию). Кликабельны для скрытия.
 *
 * Глобальный список через `useState` — общий между компонентами,
 * рендерится в `<UiToastContainer />` (подключён в `app.vue`).
 */
export type ToastType = 'error' | 'success' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

let nextId = 1

export function useToast() {
  const toasts = useState<ToastItem[]>('toasts', () => [])

  function show(message: string, type: ToastType = 'info', duration = 5000) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    if (import.meta.client && duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }

  function dismiss(id: number) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx >= 0) toasts.value.splice(idx, 1)
  }

  return {
    toasts,
    show,
    dismiss,
    error: (msg: string, duration = 5000) => show(msg, 'error', duration),
    success: (msg: string, duration = 5000) => show(msg, 'success', duration),
    info: (msg: string, duration = 5000) => show(msg, 'info', duration),
  }
}
