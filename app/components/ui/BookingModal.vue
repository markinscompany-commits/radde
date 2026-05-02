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

              <button type="submit" class="btn-primary w-full text-center py-3.5 mt-2" :disabled="submitting">
                {{ submitting ? 'Отправляем...' : 'Отправить заявку' }}
              </button>

              <p v-if="errorMessage" class="text-small text-amber-700 text-center leading-snug">{{ errorMessage }}</p>

              <p class="text-small text-sand-700 text-center leading-snug">
                Нажимая кнопку, вы соглашаетесь с
                <a :href="`${base}privacy`" class="text-sand-800 underline underline-offset-2 hover:text-amber-600 transition-colors">политикой конфиденциальности</a>
              </p>
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

const form = reactive({
  name: '',
  phone: '',
})

watch(isOpen, (open) => {
  if (open) {
    isSuccess.value = false
    errorMessage.value = ''
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
  if (!form.name.trim()) {
    errorMessage.value = 'Укажите имя — иначе не сможем к вам обратиться'
    return
  }
  if (form.phone.replace(/\D/g, '').length < 11) {
    errorMessage.value = 'Укажите корректный телефон в формате +7 (XXX) XXX-XX-XX'
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
