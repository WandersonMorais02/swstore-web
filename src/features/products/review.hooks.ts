import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createReview,
  getMyReviews,
  getProductReviews
} from './review.service'
import type { CreateReviewPayload } from '../../types/review'

export function useProductReviews(productId?: string) {
  return useQuery({
    queryKey: ['reviews', 'product', productId],
    queryFn: () => getProductReviews(productId!),
    enabled: !!productId
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'product', variables.productId]
      })

      queryClient.invalidateQueries({
        queryKey: ['account', 'orders']
      })
    }
  })
}

export function useMyReviews() {
  return useQuery({
    queryKey: ['account', 'reviews'],
    queryFn: getMyReviews
  })
}
