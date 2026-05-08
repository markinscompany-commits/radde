<template>
  <div>
    <!-- Contact section -->
    <section id="contacts" class="relative section-padding overflow-hidden">
      <div class="absolute inset-0 bg-sand-900" :style="{ backgroundImage: `url(${base}images/hero/hero-3.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }">
        <div class="absolute inset-0 bg-sand-900/85"></div>
      </div>

      <div class="container relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <!-- Left: contact info -->
          <div ref="infoRef">
            <UiSectionHeader label="Контакты" align="left" dark class="mb-6">
              Связаться<br>
              <span class="font-accent italic font-500 text-sand-400 text-[1.3em]">с нами</span>
            </UiSectionHeader>
            <p class="text-body text-white/75 mb-8 max-w-90">
              Мы рады ответить на любые вопросы и помочь с выбором номера, маршрутом и организацией отдыха.
            </p>

            <a :href="`tel:${contacts.phone.tel}`" class="block mb-4">
              <span class="text-small text-white/65 block mb-1">Телефон</span>
              <span class="font-display font-500 text-white leading-none whitespace-nowrap" style="font-size: clamp(1.5rem, 4.5vw, 3rem)">
                {{ contacts.phone.display }}
              </span>
            </a>

            <a :href="`mailto:${contacts.email}`" class="block mb-4">
              <span class="text-small text-white/65 block mb-1">Email</span>
              <span class="font-body text-4 text-white/90">{{ contacts.email }}</span>
            </a>

            <div class="mb-8">
              <span class="text-small text-white/65 block mb-1">Адрес</span>
              <a :href="contacts.address.mapUrl" target="_blank" rel="noopener" class="font-body text-4 text-white/85 hover:text-white transition-colors">{{ contacts.address.short }}</a>
            </div>

            <UiSocialIcons size="md" :gap="4" />
          </div>

          <!-- Right: contact form -->
          <div ref="formRef">
            <div class="bg-sand-900/60 border border-white/10 rounded-3 p-6 md:p-8">
              <form v-if="!contactSuccess" @submit.prevent="submitContact">
                <h3 class="font-display font-500 text-6 text-white mb-6">Оставить заявку</h3>
                <div class="space-y-4 mb-6">
                  <div>
                    <label class="label-dark">Имя</label>
                    <input v-model="contactForm.name" type="text" placeholder="Как к вам обращаться" class="input-dark" required />
                  </div>
                  <div>
                    <label class="label-dark">Телефон</label>
                    <input :value="contactForm.phone" @input="handlePhone" @keydown="phoneMaskKeydown" type="tel" placeholder="+7 (900) 000-00-00" class="input-dark" required />
                  </div>
                  <div>
                    <label class="label-dark">Комментарий <span style="opacity:0.5">(необязательно)</span></label>
                    <textarea v-model="contactForm.comment" placeholder="Пожелания, вопросы..." rows="3" class="input-dark" style="height:auto;min-height:80px;padding:10px 14px;resize:vertical;line-height:1.5"></textarea>
                  </div>
                </div>
                <!-- Чекбокс согласия на ПДн — ст. 9 152-ФЗ -->
                <label class="cf-consent">
                  <input
                    v-model="consentGiven"
                    type="checkbox"
                    class="cf-consent__check"
                    :class="{ 'cf-consent__check--error': consentError }"
                  />
                  <span class="cf-consent__text">
                    Я&nbsp;даю согласие на&nbsp;обработку персональных данных в&nbsp;соответствии с&nbsp;<a :href="`${base}privacy`" target="_blank" rel="noopener" class="cf-consent__link">политикой конфиденциальности</a>
                  </span>
                </label>
                <button type="submit" class="btn-primary w-full text-center py-4 mt-4" :disabled="contactSubmitting">
                  {{ contactSubmitting ? 'Отправляем...' : 'Отправить заявку' }}
                </button>
                <p v-if="contactError" class="text-small text-amber-300 mt-3 text-center leading-snug">{{ contactError }}</p>
              </form>
              <div v-else class="flex flex-col items-center text-center py-4">
                <div class="w-14 h-14 rounded-full bg-olive-500/20 text-olive-300 flex items-center justify-center mb-5">
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M10 16.5L14.5 21L22 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <h3 class="font-display font-500 text-6 text-white mb-3">Заявка отправлена</h3>
                <p class="font-body text-4 text-white/75 mb-6 max-w-80">Спасибо, {{ contactForm.name }}! Мы свяжемся с вами в ближайшее время.</p>
                <button @click="resetContact" class="btn-primary px-10 py-3.5">Отправить ещё одну</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <UiSiteFooter />
  </div>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
const contacts = useContacts()

const { onInput: phoneMaskOnInput, onKeydown: phoneMaskKeydown } = usePhoneMask()
const infoRef = ref<HTMLElement>()
const formRef = ref<HTMLElement>()

const contactForm = reactive({ name: '', phone: '', comment: '' })
const contactSubmitting = ref(false)
const contactSuccess = ref(false)
const contactError = ref('')
const consentGiven = ref(false)
const consentError = ref(false)

function handlePhone(e: Event) {
  contactForm.phone = phoneMaskOnInput(e)
}

async function submitContact() {
  contactError.value = ''
  consentError.value = false
  if (!contactForm.name.trim()) {
    contactError.value = 'Укажите имя — иначе не сможем к вам обратиться'
    return
  }
  if (contactForm.phone.replace(/\D/g, '').length < 11) {
    contactError.value = 'Укажите корректный телефон в формате +7 (XXX) XXX-XX-XX'
    return
  }
  if (!consentGiven.value) {
    contactError.value = 'Подтвердите согласие на обработку персональных данных'
    consentError.value = true
    return
  }
  contactSubmitting.value = true
  // TODO: отправка на сервер → SQLite → Telegram
  await new Promise(r => setTimeout(r, 1200))
  contactSubmitting.value = false
  contactSuccess.value = true
}

function resetContact() {
  contactSuccess.value = false
  contactError.value = ''
  consentGiven.value = false
  consentError.value = false
  contactForm.name = ''
  contactForm.phone = ''
  contactForm.comment = ''
}

</script>

<style scoped>
/* Чекбокс согласия на ПДн (152-ФЗ) — тёмный фон секции */
.cf-consent {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  cursor: pointer;
  user-select: none;
  margin-top: 6px;
}
.cf-consent__check {
  flex-shrink: 0;
  width: 17px;
  height: 17px;
  margin: 1px 0 0;
  appearance: none;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, background 0.2s;
}
.cf-consent__check:hover { border-color: rgba(193, 127, 62, 0.85); }
.cf-consent__check:checked {
  background: #C17F3E;
  border-color: #C17F3E;
}
.cf-consent__check:checked::after {
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
.cf-consent__check--error {
  border-color: #F0A35F;
  box-shadow: 0 0 0 3px rgba(240, 163, 95, 0.2);
}
.cf-consent__text {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.65);
}
.cf-consent__link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.cf-consent__link:hover { color: white; }
</style>

