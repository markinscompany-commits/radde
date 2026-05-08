<template>
  <label class="consent" :class="{ 'consent--dark': dark }">
    <input
      ref="inputRef"
      :checked="modelValue"
      type="checkbox"
      class="consent__check"
      :class="{ 'consent__check--error': error }"
      @change="onChange"
    />
    <span class="consent__text">
      <slot>
        Я&nbsp;даю согласие на&nbsp;обработку персональных данных
        на&nbsp;условиях <a :href="`${base}privacy`" target="_blank" rel="noopener" class="consent__link">политики конфиденциальности</a>
      </slot>
    </span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  error?: boolean
  dark?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const base = useRuntimeConfig().app.baseURL || '/'
const inputRef = ref<HTMLInputElement>()

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<style scoped>
.consent {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.consent__check {
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
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.consent__check:hover { border-color: #C17F3E; }
.consent__check:checked {
  background: #C17F3E;
  border-color: #C17F3E;
}
.consent__check:checked::after {
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
.consent__check--error {
  border-color: #B5483A;
  box-shadow: 0 0 0 3px rgba(181, 72, 58, 0.18);
}
.consent__text {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  line-height: 1.4;
  color: #6B5B4A;
}
.consent__link,
.consent__text :deep(a) {
  color: #2C2416;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.consent__link:hover,
.consent__text :deep(a:hover) { color: #C17F3E; }

/* Тёмный вариант — для использования на тёмном фоне (ContactFooter) */
.consent--dark .consent__check {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
}
.consent--dark .consent__check:hover {
  border-color: #D4944A;
}
.consent--dark .consent__check:checked {
  background: #D4944A;
  border-color: #D4944A;
}
.consent--dark .consent__text {
  color: rgba(255, 255, 255, 0.7);
}
.consent--dark .consent__link,
.consent--dark .consent__text :deep(a) {
  color: white;
}
.consent--dark .consent__link:hover,
.consent--dark .consent__text :deep(a:hover) {
  color: #D4944A;
}
</style>
