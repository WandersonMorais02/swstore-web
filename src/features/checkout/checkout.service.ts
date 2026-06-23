import { api } from '../../services/api'
import type { CreateOrderPayload, Order } from '../../types/order'

export async function createOrderFromCart(payload: CreateOrderPayload) {
  const { data } = await api.post<Order>('/orders/from-cart', payload)
  return data
}

export async function createPaymentCheckout(orderId: string) {
  const { data } = await api.post<{
    checkoutUrl: string
    sandboxCheckoutUrl?: string
  }>(`/payments/checkout/${orderId}`)

  return data
}
