import { api } from '../../services/api'

export async function toggleFavorite(productId: string) {
  const { data } = await api.post('/favorites/toggle', {
    productId
  })

  return data
}

export async function checkFavorite(productId: string) {
  const { data } = await api.get<{ favorited: boolean }>(
    `/favorites/check/${productId}`
  )

  return data
}

export async function getMyFavorites() {
  const { data } = await api.get('/favorites/me')

  return data
}
