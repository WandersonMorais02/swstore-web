/* eslint-disable @typescript-eslint/no-explicit-any */
export type Review = {
  id: string
  customerId: any
  productId: any
  orderId: string
  rating: number
  title?: string
  comment?: string
  isActive: boolean
  createdAt: string
}

export type CreateReviewPayload = {
  productId: string
  orderId: string
  rating: number
  title?: string
  comment?: string
}
