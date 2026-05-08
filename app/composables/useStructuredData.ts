// Schema.org JSON-LD для поисковых систем (Яндекс, Google).
// Подключение: useStructuredData('hotel') / .article(post) / .breadcrumbs([...]).

const SITE_URL = 'https://markinscompany-commits.github.io/radde'

export function useStructuredData() {
  function inject(json: object) {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(json),
        },
      ],
    })
  }

  return {
    /** Главная страница — Hotel + LocalBusiness + AggregateRating */
    hotel() {
      inject({
        '@context': 'https://schema.org',
        '@type': ['Hotel', 'LodgingBusiness'],
        name: 'Пансионат Радде',
        description: 'Пансионат на высоте 1700 метров в реликтовом лесу природного парка «Верхний Гуниб» в Дагестане. 12 номеров, домашняя кухня, экскурсии и трансфер.',
        url: SITE_URL,
        image: `${SITE_URL}/images/hero/hero-radde.png`,
        priceRange: 'от 5000 ₽',
        starRating: { '@type': 'Rating', ratingValue: '4' },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'RU',
          addressRegion: 'Республика Дагестан',
          addressLocality: 'Гуниб',
          streetAddress: 'природный парк «Верхний Гуниб»',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 42.3937,
          longitude: 46.9722,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          bestRating: '5',
          ratingCount: 79,
          reviewCount: 79,
        },
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Парковка', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Питание', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Баня', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Трансфер из аэропорта', value: true },
        ],
      })
    },

    /** Статья блога — Article */
    article(post: {
      title: string
      excerpt: string
      slug: string
      image?: string
      date?: string
      readTime?: string
    }) {
      const url = `${SITE_URL}/blog/${post.slug}`
      const image = post.image?.startsWith('http')
        ? post.image
        : `${SITE_URL}${post.image?.replace(/^\/radde/, '') || '/images/hero/hero-radde.png'}`
      inject({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image,
        url,
        datePublished: post.date,
        author: { '@type': 'Organization', name: 'Пансионат Радде' },
        publisher: {
          '@type': 'Organization',
          name: 'Пансионат Радде',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/logo.png`,
          },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      })
    },

    /** Хлебные крошки для любой страницы */
    breadcrumbs(items: Array<{ name: string; path: string }>) {
      inject({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: `${SITE_URL}${item.path}`,
        })),
      })
    },
  }
}
