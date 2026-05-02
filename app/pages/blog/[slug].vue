<template>
  <div>
    <UiAppHeader solid @book="showBooking = true" />

    <template v-if="post">
      <!-- Hero статьи -->
      <section class="relative overflow-hidden bg-sand-900 pt-32 md:pt-40 pb-12 md:pb-16">
        <img :src="post.image" :alt="post.title" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-sand-900/72"></div>

        <div class="container relative z-10">
          <div class="flex items-center gap-3 text-small text-white/65 mb-5 flex-wrap">
            <a :href="`${base}blog`" class="inline-flex items-center gap-2 hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 12L3 8l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              К&nbsp;статьям
            </a>
            <span class="opacity-40">·</span>
            <span class="post-meta-chip">{{ post.category }}</span>
            <span class="opacity-40">·</span>
            <span>{{ post.readTime }}</span>
            <span class="opacity-40">·</span>
            <span>{{ formattedDate }}</span>
          </div>
          <h1 class="text-h1 text-white max-w-200">
            {{ post.title }}
          </h1>
        </div>
      </section>

      <!-- Тело статьи -->
      <section class="bg-sand-50 pt-12 md:pt-16 pb-16 md:pb-20">
        <div class="container">
          <article class="post-prose mx-auto">
            <p class="post-lead">{{ post.excerpt }}</p>

            <template v-for="(block, i) in post.body" :key="i">
              <p v-if="block.type === 'paragraph'">{{ block.text }}</p>
              <h2 v-else-if="block.type === 'heading'">{{ block.text }}</h2>
              <ul v-else-if="block.type === 'list'">
                <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
              </ul>
              <blockquote v-else-if="block.type === 'quote'">
                <p>{{ block.text }}</p>
                <cite v-if="block.author">— {{ block.author }}</cite>
              </blockquote>
              <figure v-else-if="block.type === 'image'">
                <img :src="block.src" :alt="block.caption || post.title" loading="lazy" />
                <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
              </figure>
            </template>
          </article>
        </div>
      </section>

      <!-- Похожие статьи -->
      <section v-if="related.length" class="bg-sand-100 section-padding">
        <div class="container">
          <UiSectionHeader label="Что почитать ещё" align="left" class="mb-10">
            <template #default>
              Похожие <span class="section-title-accent">статьи</span>
            </template>
            <template #actions>
              <UiArrowLink :href="`${base}blog`" class="hidden md:inline-flex">Все статьи</UiArrowLink>
            </template>
          </UiSectionHeader>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UiBlogCard v-for="r in related" :key="r.href" :post="r" />
          </div>

          <div class="mt-8 text-center md:hidden">
            <a :href="`${base}blog`" class="btn-secondary inline-flex items-center gap-2">
              Все статьи
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </div>
      </section>
    </template>

    <!-- Если slug не найден -->
    <template v-else>
      <section class="bg-sand-50 pt-32 md:pt-40 pb-20">
        <div class="container text-center">
          <span class="text-label text-amber-600 mb-4 block">Статья не найдена</span>
          <h1 class="text-h1 text-sand-900 mb-5">Такой публикации <span class="section-title-accent">пока нет</span></h1>
          <p class="text-body-lg text-sand-700 max-w-130 mx-auto mb-8">
            Возможно, она появится позже или ссылка устарела. Загляните в каталог — там точно есть, что почитать.
          </p>
          <a :href="`${base}blog`" class="btn-primary inline-flex items-center gap-2">
            В блог
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>
        </div>
      </section>
    </template>

    <UiSiteFooter />

    <UiBookingModal v-model="showBooking" />
  </div>
</template>

<script setup lang="ts">
const base = useRuntimeConfig().app.baseURL || '/'
const route = useRoute()
const showBooking = ref(false)

const { posts, getPost } = useBlogPosts()
const post = computed(() => getPost(String(route.params.slug)))

const formattedDate = computed(() => {
  if (!post.value) return ''
  const d = new Date(post.value.publishedAt)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
})

const related = computed(() => {
  if (!post.value) return []
  return posts
    .filter((p) => p.slug !== post.value!.slug)
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      readTime: p.readTime,
      image: p.image,
      href: `${base}blog/${p.slug}`,
    }))
})

useHead(() => ({
  title: post.value ? `${post.value.title} — Радде` : 'Статья не найдена — Радде',
  meta: post.value
    ? [{ name: 'description', content: post.value.excerpt }]
    : [{ name: 'robots', content: 'noindex, follow' }],
}))
</script>

<style scoped>
.post-meta-chip {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 3px 12px;
  border-radius: 999px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: white;
  letter-spacing: 0.02em;
}

.post-prose {
  max-width: 760px;
}

.post-lead {
  font-family: 'Source Sans 3', sans-serif;
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.6;
  color: #4A3F2E;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #F0E6D6;
}

.post-prose :deep(p) {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 17px;
  line-height: 1.75;
  color: #4A3F2E;
  margin-bottom: 1.25rem;
}

.post-prose :deep(h2) {
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
  font-size: clamp(1.4rem, 2.4vw, 1.75rem);
  color: #2C2416;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.25;
}
.post-prose :deep(h2:first-child) {
  margin-top: 0;
}

.post-prose :deep(ul) {
  list-style: none;
  padding-left: 0;
  margin-bottom: 1.5rem;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 17px;
  line-height: 1.7;
  color: #4A3F2E;
}
.post-prose :deep(li) {
  position: relative;
  padding-left: 22px;
  margin-bottom: 0.5rem;
}
.post-prose :deep(li::before) {
  content: '';
  position: absolute;
  left: 6px;
  top: 0.75em;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #C17F3E;
}

.post-prose :deep(blockquote) {
  border-left: 3px solid #C17F3E;
  padding: 0.75rem 1.5rem;
  margin: 2rem 0;
  background: #FAF6F0;
  border-radius: 0 12px 12px 0;
}
.post-prose :deep(blockquote p) {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.25rem;
  color: #2C2416;
  margin-bottom: 0.5rem;
}
.post-prose :deep(blockquote cite) {
  font-style: normal;
  font-size: 14px;
  color: #8B6F47;
}

.post-prose :deep(figure) {
  margin: 2rem 0;
}
.post-prose :deep(figure img) {
  width: 100%;
  border-radius: 16px;
}
.post-prose :deep(figcaption) {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: #8B6F47;
  text-align: center;
  margin-top: 0.75rem;
}
</style>
