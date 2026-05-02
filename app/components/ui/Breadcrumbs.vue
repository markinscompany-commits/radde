<template>
  <nav :class="['breadcrumbs', `breadcrumbs--${variant}`]" aria-label="Хлебные крошки">
    <ol class="breadcrumbs-list" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="breadcrumbs-item"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <a
          v-if="item.href && i < items.length - 1"
          :href="item.href"
          class="breadcrumbs-link"
          itemprop="item"
        >
          <span v-if="i === 0" class="breadcrumbs-home" aria-label="Главная">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12l9-9 9 9"/>
              <path d="M5 10v10a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V10"/>
            </svg>
            <span itemprop="name" class="sr-only">Главная</span>
          </span>
          <span v-else itemprop="name">{{ item.label }}</span>
        </a>
        <span v-else class="breadcrumbs-current" aria-current="page" itemprop="name">{{ item.label }}</span>
        <meta itemprop="position" :content="String(i + 1)" />
        <svg
          v-if="i < items.length - 1"
          class="breadcrumbs-separator"
          width="10"
          height="10"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  href?: string
}

const props = withDefaults(defineProps<{
  items: BreadcrumbItem[]
  variant?: 'dark' | 'light'
}>(), {
  variant: 'dark',
})

const SITE_URL = 'https://markinscompany-commits.github.io'

useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: props.items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.label,
          ...(item.href ? { item: item.href.startsWith('http') ? item.href : `${SITE_URL}${item.href}` } : {}),
        })),
      }),
    },
  ],
}))
</script>

<style scoped>
.breadcrumbs {
  font-family: 'Source Sans 3', sans-serif;
}

.breadcrumbs-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.breadcrumbs-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.breadcrumbs-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.breadcrumbs-home {
  display: inline-flex;
  align-items: center;
}

.breadcrumbs-separator {
  flex-shrink: 0;
  opacity: 0.5;
}

.breadcrumbs-current {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60ch;
}

/* Dark variant — для фонов bg-sand-900 (hero с фото) */
.breadcrumbs--dark .breadcrumbs-link {
  color: rgba(255, 255, 255, 0.7);
}
.breadcrumbs--dark .breadcrumbs-link:hover {
  color: #E8B57A;
}
.breadcrumbs--dark .breadcrumbs-separator {
  color: rgba(255, 255, 255, 0.4);
}
.breadcrumbs--dark .breadcrumbs-current {
  color: white;
}

/* Light variant — для фонов bg-sand-50 */
.breadcrumbs--light .breadcrumbs-link {
  color: #6B5B4A;
}
.breadcrumbs--light .breadcrumbs-link:hover {
  color: #C17F3E;
}
.breadcrumbs--light .breadcrumbs-separator {
  color: #C1A376;
}
.breadcrumbs--light .breadcrumbs-current {
  color: #2C2416;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 640px) {
  .breadcrumbs-current {
    max-width: 24ch;
  }
}
</style>
