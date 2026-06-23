import { api } from '../../services/api'
import type { UploadedFile } from './file.service'

export type CreateProductPayload = {
  categoryId: string
  type: 'DIGITAL' | 'PHYSICAL' | 'HYBRID'
  name: string
  description: string
  price: number
  promotionalPrice?: number | null

  previewImages?: UploadedFile[]
  digitalFiles?: UploadedFile[]

  stock?: number

  dimensions?: {
    weight: number
    width: number
    height: number
    length: number
  }

  downloadPlans?: {
    name: string
    price: number
    downloadLimit?: number | null
    isPermanent: boolean
  }[]
}

export async function createSellerProduct(payload: CreateProductPayload) {
  const { data } = await api.post('/products', payload)
  return data
}

