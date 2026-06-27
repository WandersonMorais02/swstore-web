export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  image?: ProductFile | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type ProductFile = {
  name: string
  url: string | null
  path: string
  mimeType: string
  size: number

  alt?: string
  isMain?: boolean
  order?: number
}

export type DownloadPlan = {
  _id?: string
  id?: string
  name: string
  price: number
  downloadLimit?: number | null
  isPermanent: boolean
}

export type ProductDimensions = {
  weight: number
  width: number
  height: number
  length: number
}

export type Product = {
  id: string

  sellerId:
    | string
    | {
        id?: string
        _id?: string
        name: string
        avatar?: ProductFile | null
        sellerProfile?: {
          storeName?: string
        }
      }

  categoryId:
    | string
    | {
        id?: string
        _id?: string
        name: string
        slug: string
      }

  type: 'DIGITAL' | 'PHYSICAL' | 'HYBRID'

  name: string
  slug: string
  description: string

  price: number
  promotionalPrice?: number | null

  previewImages: ProductFile[]
  digitalFiles?: ProductFile[]

  downloadPlans?: DownloadPlan[]

  stock?: number
  dimensions?: ProductDimensions

  status?: string
  rejectionReason?: string
  isActive?: boolean

  tags?: string[]

  averageRating?: number
  reviewsCount?: number

  createdAt: string
  updatedAt: string
}
