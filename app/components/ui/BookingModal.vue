<template>
  <Teleport to="body">
    <Transition name="booking-modal">
      <div v-if="isOpen"
           class="fixed inset-0 z-100 flex items-center justify-center p-5 bg-sand-900/60 backdrop-blur-sm"
           @click.self="close">
        <div class="relative w-full max-w-100 bg-sand-50 rounded-3 shadow-2xl overflow-hidden modal-body" data-lenis-prevent>

          <!-- Close -->
          <button @click="close"
                  class="absolute top-4 right-4 w-9 h-9 rounded-full bg-sand-200/90 hover:bg-sand-300 flex items-center justify-center transition-colors z-10 border-none cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 5L5 13M5 5l8 8" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>

          <!-- Form -->
          <div v-if="!isSuccess" class="px-7 md:px-9 pt-10 pb-8">
            <h2 class="font-display font-500 text-sand-900 mb-2" style="font-size: clamp(1.5rem, 3vw, 1.8rem)">Оставить заявку</h2>
            <p class="font-body text-4 text-sand-700 leading-relaxed mb-7">Оставьте контакты, и мы свяжемся с вами в течение 15 минут</p>

            <form @submit.prevent="submit" class="flex flex-col gap-4">
              <div>
                <label class="label-light">Имя</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Как к вам обращаться"
                  class="input-light"
                                    required
                />
              </div>

              <div>
                <label class="label-light">Телефон</label>
                <input
                  :value="form.phone"
                  @input="handlePhone"
                  @keydown="phoneMaskKeydown"
                  type="tel"
                  placeholder="+7 (900) 000-00-00"
                  class="input-light"
                                    required
                />
              </div>

              <!-- Чекбокс согласия на ПДн — ст. 9 152-ФЗ -->
              <label class="bm-consent">
                <input
                  v-model="consentGiven"
                  type="checkbox"
                  class="bm-consent__check"
                  :class="{ 'bm-consent__check--error': consentError }"
                />
                <span class="bm-consent__text">
                  Я&nbsp;согласен на&nbsp;обработку персональных данных в&nbsp;соответствии с&nbsp;<a :href="`${base}privacy`" target="_blank" rel="noopener" class="bm-consent__link">политикой конфиденциальности</a>
                </span>
              </label>

              <button type="submit" class="btn-primary w-full text-center py-3.5 mt-2" :disabled="submitting">
                {{ submitting ? 'Отправляем...' : 'Отправить заявку' }}
              </button>

              <p v-if="errorMessage" class="text-small text-amber-700 text-center leading-snug">{{ errorMessage }}</p>
            </form>
          </div>

          <!-- Success -->
          <div v-else class="px-7 md:px-9 pt-10 pb-8 flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-full bg-olive-100 text-olive-600 flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M10 16.5L14.5 21L22 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h2 class="font-display font-500 text-sand-900 mb-2" style="font-size: clamp(1.5rem, 3vw, 1.8rem)">Заявка отправлена</h2>
            <p class="font-body text-4 text-sand-700 mb-6">Спасибо, {{ form.name }}! Мы свяжемся с вами в ближайшее время.</p>
            <button @click="close" class="btn-primary px-10 py-3.5">Закрыть</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
const { onInput: phoneMaskInput, onKeydown: phoneMaskKeydown } = usePhoneMask()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const submitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const consentGiven = ref(false)
const consentError = ref(false)

const form = reactive({
  name: '',
  phone: '',
})

watch(isOpen, (open) => {
  if (open) {
    isSuccess.value = false
    errorMessage.value = ''
    consentGiven.value = false
    consentError.value = false
    document.body.style.overflow = 'hidden'
    useLenis().instance()?.stop()
  } else {
    document.body.style.overflow = ''
    useLenis().instance()?.start()
  }
})

function close() {
  isOpen.value = false
}

function handlePhone(e: Event) {
  form.phone = phoneMaskInput(e)
}

async function submit() {
  errorMessage.value = ''
  consentError.value = false
  if (!form.name.trim()) {
    errorMessage.value = 'Укажите имя — иначе не сможем к вам обратиться'
    return
  }
  if (form.phone.replace(/\D/g, '').length < 11) {
    errorMessage.value = 'Укажите корректный телефон в формате +7 (XXX) XXX-XX-XX'
    return
  }
  if (!consentGiven.value) {
    errorMessage.value = 'Подтвердите согласие на обработку персональных данных'
    consentError.value = true
    return
  }
  submitting.value = true
  // TODO: отправка на сервер → SQLite → Telegram
  await new Promise(resolve => setTimeout(resolve, 1200))
  submitting.value = false
  isSuccess.value = true
}
</script>

<style scoped>
/* Чекбокс согласия на ПДн (152-ФЗ) */
.bm-consent {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.bm-consent__check {
  flex-shrink: 0;
  width: 17px;
  height: 17px;
  margin: 1px 0 0;
  appearance: none;
  background: white;
  border: 1.5px solid #C7B89C;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, background 0.2s;
}
.bm-consent__check:hover { border-color: #C17F3E; }
.bm-consent__check:checked {
  background: #C17F3E;
  border-color: #C17F3E;
}
.bm-consent__check:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 7px;
  border: solid white;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}
.bm-consent__check--error {
  border-color: #B5483A;
  box-shadow: 0 0 0 3px rgba(181, 72, 58, 0.18);
}
.bm-consent__text {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  line-height: 1.4;
  color: #6B5B4A;
}
.bm-consent__link {
  color: #2C2416;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.bm-consent__link:hover { color: #C17F3E; }

/* Убиваем любой outline/shadow на полях в этой модалке */
input.input-light,
input.input-light:focus,
input.input-light:focus-visible,
input.input-light:focus-within,
input.input-light:active {
  outline: 0 !important;
  outline-style: none !important;
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

.booking-modal-enter-active { transition: opacity 0.3s ease; }
.booking-modal-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.booking-modal-leave-active { transition: opacity 0.2s ease; }
.booking-modal-leave-active > div:last-child { transition: transform 0.2s ease, opacity 0.2s ease; }
.booking-modal-enter-from { opacity: 0; }
.booking-modal-enter-from > div:last-child { opacity: 0; transform: scale(0.95) translateY(10px); }
.booking-modal-leave-to { opacity: 0; }
.booking-modal-leave-to > div:last-child { opacity: 0; transform: scale(0.97); }
</style>
