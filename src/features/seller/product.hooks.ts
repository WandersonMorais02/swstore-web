import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createSellerProduct,
  type CreateProductPayload
} from './product.service'

export function useCreateSellerProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createSellerProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'products'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
}
