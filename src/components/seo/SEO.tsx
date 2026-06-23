import { Helmet } from 'react-helmet-async'

type SEOProps = {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'product' | 'article'
}

const defaultTitle = 'Digital Commerce'
const defaultDescription =
  'Marketplace de produtos digitais, físicos e híbridos com compra segura e downloads protegidos.'

export function SEO({
  title,
  description = defaultDescription,
  image,
  url,
  type = 'website'
}: SEOProps) {
  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle

  return (
    <Helmet>
      <title>{fullTitle}</title>

      <meta name="description" content={description} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />

      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
