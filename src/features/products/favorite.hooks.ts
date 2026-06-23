import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  checkFavorite,
  getMyFavorites,
  toggleFavorite
} from './favorite.service'

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => toggleFavorite(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    }
  })
}

export function useCheckFavorite(productId?: string) {
  return useQuery({
    queryKey: ['favorites', 'check', productId],
    queryFn: () => checkFavorite(productId!),
    enabled: !!productId,
    retry: false
  })
}

export function useMyFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: getMyFavorites
  })
}
