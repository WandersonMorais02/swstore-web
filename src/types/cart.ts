import type { Product } from './product'

export type CartItem = {
  _id: string
  productId: Product
  planId: string | null
  quantity: number
}

export type Cart = {
  id: string
  customerId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export type AddCartItemPayload = {
  productId: string
  planId?: string | null
  quantity: number
}
