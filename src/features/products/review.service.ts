import { api } from '../../services/api'
import type { CreateReviewPayload, Review } from '../../types/review'

export async function getProductReviews(productId: string) {
  const { data } = await api.get<Review[]>(`/reviews/product/${productId}`)
  return data
}

export async function createReview(payload: CreateReviewPayload) {
  const { data } = await api.post<Review>('/reviews', payload)
  return data
}

export async function getMyReviews() {
  const { data } = await api.get<Review[]>('/reviews/me')
  return data
}
