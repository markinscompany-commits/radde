<template>
  <Teleport to="body">
    <Transition name="cookie">
      <div v-if="visible" class="cookie-banner">
        <div class="cookie-inner">
          <p class="cookie-text">
            Мы используем файлы cookie для улучшения работы сайта.
            Продолжая использовать сайт, вы соглашаетесь с&nbsp;<a href="/privacy" class="cookie-link">политикой конфиденциальности</a>.
          </p>
          <div class="cookie-actions">
            <button @click="accept" class="cookie-btn cookie-accept">Принять</button>
            <button @click="decline" class="cookie-btn cookie-decline">Отклонить</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const visible = ref(false)

onMounted(() => {
  if (!import.meta.client) return
  const consent = localStorage.getItem('radde-cookie-consent')
  if (!consent) {
    // Показываем с задержкой, чтобы не мешать загрузке
    setTimeout(() => { visible.value = true }, 2000)
  }
})

function accept() {
  localStorage.setItem('radde-cookie-consent', 'accepted')
  visible.value = false
}

function decline() {
  localStorage.setItem('radde-cookie-consent', 'declined')
  visible.value = false
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  padding: 16px;
}

.cookie-inner {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
  background: #2C2416;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 16px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

@media (max-width: 640px) {
  .cookie-inner {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

.cookie-text {
  flex: 1;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: rgba(250, 246, 240, 0.6);
  line-height: 1.5;
}

.cookie-link {
  color: rgba(250, 246, 240, 0.8);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}
.cookie-link:hover {
  color: #C17F3E;
}

.cookie-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.cookie-btn {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.cookie-accept {
  background: #C17F3E;
  color: white;
}
.cookie-accept:hover {
  background: #A66B32;
}

.cookie-decline {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(250, 246, 240, 0.5);
}
.cookie-decline:hover {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(250, 246, 240, 0.8);
}

/* Transition */
.cookie-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}
.cookie-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.cookie-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.cookie-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
