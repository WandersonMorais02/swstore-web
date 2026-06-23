import { useMutation } from '@tanstack/react-query'
import { createOrderFromCart, createPaymentCheckout } from './checkout.service'
import type { CreateOrderPayload } from '../../types/order'

export function useCreateOrderFromCart() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrderFromCart(payload)
  })
}

export function useCreatePaymentCheckout() {
  return useMutation({
    mutationFn: (orderId: string) => createPaymentCheckout(orderId)
  })
}
