/* eslint-disable @typescript-eslint/no-explicit-any */
export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
}

export type ProductType = 'DIGITAL' | 'PHYSICAL' | 'HYBRID'

export type ProductFile = {
  name: string
  url: string
  path?: string
  mimeType?: string
  size?: number
}

export type DownloadPlan = {
  _id: string
  name: string
  price: number
  downloadLimit: number | null
  isPermanent: boolean
}

export type Product = {
  id: string
  sellerId: any
  categoryId: any
  type: ProductType
  name: string
  slug: string
  description: string
  price: number
  promotionalPrice?: number | null
  previewImages: ProductFile[]
  downloadPlans?: DownloadPlan[]
  stock?: number
  dimensions?: {
    weight: number
    width: number
    height: number
    length: number
  }
  averageRating?: number
  reviewsCount?: number
  tags?: string[]
}
