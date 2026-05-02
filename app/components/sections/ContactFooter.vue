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
                <button type="submit" class="btn-primary w-full text-center py-4" :disabled="contactSubmitting">
                  {{ contactSubmitting ? 'Отправляем...' : 'Отправить заявку' }}
                </button>
                <p class="text-small text-white/65 mt-4 text-center">
                  Нажимая кнопку, вы соглашаетесь с <a :href="`${base}privacy`" class="text-white/85 underline underline-offset-2 hover:text-white transition-colors">политикой конфиденциальности</a>
                </p>
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

function handlePhone(e: Event) {
  contactForm.phone = phoneMaskOnInput(e)
}

async function submitContact() {
  if (!contactForm.name || !contactForm.phone) return
  contactSubmitting.value = true
  // TODO: отправка на сервер → SQLite → Telegram
  await new Promise(r => setTimeout(r, 1200))
  contactSubmitting.value = false
  contactSuccess.value = true
}

function resetContact() {
  contactSuccess.value = false
  contactForm.name = ''
  contactForm.phone = ''
  contactForm.comment = ''
}

</script>

