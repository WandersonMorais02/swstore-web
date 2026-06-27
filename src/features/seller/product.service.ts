import { api } from '../../services/api'
import type { UploadedFile } from './file.service'

export type ProductType = 'DIGITAL' | 'PHYSICAL' | 'HYBRID'

export type DownloadPlanPayload = {
  name: string
  price: number
  downloadLimit?: number | null
  isPermanent: boolean
}

export type ProductDimensionsPayload = {
  weight: number
  width: number
  height: number
  length: number
}

export type CreateProductPayload = {
  categoryId: string
  type: ProductType
  name: string
  description: string
  price: number
  promotionalPrice?: number | null

  previewImages?: UploadedFile[]
  digitalFiles?: UploadedFile[]

  stock?: number
  dimensions?: ProductDimensionsPayload

  downloadPlans?: DownloadPlanPayload[]
  tags?: string[]
  status?: 'DRAFT' | 'PENDING_APPROVAL'
}

export async function createSellerProduct(payload: CreateProductPayload) {
  const { data } = await api.post('/products', payload)
  return data
}
