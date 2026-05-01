<template>
  <a :href="post.href" class="blog-card flex-shrink-0 group" :style="widthStyle">
    <div class="blog-card-img">
      <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" loading="lazy" decoding="async" />
      <span class="blog-badge">{{ post.category }}</span>
    </div>
    <div class="p-5 flex flex-col flex-1">
      <h3 class="font-display font-500 text-sand-900 mb-2 leading-snug group-hover:text-amber-700 transition-colors"
          style="font-size: clamp(1.05rem, 1.8vw, 1.25rem)">
        {{ post.title }}
      </h3>
      <p class="text-small text-sand-700 leading-relaxed blog-excerpt mb-4">{{ post.excerpt }}</p>
      <div class="mt-auto flex items-center justify-between">
        <span class="text-small text-sand-700">{{ post.readTime }}</span>
        <span class="text-small font-600 text-amber-600 group-hover:text-amber-700 transition-colors flex items-center gap-1">
          Читать
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
export interface BlogPost {
  title: string
  excerpt: string
  category: string
  readTime: string
  image: string
  href: string
}

const props = defineProps<{
  post: BlogPost
  width?: number
}>()

const widthStyle = computed(() => props.width ? { width: `${props.width}px` } : {})
</script>

<style scoped>
.blog-card {
  background: white;
  border: 1px solid #F0E6D6;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
.blog-card:hover {
  border-color: #E8D5B7;
  box-shadow: 0 8px 30px rgba(44, 36, 22, 0.08);
}

.blog-card-img {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}
.blog-card-img img {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  transform: translateZ(0);
}
.blog-card:hover .blog-card-img img {
  transform: scale(1.04);
}

/* blog-badge — намеренное исключение из min 16px:
   мини-бейдж категории на фото, иначе занимает половину снимка */
.blog-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: rgba(44, 36, 22, 0.85);
  padding: 5px 12px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}

.blog-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
