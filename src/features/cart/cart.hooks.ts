import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem
} from './cart.service'
import type { AddCartItemPayload } from '../../types/cart'

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    retry: false
  })
}

export function useAddCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddCartItemPayload) => addCartItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  })
}
