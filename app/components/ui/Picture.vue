<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  src: string
  widths?: number[]
  sizes?: string
}>(), {
  widths: () => [480, 960, 1600],
  sizes: '100vw',
})

const srcset = computed(() => {
  const baseNoExt = props.src.replace(/\.(jpe?g|png|webp)$/i, '')
  return props.widths.map(w => `${baseNoExt}-${w}w.webp ${w}w`).join(', ')
})
</script>

<template>
  <picture>
    <source type="image/webp" :srcset="srcset" :sizes="sizes" />
    <img :src="src" v-bind="$attrs" />
  </picture>
</template>
