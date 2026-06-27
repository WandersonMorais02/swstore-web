export type ReviewCustomer = {
  id?: string
  _id?: string
  name: string
  email?: string
  avatar?: {
    url: string
    path?: string
  } | null
}

export type Review = {
  id: string

  customerId: string | ReviewCustomer
  productId: string
  orderId: string

  rating: number
  title?: string
  comment?: string

  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export type CreateReviewPayload = {
  productId: string
  orderId: string
  rating: number
  title?: string
  comment?: string
}
