<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast"
          :class="`toast--${t.type}`"
          role="status"
          @click="dismiss(t.id)"
        >
          <span class="toast-icon" aria-hidden="true">
            <!-- error: круг с восклицанием -->
            <svg v-if="t.type === 'error'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 8v5"/>
              <path d="M12 16h.01"/>
            </svg>
            <!-- success: круг с галочкой -->
            <svg v-else-if="t.type === 'success'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M8 12l3 3 5-6"/>
            </svg>
            <!-- info: круг с i -->
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 8.5h.01"/>
              <path d="M11 12h1v4h1"/>
            </svg>
          </span>
          <span class="toast-message">{{ t.message }}</span>
          <button class="toast-close" @click.stop="dismiss(t.id)" aria-label="Закрыть">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts, dismiss } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  pointer-events: none;
  max-width: calc(100vw - 40px);
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 280px;
  max-width: 380px;
  padding: 14px 16px 14px 18px;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  pointer-events: auto;
  cursor: pointer;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  line-height: 1.4;
  border-left: 4px solid currentColor;
}

/* Error — амбер-акцент на тёмном бежевом фоне (sand-900),
   заметно отличается от обычных бежевых элементов сайта */
.toast--error {
  background: #2C2416;
  color: #D4944A;
}
.toast--error .toast-message,
.toast--error .toast-close {
  color: rgba(255, 255, 255, 0.95);
}

/* Success — олива */
.toast--success {
  background: #4A6330;
  color: #B3C08E;
}
.toast--success .toast-message,
.toast--success .toast-close {
  color: rgba(255, 255, 255, 0.95);
}

/* Info — нейтральный */
.toast--info {
  background: #6B5B4A;
  color: #E8D5B7;
}
.toast--info .toast-message,
.toast--info .toast-close {
  color: rgba(255, 255, 255, 0.95);
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-top: 1px;
}

.toast-message {
  flex: 1;
  font-weight: 500;
}

.toast-close {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s, background 0.2s;
  margin-top: -2px;
}
.toast-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

/* На mobile растягиваем на всю ширину снизу */
@media (max-width: 640px) {
  .toast-container {
    left: 16px;
    right: 16px;
    bottom: 16px;
    max-width: none;
  }
  .toast {
    min-width: 0;
    max-width: none;
    width: 100%;
  }
}

/* Анимация появления/исчезновения */
.toast-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.toast-leave-active {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.toast-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.toast-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
