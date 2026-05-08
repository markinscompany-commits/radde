<template>
  <Teleport to="body">
    <Transition name="cookie">
      <div v-if="visible" class="cookie-banner" role="dialog" aria-labelledby="cookie-title">
        <div class="cookie-inner" :class="settingsOpen ? 'cookie-inner--expanded' : ''">

          <!-- Compact view -->
          <template v-if="!settingsOpen">
            <div class="cookie-text-wrap">
              <h2 id="cookie-title" class="cookie-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10c0-.46-.04-.92-.1-1.36a5.4 5.4 0 0 1-4.5-4.5 5.4 5.4 0 0 1-3.18-3.95A10 10 0 0 0 12 2"/><path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01M11 17v.01M7 14v.01"/></svg>
                Мы используем файлы cookie
              </h2>
              <p class="cookie-text">
                Технические cookie нужны, чтобы сайт работал. Аналитические — чтобы понять,
                какие страницы вам полезнее. Маркетинговые подключаем только с&nbsp;вашего согласия.
                Подробности&nbsp;— в&nbsp;<a :href="`${base}privacy`" class="cookie-link">политике конфиденциальности</a>.
              </p>
            </div>
            <div class="cookie-actions">
              <button @click="acceptAll" class="cookie-btn cookie-btn--primary">Принять всё</button>
              <button @click="declineOptional" class="cookie-btn cookie-btn--ghost">Только необходимые</button>
              <button @click="settingsOpen = true" class="cookie-btn cookie-btn--link">Настроить</button>
            </div>
          </template>

          <!-- Settings view -->
          <template v-else>
            <div class="cookie-settings-head">
              <h2 class="cookie-title">Настройки cookie</h2>
              <button @click="settingsOpen = false" class="cookie-close" aria-label="Закрыть настройки">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
            </div>

            <ul class="cookie-categories">
              <li class="cookie-category">
                <div>
                  <span class="cookie-cat-name">Технические <span class="cookie-cat-required">обязательные</span></span>
                  <p class="cookie-cat-desc">Нужны для работы корзины, формы бронирования и сохранения вашей сессии. Без них сайт не работает, поэтому отключить нельзя.</p>
                </div>
                <label class="cookie-toggle cookie-toggle--locked" aria-label="Технические cookie всегда включены">
                  <input type="checkbox" checked disabled />
                  <span class="cookie-toggle-slider"></span>
                </label>
              </li>

              <li class="cookie-category">
                <div>
                  <span class="cookie-cat-name">Аналитические</span>
                  <p class="cookie-cat-desc">Яндекс.Метрика — обезличенная статистика посещений, чтобы понимать, какие страницы и кнопки полезны. Хранятся на серверах в РФ.</p>
                </div>
                <label class="cookie-toggle">
                  <input type="checkbox" v-model="prefs.analytics" />
                  <span class="cookie-toggle-slider"></span>
                </label>
              </li>

              <li class="cookie-category">
                <div>
                  <span class="cookie-cat-name">Маркетинговые</span>
                  <p class="cookie-cat-desc">Помогают показать релевантные предложения в&nbsp;Яндекс.Директе и&nbsp;других рекламных сетях, если вы&nbsp;уже были у&nbsp;нас на&nbsp;сайте.</p>
                </div>
                <label class="cookie-toggle">
                  <input type="checkbox" v-model="prefs.marketing" />
                  <span class="cookie-toggle-slider"></span>
                </label>
              </li>
            </ul>

            <div class="cookie-actions cookie-actions--settings">
              <button @click="acceptAll" class="cookie-btn cookie-btn--primary">Принять всё</button>
              <button @click="saveCustom" class="cookie-btn cookie-btn--ghost">Сохранить выбор</button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'

const STORAGE_KEY = 'radde-cookie-consent-v2'
const visible = ref(false)
const settingsOpen = ref(false)
const prefs = reactive({
  analytics: true,
  marketing: false,
})

interface ConsentRecord {
  necessary: true
  analytics: boolean
  marketing: boolean
  acceptedAt: string
  version: 2
}

