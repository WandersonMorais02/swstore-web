const API_ORIGIN = import.meta.env.VITE_API_URL.replace('/api', '')

export function assetUrl(url?: string | null) {
  if (!url) return ''

  if (url.startsWith('http')) return url

  return `${API_ORIGIN}${url}`
}
