<template>
  <div :class="align === 'center' ? 'text-center' : ''">
    <span class="text-label mb-4 block" :class="dark ? 'text-amber-400' : 'text-olive-600'">{{ label }}</span>
    <div :class="$slots.actions ? 'flex items-center justify-between gap-4' : ''">
      <h2 class="text-h2" :class="dark ? 'text-white' : 'text-sand-900'">
        <slot>
          {{ title }}<template v-if="accent"> <span class="section-title-accent">{{ accent }}</span></template>
        </slot>
      </h2>
      <slot v-if="$slots.actions" name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  title?: string
  accent?: string
  align?: 'left' | 'center'
  dark?: boolean
}>(), {
  align: 'center',
  dark: false,
})
</script>