onMounted(() => {
  if (!import.meta.client) return
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    setTimeout(() => { visible.value = true }, 1500)
    return
  }
  try {
    const saved = JSON.parse(raw) as ConsentRecord
    prefs.analytics = !!saved.analytics
    prefs.marketing = !!saved.marketing
  } catch {
    // повреждённое значение — показываем баннер заново
    setTimeout(() => { visible.value = true }, 1500)
  }
})

function save(record: ConsentRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  visible.value = false
  settingsOpen.value = false
  // Аналитика подключается отдельно (Яндекс.Метрика — после согласия).
  // При наличии — здесь же делаем window.dispatchEvent('cookie-consent-changed').
  window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: record }))
}

function acceptAll() {
  prefs.analytics = true
  prefs.marketing = true
  save({ necessary: true, analytics: true, marketing: true, acceptedAt: new Date().toISOString(), version: 2 })
}

function declineOptional() {
  prefs.analytics = false
  prefs.marketing = false
  save({ necessary: true, analytics: false, marketing: false, acceptedAt: new Date().toISOString(), version: 2 })
}

function saveCustom() {
  save({ necessary: true, analytics: prefs.analytics, marketing: prefs.marketing, acceptedAt: new Date().toISOString(), version: 2 })
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
  pointer-events: none;
}

.cookie-inner {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
  background: #2C2416;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 16px 22px;
  box-shadow: 0 12px 38px rgba(0, 0, 0, 0.35);
  pointer-events: auto;
}
.cookie-inner--expanded {
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
  max-width: 620px;
}

@media (max-width: 700px) {
  .cookie-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

.cookie-text-wrap { flex: 1; min-width: 0; }
.cookie-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: white;
  margin: 0 0 6px;
}
.cookie-title svg { color: #D4944A; flex-shrink: 0; }

.cookie-text {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: rgba(250, 246, 240, 0.78);
  line-height: 1.5;
  margin: 0;
}

.cookie-link {
  color: white;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}
.cookie-link:hover { color: #D4944A; }

.cookie-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.cookie-actions--settings {
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 12px;
}

.cookie-btn {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 9px 18px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.cookie-btn--primary {
  background: #C17F3E;
  color: white;
}
.cookie-btn--primary:hover { background: #A66B32; }

.cookie-btn--ghost {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(250, 246, 240, 0.85);
}
.cookie-btn--ghost:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.cookie-btn--link {
  background: transparent;
  color: rgba(250, 246, 240, 0.7);
  text-decoration: underline;
  text-underline-offset: 3px;
  padding-left: 4px;
  padding-right: 4px;
}
.cookie-btn--link:hover { color: white; }

/* Settings view */
.cookie-settings-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.cookie-close {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.cookie-close:hover { background: rgba(255, 255, 255, 0.12); color: white; }

.cookie-categories {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 50vh;
  overflow-y: auto;
}
.cookie-category {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 12px 14px;
}
.cookie-cat-name {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.cookie-cat-required {
  font-size: 11px;
  font-weight: 600;
  color: rgba(212, 148, 74, 0.85);
  background: rgba(212, 148, 74, 0.12);
  padding: 2px 8px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}
.cookie-cat-desc {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: rgba(250, 246, 240, 0.65);
  margin: 4px 0 0;
  line-height: 1.4;
}

/* Toggle switch */
.cookie-toggle {
  position: relative;
  width: 38px;
  height: 22px;
  flex-shrink: 0;
  cursor: pointer;
  margin-top: 2px;
}
.cookie-toggle input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
.cookie-toggle--locked,
.cookie-toggle--locked input { cursor: default; }
.cookie-toggle-slider {
  display: block;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  transition: background 0.2s;
}
.cookie-toggle-slider::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}
.cookie-toggle input:checked + .cookie-toggle-slider {
  background: #C17F3E;
}
.cookie-toggle input:checked + .cookie-toggle-slider::before {
  transform: translateX(16px);
}
.cookie-toggle--locked .cookie-toggle-slider {
  background: rgba(193, 127, 62, 0.5);
}

/* Transition */
.cookie-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}
.cookie-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.cookie-enter-from { opacity: 0; transform: translateY(20px); }
.cookie-leave-to { opacity: 0; transform: translateY(10px); }
</style>
