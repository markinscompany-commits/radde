// Общий composable для meta-тегов: title, description, Open Graph, Twitter Cards.
// Используется на каждой странице вместо useHead, чтобы один вызов проставлял
// все важные SEO/SMM-теги из одного места.

interface SiteMetaOpts {
  title: string
  description: string
  /** Абсолютный URL картинки для OG/Twitter (1200×630). Опционально */
  image?: string
  /** OG type: website (default), article, etc */
  type?: 'website' | 'article'
  /** Канонический URL — путь без домена, например '/booking' */
  path?: string
}

const SITE_NAME = 'Радде'
// При смене домена с GitHub Pages на боевой radde.ru — поменять SITE_URL
const SITE_URL = 'https://markinscompany-commits.github.io/radde'
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero/hero-radde.png`

export function useSiteMeta(opts: SiteMetaOpts) {
  const fullTitle = opts.title.includes(SITE_NAME)
    ? opts.title
    : `${opts.title} — ${SITE_NAME}`
  const url = opts.path ? `${SITE_URL}${opts.path}` : SITE_URL
  const image = opts.image || DEFAULT_OG_IMAGE

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: opts.description },
      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: opts.description },
      { property: 'og:type', content: opts.type || 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:site_name', content: 'Пансионат Радде' },
      { property: 'og:locale', content: 'ru_RU' },
      // Twitter Cards
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: opts.description },
      { name: 'twitter:image', content: image },
    ],
    link: [{ rel: 'canonical', href: url }],
  })
}
