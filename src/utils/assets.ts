const API_URL = import.meta.env.VITE_API_URL || ''
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '')

export function assetUrl(url?: string | null) {
  if (!url) return ''

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const normalizedUrl = url.startsWith('/') ? url : `/${url}`

  return `${API_ORIGIN}${normalizedUrl}`
}
