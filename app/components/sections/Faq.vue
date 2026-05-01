<template>
  <section id="faq" class="py-24 md:py-32 bg-sand-50">
    <div class="container">
      <div class="max-w-160 mx-auto">
        <div class="text-center mb-14">
          <span class="text-label text-olive-600 mb-4 block">Вопросы</span>
          <h2 ref="titleRef" class="text-h2 font-500 text-sand-900">
            Перед <span class="section-title-accent">поездкой</span>
          </h2>
        </div>

        <div ref="listRef" class="space-y-3">
          <div v-for="(item, i) in faqs" :key="i"
               class="bg-white rounded-2.5 border border-sand-200 overflow-hidden shadow-sm">
            <button
              @click="toggle(i)"
              class="w-full flex items-center justify-between p-5 md:p-6 text-left bg-transparent border-none cursor-pointer transition-colors hover:bg-sand-50/50">
              <span class="text-body font-600 text-sand-900 pr-4 leading-snug">{{ item.question }}</span>
              <div class="w-7 h-7 rounded-full bg-sand-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300"
                   :class="openIndex === i ? 'rotate-180' : ''">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4.5l4 4 4-4" stroke="#6B5B4A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </button>
            <div class="faq-body" :class="openIndex === i ? 'faq-open' : ''">
              <div class="px-5 md:px-6 pb-5 md:pb-6">
                <p class="text-body text-sand-600">{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const titleRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()
const openIndex = ref<number | null>(0)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

const faqs = [
  {
    question: 'Как добраться до пансионата?',
    answer: 'Из аэропорта Махачкалы — 3-4 часа на автомобиле по живописному горному серпантину. Мы можем организовать трансфер. Также можно добраться на маршрутке до Гуниба, а оттуда — на такси.',
  },
  {
    question: 'Есть ли питание?',
    answer: 'Да, мы предлагаем трёхразовое питание: завтрак, обед и ужин из местных продуктов. Домашняя дагестанская кухня — хинкал, чуду, курзе и многое другое. Вегетарианское меню доступно по запросу.',
  },
  {
    question: 'Подходит ли для отдыха с детьми?',
    answer: 'Безусловно. У нас есть детская площадка, безопасная территория для прогулок, а горный воздух полезен для здоровья. Мы рады семьям с детьми любого возраста.',
  },
  {
    question: 'Какие достопримечательности рядом?',
    answer: 'В шаговой доступности — Гунибская крепость, смотровые площадки с панорамными видами. Чуть дальше — водопады, каньоны и древние аулы. Мы организуем экскурсии по всем местам.',
  },
  {
    question: 'Есть ли интернет?',
    answer: 'Да, бесплатный Wi-Fi доступен во всех номерах и на территории пансионата. Скорость достаточна для видеозвонков и работы.',
  },
  {
    question: 'Можно ли приехать с домашним животным?',
    answer: 'К сожалению, размещение с домашними животными пока не предусмотрено. Мы работаем над этим и надеемся предложить такую возможность в будущем.',
  },
]

</script>

<style scoped>
.faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-open {
  max-height: 300px;
}
</style>
