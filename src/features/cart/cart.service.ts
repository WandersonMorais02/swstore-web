import { api } from '../../services/api'
import type { AddCartItemPayload, Cart } from '../../types/cart'

export async function getCart() {
  const { data } = await api.get<Cart>('/cart/me')
  return data
}

export async function addCartItem(payload: AddCartItemPayload) {
  const { data } = await api.post<Cart>('/cart/items', payload)
  return data
}

export async function updateCartItem(itemId: string, quantity: number) {
  const { data } = await api.patch<Cart>(`/cart/items/${itemId}`, { quantity })
  return data
}

export async function removeCartItem(itemId: string) {
  const { data } = await api.delete<Cart>(`/cart/items/${itemId}`)
  return data
}

export async function clearCart() {
  const { data } = await api.delete<Cart>('/cart/clear')
  return data
}
