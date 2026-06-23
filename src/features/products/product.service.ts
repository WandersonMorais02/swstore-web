import { api } from '../../services/api'
import type { Category, Product } from '../../types/product'

export async function getCategories() {
  const { data } = await api.get<Category[]>('/categories', {
    params: {
      isActive: true
    }
  })

  return data
}

export async function getProducts(params?: {
  search?: string
  categoryId?: string
  type?: string
}) {
  const { data } = await api.get<Product[]>('/products', {
    params
  })

  return data
}

export async function getProductBySlug(slug: string) {
  const { data } = await api.get<Product>(`/products/slug/${slug}`)

  return data
}
