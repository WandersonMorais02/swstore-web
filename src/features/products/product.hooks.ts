import { useQuery } from '@tanstack/react-query'
import {
  getCategories,
  getProductBySlug,
  getProducts
} from './product.service'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })
}

export function useProducts(params?: {
  search?: string
  categoryId?: string
  type?: string
}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params)
  })
}

export function useProduct(slug?: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug
  })
}
