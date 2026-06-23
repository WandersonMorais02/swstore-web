/* eslint-disable @typescript-eslint/no-explicit-any */
export type OrderItem = {
  _id: string
  productId: any
  sellerId: any
  productType: 'DIGITAL' | 'PHYSICAL' | 'HYBRID'
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export type ShippingGroupPayload = {
  sellerId: string
  provider: 'LOCAL' | 'MELHOR_ENVIO' | 'PICKUP'
  quoteId?: string
  serviceName: string
  amount: number
  deliveryTime?: number
}

export type CreateOrderPayload = {
  addressId?: string
  shippingGroups?: ShippingGroupPayload[]
  couponCode?: string
}

export type Order = {
  id: string
  _id?: string
  code: string
  customerId?: any
  items?: OrderItem[]
  subtotal: number
  discountAmount: number
  shippingAmount: number
  total: number
  status: string
  createdAt?: string
}
